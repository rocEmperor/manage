import queryString from 'query-string';
import RepairManagementService from '../../../services/RepairManagementService';

export default {
  namespace: 'RepairView',
  state: {
    type: '',
    visable: false,
    data: {},
    previewVisible: false,
    previewImage: '',
    community_id: sessionStorage.getItem("communityId"),
  },
  reducers: {
    concat(state, { payload }) {
      return { ...state, ...payload };
    }
  },
  effects: {
    *init({ payload }, { call, put, select }) {
      const community_id = sessionStorage.getItem("communityId");
      yield put({
        type: 'concat',
        payload: { community_id }
      });
      yield put({
        type: 'getRepairType',
        payload: { community_id }
      });
      yield put({
        type: 'getRepairFromList',
        payload: {}
      });
      yield put({
        type: 'getGroups',
        payload: { community_id }
      });
    },
    *getRepairShow({ payload }, { call, put, select }) {
      const { data, code } = yield call(RepairManagementService.repairShow, payload);
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: {
            data: data
          }
        });
      }
    },
    *getRepairMaterial({ payload }, { call, put, select }) {
      const { code } = yield call(RepairManagementService.getRepairMaterial, payload);
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: {
            // data: data
          }
        });
      }
    }
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, search }) => {
        const query = queryString.parse(search);
        if (pathname === '/repairView') {
          if (query.id && query.type) {
            dispatch({
              type: 'concat', payload: {
                type: query.type
              }
            })
            dispatch({ type: 'getRepairShow', payload: { repair_id: query.id, page: 1, rows: 10 } });
            dispatch({ type: 'getRepairMaterial', payload: { repair_id: query.id } });
          }
        }
      });
    }
  },
};
