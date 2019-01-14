import queryString from 'query-string';
import PatrolManagementService from '../../../services/PatrolManagementService';

export default {
  namespace: 'PatrolPlanView',
  state: {
    detail: {},
    selectExecType: ''
  },
  reducers: {
    concat(state, { payload }) {
      return { ...state, ...payload };
    }
  },
  effects: {
    *getPlanDetail({ payload }, { call, put, select }) {
      const { data, code } = yield call(PatrolManagementService.planDetail, payload);
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: {
            selectExecType: data.exec_type,
            detail: data
          }
        });
      }
    }
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, search }) => {
        if (pathname === '/patrolPlanView') {
          const query = queryString.parse(search);
          if (query.id) {
            dispatch({ type: 'getPlanDetail', payload: { id: query.id } });
          }
        }
      });
    }
  },
};
