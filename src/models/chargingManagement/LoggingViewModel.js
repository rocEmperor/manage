import ChargingManagementService from '../../services/ChargingManagementService';
import queryString from 'query-string';
import { message } from 'antd';
export default{
  namespace: 'LoggingViewModel',
  state:{
    community_id: sessionStorage.getItem("communityId"),
    data:[],
    totals:"",
    current: 1,
    statusType:'',
    period_id:'',
    params:{
      page:1,
      rows:10,
      group:'',
      building:'',
      unit:'',
      room:'',
      community_id:'',
      period_id:''
    }
  },
  reducers: {
    concat(state, { payload }) {
      return { ...state, ...payload };
    }
  },
  effects:{
    *init({ payload }, { call, put,select }) {
      yield put({
        type: 'sharedPeriodBillList', payload: {
          community_id:sessionStorage.getItem("communityId"),
          period_id:payload.period_id,
          page: 1,
          rows: 10,
          group:'',
          building:'',
          unit:'',
          room:'',
        }
      });
      yield put({
        type: 'concat',
        payload: {
          statusType: payload.statusType,
        }
      });
    },
    *sharedPeriodBillList({ payload }, { call, put,select }){
      const params = yield select(state=>state.LoggingViewModel.params);
      const newParams = Object.assign(params, payload);
      const { data, code } = yield call(ChargingManagementService.sharedPeriodBillList, payload);
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: {
            data: data?data.list:[],
            totals: data?data.totals:"",
            params: newParams,
            period_id:payload.period_id
          }
        });
      }
    },
    //取消发布账单
    *sharedPeriodCancelList({ payload,callBack }, { call, put, }){
      const { code } = yield call(ChargingManagementService.sharedPeriodCancelList, payload);
      if (code == 20000) {
        message.success("取消成功！");
        callBack && callBack()
      }
    },
    //发布账单
    *sharedPeriodpushBill({ payload }, { call, put, }){
      const { code } = yield call(ChargingManagementService.sharedPeriodpushBill, payload);
      if (code == 20000) {
        message.success("发布成功！");
        setTimeout(() => {
          window.location.href="#/billsType?type=1&costList=";
        },2000)
      }
    },
    *billDetail ({ payload, callback }, { call, put }) {
      const { data, code } = yield call(ChargingManagementService.billDetailReq, payload);
      if (code == 20000) {
        callback && callback(data.down_url)
      }
    }
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, search }) => {
        if (pathname === '/loggingView') {
          const query = queryString.parse(search);
          dispatch({ type: 'init',payload:{period_id:query.period_id,statusType:query.status} });
        }
      });
    }
  },
}
