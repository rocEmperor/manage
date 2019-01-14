import CarEquipManagementService from './../../services/CarEquipManagementService';
export default {
  namespace: 'ParkingInformationModels',
  state: {
    info: '',
  },
  reducers: {
    concat(state, { payload }) {
      return { ...state, ...payload };
    }
  },
  effects: {
    *info({ payload }, { call, put }) {
      const { data, code } = yield call(CarEquipManagementService.Carreport, payload);
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: {
            info: data
          }
        });
      }
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, search }) => {
        if (pathname === '/parkingInformation') {
          dispatch({ type: 'info', payload: { community_id: sessionStorage.getItem("communityId") } });
        }
      });
    }
  },
};
