import DashboardService from './../../services/DashboardService';

export default {
  namespace: 'PersonDataModel',
  state: {
    time: '',
    totalPerson: [],
    totalStyle: [],
    totalsScale: {},
    flag: 1,
    deviceFlag: "",
    device:[]
  },
  reducers: {
    concat(state, { payload }) {
      return { ...state, ...payload };
    }
  },
  effects: {
    *init({ payload }, { call, put, select }) {
      yield put({
        type: 'todayExit',
        payload: {
          community_id: sessionStorage.getItem("communityId"),
        }
      });
      yield put({
        type: 'exitTraffic',
        payload: {
          community_id: sessionStorage.getItem("communityId"),
          type: 1
        }
      });
    },
    *todayExit({ payload }, { call, put, select }) {
      const { data, code } = yield call(DashboardService.todayExit, payload);
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: {
            totalPerson: data ? data.users : [],
            totalStyle: data? data.travel : []
          }
        });
      }
    },
    *exitTraffic({ payload }, { call, put, select }) {
      const { data, code } = yield call(DashboardService.exitTraffic, payload);
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: {
            totalsScale: data
          }
        });
        if(payload.device == undefined){
          yield put({
            type: 'concat',
            payload: {
              device: data.device
            }
          });
        }
      }
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, search }) => {
        if (pathname === '/personData') {
          dispatch({ type: 'init' });
          dispatch({type: 'concat', payload:{
            flag: 1,
            deviceFlag:""
          }})
        }
      })
    }
  }
}