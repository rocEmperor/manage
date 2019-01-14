import DashboardService from './../../services/DashboardService';

export default {
  namespace: 'CommunityDataModel',
  state: {
    device: {},
    totalDevice: [
      { name: "一星", value: 1 },
      { name: "2星", value: 5 },
      { name: "3星", value: 10 },
      { name: "4星", value: 5 },
      { name: "5星", value: 30 }
    ],
    totalRepair: {},
    totalPatrol: {},
    totalPark: {},
    totalPerson: {},
    totalHouseStatus: {},
    totalHouseType: {},
    totalParkStatus: {},
  },
  reducers: {
    concat(state, { payload }) {
      return { ...state, ...payload };
    }
  },
  effects: {
    *init({ payload }, { call, put, select }) {
      yield put({
        type: 'communityData',
        payload: {
          community_id: sessionStorage.getItem("communityId"),
        }
      });
    },
    *communityData({ payload }, { call, put, select }) {
      const { data, code } = yield call(DashboardService.communityData, payload);
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: {
            device: data.device,
            totalRepair: data.repair,
            totalPatrol: data.patrol,
            totalPark: data.park,
            totalPerson: data.people,
            totalHouseStatus: data.house.status_data,
            totalHouseType: data.house,
            totalParkStatus:data.parking_lot
          }
        });
      }
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, search }) => {
        if (pathname === '/communityData') {
          dispatch({ type: 'init' });
        }
      })
    }
  }
}