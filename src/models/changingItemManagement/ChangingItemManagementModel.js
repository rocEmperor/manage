import ChangingItemManagementService from '../../services/ChangingItemManagementService';
import { message } from 'antd';
const { getBillCostList, getBillCostStatus } = ChangingItemManagementService;
const initialState = {
  loading: false,
  data: [],
  is_reset: false,
  paginationTotal: 0
}

export default {
  namespace: 'ChangingItemManagementModel',
  state: {...initialState},
  reducers: {
    concat(state, { payload }) {
      return { ...state, ...payload }
    }
  },
  effects: {
    *init({ payload }, { call, put, select }) {
      yield put({type: 'concat', payload: {...initialState}});
      let communityParams = {
        page: 1,
        rows: 10,
        community_id: sessionStorage.getItem("communityId"),
        status: '',
        name: ''
      };
      yield put({
        type: 'billCostList',
        payload: communityParams
      });
      yield put({
        type: 'concat',
        payload: {
          is_reset: true,
        }
      });
    },
    *billCostList({ payload }, { call, put, select }) {
      let defaultParam = { page: 1, rows: 10 };
      payload = Object.assign({}, defaultParam, payload);
      yield put({ type: 'concat', payload: { loading: true } });
      const { data, code } = yield call(getBillCostList, payload);
      if (code === 20000) {
        yield put({
          type: 'concat',
          payload: {
            loading: false,
            data: data.list,
            paginationTotal: data.totals
          }
        })
      }
    },
    *billCostStatus({ payload }, { call, put, select }) {
      let defaultParam = {};
      payload = Object.assign({}, defaultParam, payload);
      yield put({ type: 'concat', payload: { loading: true } });
      const { code } = yield call(getBillCostStatus, payload.data);
      if (code === 20000) {
        yield put({ type: 'concat', payload: { loading: false } });
        message.success("操作成功");
        yield put({
          type: 'billCostList',
          payload: payload.communityParams
        })
      }
    }
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname }) => {
        if (pathname === '/changingItemManagement') {
          dispatch({ type: 'init' });
        }
      })
    }
  }
}
