import ChargingManagementService from '../../services/ChargingManagementService';
import { message } from 'antd';
import { getCommunityId } from '../../utils/util'
export default {
  namespace: 'PublicAccountManagementModel',
  state:{
    community_id: getCommunityId(),
    list:[],
    totals:'',
    current: 1,
    dadaId:'',
    modalShow:false,
    statusType:'',
    period_end:'',
    period_start:'',
    loading: false
  },
  reducers: {
    concat(state, { payload }) {
      return { ...state, ...payload };
    }
  },
  effects:{
    *init({ payload }, { call, put, select }) {
      yield put({
        type: 'sharedPeriodList', payload: { community_id: getCommunityId() }
      });
    },
    *sharedPeriodList({ payload }, { call, put }){
      yield put({type: 'concat', payload: {loading: true}});
      const { data, code } = yield call(ChargingManagementService.sharedPeriodList, payload);
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: {
            list: data.list,
            totals:data.totals,
            loading: false
          }
        });
      }
    },
    *sharedPeriodShow({ payload,callBack }, { call, put }){
      const { data, code } = yield call(ChargingManagementService.sharedPeriodShow, payload);
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: {
            info: data,
            dadaId:data.id,
          }
        });
        callBack&&callBack(data)
      }
    },
    //编辑
    *electrictReadingEdit({payload,callBack}, {call, put}) {
      const { code } = yield call(ChargingManagementService.sharedPeriodEdit, payload);
      if(code == 20000){
        message.success("编辑成功！");
        yield put({
          type: 'concat',
          payload: {
            modalShow:false,
          }
        });
        callBack&&callBack()
      }
    },
    // 新增
    *electrictReadingAdd({payload,callBack}, {call, put}) {
      const { code } = yield call(ChargingManagementService.sharedPeriodAdd, payload);
      if(code == 20000){
        message.success("新增成功！");
        yield put({
          type: 'concat',
          payload: {
            modalShow:false,
          }
        });
        callBack&&callBack()
      }
    },
    //删除
    *sharedPeriodDelete({payload,callBack}, {call, put}) {
      const { code } = yield call(ChargingManagementService.sharedPeriodDelete, payload);
      if(code == 20000){
        message.success("删除成功！");
        callBack&&callBack()
      }
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, search }) => {
        if (pathname === '/billManagement') {
          dispatch({ type: 'init' });
        }
      });
    }
  },
}
