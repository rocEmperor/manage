import PropertyServices from './../../services/PropertyServices.js';
import queryString from 'query-string';

const initialState = {
  list: [],
  totals: '',
  info:'',
  previewVisible:false, 
  previewImage:'',
  params: {
    page: 1,
    rows: 10,
    community_id: sessionStorage.getItem("communityId"),
  }
}
export default {
  namespace: 'CheckDetailModel',
  state: { ...initialState },
  reducers: {
    concat(state, { payload }) {
      return {
        ...state,
        ...payload
      };
    }
  },
  effects: {
    *init({ payload }, { call, put }) {
      yield put({ type: 'concat', payload: { ...initialState } });
      yield put({
        type: 'checkShowList',
        payload: {
          page: 1,
          rows: 10,
          id:payload.id,
        }
      })
      yield put({
        type: 'checkShowBasic',
        payload: {
          id: payload.id,
        }
      })
    },
    *checkShowBasic({ payload }, { call, put, select }) {
      const { data, code } = yield call(PropertyServices.checkShowBasic, payload);
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: {
            info: data,
          }
        })
      }
    },
    *checkShowList({ payload }, { call, put, select }) {
      const params = yield select(state => state.CheckDetailModel.params);
      const newParams = Object.assign(params, payload);
      const { data, code } = yield call(PropertyServices.checkShowList, params);
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: {
            list: data ? data.list : [],
            totals: parseInt(data.totals),
            params: newParams,
          }
        })
      }
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, search }) => {
        let query = queryString.parse(search);
        if (pathname === '/checkDetail') {
          dispatch({ type: 'init', payload: { id:query.id } });
        }
      })
    }
  }
}
