import DeviceManagementService from '../../services/DeviceManagementService';
import { getCommunityId } from '../../utils/util';
const { opendoorLog, getGroups, getBuildings, getUnits } = DeviceManagementService;
const initialState = {
  data: [],
  totals: '',
  groupData: [],
  buildingData: [],
  is_reset:false,
  unitData: [],
  group: '',
  params: {
    page: 1,
    rows: 10,
    community_id: getCommunityId(),
    username:"",
    group:"",
    building:"",
    unit:"",
    start:"",
    end:""
  },
  query: {
    community_id: sessionStorage.getItem("communityId"),
    group: '',
    building: '',
    unit: '',
  },
  loading: false
};
export default {
  namespace: 'DeviceLog',
  state: {...initialState},
  reducers: {
    concat(state, { payload }) {
      return { ...state, ...payload };
    }
  },
  effects: {
    *init({ payload }, { call, put,select }) {
      yield put({type: 'concat', payload: {...initialState}});
      let DeviceLog = yield select(state => state.DeviceLog);
      let { params,query } = DeviceLog;
      params.community_id = sessionStorage.getItem("communityId");
      let querys = {
        is_reset:true,
        params: {
          page: 1,
          rows: 10,
          community_id: getCommunityId(),
          username:"",
          group:"",
          building:"",
          unit:"",
          start:"",
          end:""
        },
      }
      yield put({ type: 'getOpendoorLog', payload: querys.params});
      yield put({ type: 'concat', payload: {
        is_reset:true,
        params: params,
        query: query,
      } });
      yield put({
        type: 'getGroups', payload: {
          community_id: getCommunityId()
        }
      });
    },
    *getOpendoorLog({ payload }, { call, put, select }) {
      yield put({ type: 'concat', payload: { loading: true } });
      const params = yield select(state => state.DeviceLog.params);
      const newParams = Object.assign(params, payload);
      const { data, code } = yield call(opendoorLog, params);
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: {
            data: data ? data.list : [],
            totals: parseInt(data.total),
            params: newParams,
            loading: false
          }
        });
      }
    },
    *getGroups({ payload }, { call, put, select }) {
      const { data, code } = yield call(getGroups, payload);
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: {
            groupData: data
          }
        });
      }
    },
    *getBuildings({ payload }, { call, put, select }) {
      const { data, code } = yield call(getBuildings, payload);
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: {
            buildingData: data,
            unitData: []
          }
        });
      }
    },
    *getUnits({ payload }, { call, put, select }) {
      const { data, code } = yield call(getUnits, payload);
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: {
            unitData: data
          }
        });

      }
    }
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, search }) => {
        if (pathname === '/deviceLog') {
          dispatch({ type: 'init' });
        }
      });
    }
  },
};
