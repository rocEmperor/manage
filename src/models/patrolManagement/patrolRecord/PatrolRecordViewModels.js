import queryString from 'query-string';
import PatrolManagementService from '../../../services/PatrolManagementService';

export default {
  namespace: 'PatrolRecordView',
  state: {
    previewVisible: false,
    previewImage: '',
    detail: {}
  },
  reducers: {
    concat(state, { payload }) {
      return { ...state, ...payload };
    }
  },
  effects: {
    *getRecordDetail({ payload }, { call, put, select }) {
      const { data, code } = yield call(PatrolManagementService.recordDetail, payload);
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: {
            detail: data
          }
        });
      }
    }
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, search }) => {
        const query = queryString.parse(search);
        if (pathname === '/patrolRecordView') {
          if (query.id) {
            dispatch({ type: 'getRecordDetail', payload: { id: query.id } });
          }
        }
      });
    }
  },
};
