import CommunityManagementService from './../../services/CommunityManagementService';
import queryString from 'query-string';
export default {
  namespace: 'ResidentsViewTwoModel',
  state: {
    infoList: {},
    previewVisible: false,
    previewImage: ''
  },
  reducers: {
    concat(state, { payload }) {
      return { ...state, ...payload };
    }
  },
  effects: {
    *init ({ payload }, { call, put, select }) {
      let query = payload.query;
      yield put({
        type: 'getInfo',
        payload: { id: query.id }
      })
    },
    *getInfo ({ payload }, { call, put, select }) {
      let defaultParam = {};
      payload = Object.assign({}, defaultParam, payload);
      const { code, data } = yield call(CommunityManagementService.auditShow, payload);
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: { infoList: data ? data: {} }
        })
      }
    }
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, search }) => {
        let query = queryString.parse(search);
        if (pathname === '/residentsViewTwo') {
          dispatch({ type: 'init', payload: {query: query}});
        }
      });
    }
  }
}
