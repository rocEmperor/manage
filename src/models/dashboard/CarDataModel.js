import DashboardService from './../../services/DashboardService';

export default {
  namespace: 'CarDataModel',
  state: {
    time: '',
    exit: '',
    entry: '',
    visitor: '',
    free: '',
    totalsScale: {},
    device:[],
    flag:1, 
    deviceFlag:'',
  },
  reducers: {
    concat(state, { payload }) {
      return { ...state, ...payload };
    }
  },
  effects: {
    *init({ payload }, { call, put, select }) {
      yield put({
        type: 'todayCar',
        payload: {
          community_id: sessionStorage.getItem("communityId"),
        }
      });
      yield put({
        type: 'carTraffic',
        payload: {
          community_id: sessionStorage.getItem("communityId"),
          type: 1
        }
      });
    },
    *todayCar({ payload }, { call, put, select }) {
      const { data, code } = yield call(DashboardService.todayCar, payload);
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: {
            exit: data.in,
            entry: data.out,
            visitor: data.remain,
            free: data.visitors,
          }
        });
      }
    },
    *carTraffic({ payload }, { call, put, select }) {
      const { data, code } = yield call(DashboardService.carTraffic, payload);
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: {
            totalsScale: data
          }
        });
        if (payload.device == undefined) {
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
        if (pathname === '/carData') {
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