import SystemSettingsService from '../../../services/SystemSettingsService';
// import { message } from 'antd';
const initialState = {
  is_reset:false,
  params: {
    page: 1,
    rows: 10,
    community_id: sessionStorage.getItem("communityId"),
    name:"",
    operate_time_start:"",
    operate_time_end:"",
  },
  list: [],
  paginationTotal: ''
};
export default {
  namespace: 'LogManagement',
  state: {...initialState},
  reducers: {
    concat(state, { payload }) {
      return { ...state, ...payload };
    }
  },
  effects: {
    *init({ payload }, { call, put, select }) {
      yield put({type: 'concat', payload: {...initialState}});
      let LogManagement = yield select(state => state.LogManagement);
      let { params } = LogManagement;
      params.community_id = sessionStorage.getItem("communityId");
      yield put({type: 'getCommOperateLog',payload: {
        page: 1,
        rows: 10,
        community_id: sessionStorage.getItem("communityId"),
        name:"",
        operate_time_start:"",
        operate_time_end:"",
      }});
      yield put({ type: 'concat', payload: {
        is_reset:true,
        params: params
      } });
    },
    *getCommOperateLog({ payload }, { call, put, select }) {
      const params = yield select(state => state.LogManagement.params);
      const newParams = Object.assign(params, payload);
      const { data, code } = yield call(SystemSettingsService.commOperateLog, params);
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: {
            list: data.list,
            paginationTotal: data.totals,
            params: newParams
          }
        });
      }
    }
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, search }) => {
        if (pathname === '/logManagement') {
          dispatch({ type: 'init' });
        }
      });
    }
  },
};
