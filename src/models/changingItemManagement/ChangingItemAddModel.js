import ChangingItemManagementService from '../../services/ChangingItemManagementService';
import queryString from 'query-string';
import { message } from 'antd';
const { billCostAddReq, billCostEditReq, billCostInfoList } = ChangingItemManagementService;

export default {
  namespace: 'ChangingItemAddModel',
  state: {
    loading: false,
    info: ''
  },
  reducers: {
    concat (state, { payload }) {
      return { ...state, ...payload }
    }
  },
  effects: {
    *init ({ payload }, { call, put, select }) {
      if(payload.hasOwnProperty('queryId')){
        yield put({
          type: 'billCostInfo',
          payload: {
            id: payload.queryId
          }
        })
      } else {
        yield put({
          type: 'concat',
          payload: { info: '' }
        })
      }
    },
    *billCostAdd ({ payload, callback, err }, { call, put, select }) {
      let defaultParam = {};
      payload = Object.assign({}, defaultParam, payload);
      yield put({type: 'concat', payload: { loading: true }});
      const { code } = yield call(billCostAddReq, payload);
      if (code === 20000) {
        yield put({type: 'concat', payload: { loading: false }});
        message.success("新增成功！");
        callback && callback();
      } else {
        err && err()
      }
    },
    *billCostEdit ({ payload, callback, err }, { call, put, select }) {
      let defaultParam = {};
      payload = Object.assign({}, defaultParam, payload);
      yield put({type: 'concat', payload: { loading: true }});
      const { code } = yield call(billCostEditReq, payload);
      if (code === 20000) {
        yield put({type: 'concat', payload: { loading: false }});
        message.success("编辑成功！")
        callback && callback()
      } else {
        err && err()
      }
    },
    *billCostInfo ({ payload }, { call, put, select }) {
      let defaultParam = {};
      payload = Object.assign({}, defaultParam, payload);
      yield put({type: 'concat', payload: { loading: true }});
      const { data, code } = yield call(billCostInfoList, payload);
      if (code === 20000) {
        yield put({
          type: 'concat',
          payload: {
            loading: false,
            info: data
          }
        })
      }
    }
  },
  subscriptions: {
    setup ({ dispatch, history }) {
      return history.listen(({ pathname, search }) => {
        let query = queryString.parse(search);
        if (pathname === '/changingItemAdd') {
          if (query.id) {
            dispatch({ type: 'init', payload: { queryId: query.id } })
          } else {
            dispatch({ type: 'init', payload: {} })
          }
        }
      })
    }
  }
}
