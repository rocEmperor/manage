import ChargingManagementService from '../../services/ChargingManagementService';
import { message } from 'antd';
import { getCommunityId } from '../../utils/util'
export default {
  namespace: 'ReadingManagementModel',
  state:{
    is_reset:false,
    community_id: getCommunityId(),
    list: [],
    totals:'',
    current: 1,
    dadaId:'',
    modalShow:false,
    visitShow:false,
    statusType:'',
    period_end:'',
    period_start:'',
    curTabPaneKey:'1',
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
        type:'concat',payload:{
          curTabPaneKey:'1',
          is_reset:true,
          current: 1,
        }
      })
      const curTabPaneKey = yield select(state => state.ReadingManagementModel.curTabPaneKey);
      yield put({
        type: 'getMeterReadingList', payload: { community_id: getCommunityId(),type:curTabPaneKey,page:1,row:10 }
      });
    },
    *getMeterReadingList({ payload,callBack }, { call, put }){
      //yield put({type: 'concat', payload: {loading: true}});
      const { data, code } = yield call(ChargingManagementService.getMeterReadingList, payload);
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
      callBack&&callBack()
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
    // 公摊项目新增
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
    //水电表新增
    *getMeterReadingAdd({payload,callBack}, {call, put}) {
      const { code } = yield call(ChargingManagementService.getMeterReadingAdd, payload);
      if(code == 20000){
        message.success("新增成功！");
        yield put({
          type: 'concat',
          payload: {
            visitShow:false,
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
    //水电表删除
    *meterReadingDelete({payload,callBack}, {call, put}) {
      const { code } = yield call(ChargingManagementService.meterReadingDelete, payload);
      if(code == 20000){
        message.success("删除成功！");
        callBack&&callBack()
      }
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, search }) => {
        if (pathname === '/readingManagement') {
          dispatch({ type: 'init' });
        }
      });
    }
  },
}
