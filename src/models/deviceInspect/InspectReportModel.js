import DeviceInspectService from '../../services/DeviceInspectService';

export default {
  namespace: 'InspectReport',
  state: {
    loading: false,
    params: {
      page: 1,
      rows: 5,
      start_at: '',
      end_at: ''
    },
    device:{},
    issue:{},
    inspect:{},
    paginationTotal:"",
    errorData:{},
    paginationTotals:""
  },
  reducers: {
    concat(state, { payload }) {
      return { ...state, ...payload };
    }
  },
  effects: {
    *init({ payload }, { call, put, select }) {
      const community_id = sessionStorage.getItem("communityId");
      const { params } = yield select(state => state.InspectReport);
      yield put({
        type: 'concat',
        payload: {
          params: { ...params, community_id }
        }
      });
      let params2 = {
        page: 1,
        rows: 5,
        start_at:'',
        end_at:'',
        community_id:sessionStorage.getItem("communityId")
      }
      yield put({
        type: 'inspectData', payload: params2
      });
      yield put({
        type: 'errorData', payload: params2
      });
      yield put({
        type: 'deviceErrorData', payload: {
          community_id: sessionStorage.getItem("communityId")
        }
      });
    },
    *inspectData({ payload }, { call, put, select }) {
      const params = yield select(state => state.InspectReport.params);
      const newParams = Object.assign(params, payload);
      const { data, code } = yield call(DeviceInspectService.inspectData, newParams);
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: {
            inspect: data,
            paginationTotal: data.totals,
            params: newParams
          }
        });
      }
    },
    *errorData({ payload }, { call, put, select }) {
      const params = yield select(state => state.InspectReport.params);
      const newParams = Object.assign(params, payload);
      const { data, code } = yield call(DeviceInspectService.errorData, newParams);
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: {
            errorData: data,
            paginationTotals: data.totals,
            params: newParams
          }
        });
      }
    },
    *deviceErrorData({ payload }, { call, put, select }) {
      const { data, code } = yield call(DeviceInspectService.deviceErrorData, payload);
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: {
            device: data?data.device:{},
            issue: data?data.issue:{}
          }
        });

      }
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, search }) => {
        if (pathname === '/inspectReport') {
          dispatch({ type: 'init' });
        }
      });
    }
  },
};