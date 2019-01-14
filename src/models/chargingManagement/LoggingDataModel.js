import ChargingManagementService from '../../services/ChargingManagementService';
import queryString from 'query-string';
import { routerRedux } from 'dva/router';
import { message } from 'antd';
export default {
  namespace: 'LoggingDataModel',
  state:{
    community_id: sessionStorage.getItem("communityId"),
    statusType:'',
    visible:false,
    visible1:false,
    list:[],
    totals:'',
    current:1,
    id:'',
    loading: false
  },
  reducers: {
    concat(state, { payload }) {
      return { ...state, ...payload };
    }
  },
  effects:{
    *init({ payload }, { call, put }) {
    },
    *sharedPeriodRecordList({ payload }, { call, put,select }){
      yield put({type: 'concat', payload: {loading: true}});
      const { data, code } = yield call(ChargingManagementService.sharedPeriodRecordList, payload);
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: {
            list: data.list,
            totals:data.totals,
            id:payload.period_id,
            loading: false
          }
        });
      }
    },
    *importSuccess ({ payload }, { call, put, select }) {
      let id = yield select(state => state.LoggingDataModel.id);
      yield put({
        type: 'sharedPeriodRecordList',
        payload: {
          period_id:id
        }
      })
    },
    *sharedPeriodShow({ payload }, { call, put,select }){
      const { data, code } = yield call(ChargingManagementService.sharedPeriodShow, payload);
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: {
            statusType:data.status
          }
        });
      }
    },
    //账期抄表数据删除
    *recordDelete({ payload,callBack }, { call, put,select }){
      const {code } = yield call(ChargingManagementService.recordDelete, payload);
      let id = yield select(state => state.LoggingDataModel.id);
      if (code == 20000) {
        message.success("删除成功！");
        yield put({
          type: 'sharedPeriodRecordList',
          payload: {
            period_id:id
          }
        })
      }
    },
    //生成账单
    *createBill({ payload,callBack }, { call, put,select }){
      const {code } = yield call(ChargingManagementService.createBill, payload);
      let ViewData = yield select(state => state.LoggingDataModel);
      if (code == 20000) {
        message.success("生成账单成功!");
        yield put({
          type: 'concat',
          payload: {
            visible1:false,
          }
        });
        yield put(routerRedux.push(`/loggingView?period_id=${ViewData.id}&status=${ViewData.statusType}`));
      }
    },
    *downFiles({ payload, callback }, { call, put, select }) {
      const { data, code } = yield call(ChargingManagementService.sharedPeriodGetExcel, payload);
      if(code == 20000){
        yield put({
          type: 'concat',
          payload: {

          }
        })
      }
      callback&&callback(data.down_url);
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, search }) => {
        if (pathname === '/loggingData') {
          const query = queryString.parse(search);
          dispatch({ type: 'init' });
          dispatch({ type: 'sharedPeriodRecordList',payload:{period_id:query.id}});
          dispatch({ type: 'sharedPeriodShow',payload:{id:query.id}});
        }
      });
    }
  },
}
