import DeviceManagementService from '../../services/DeviceManagementService';
const { deviceList, getGroups, deviceCommon, getBuildings, getUnits } = DeviceManagementService;
import { getCommunityId } from '../../utils/util';
const initialState = {
  data: [],
  totals: '',
  groupData: [],
  buildingData: [],
  unitData: [],
  door_type: [],
  group: '',
  loading: false,
  is_reset:false,
  params: {
    page: 1,
    rows: 10,
    community_id: getCommunityId(),
    device_id:"",
    group:"",
    building:"",
    unit:"",
    type:""
  },
  query: {
    community_id: sessionStorage.getItem("communityId"),
    group: '',
    building: '',
    unit: '',
  },
};
export default {
  namespace: 'DeviceManagement',
  state: {...initialState},
  reducers: {
    concat(state, { payload }) {
      return { ...state, ...payload };
    }
  },
  effects: {
    *init({ payload }, { call, put,select }) {
      yield put({type: 'concat', payload: {...initialState}});
      let DeviceManagement = yield select(state => state.DeviceManagement);
      let { params,query } = DeviceManagement;
      params.community_id = sessionStorage.getItem("communityId");
      let querys = {
        is_reset:true,
        params: {
          page: 1,
          rows: 10,
          community_id: getCommunityId(),
          device_id:"",
          group:"",
          building:"",
          unit:"",
          type:""
        },
      }
      yield put({ type: 'getDeviceList', payload: querys.params});
      yield put({ type: 'concat', payload: {
        is_reset:true,
        params: params,
        query: query,
      } });
      yield put({ type: 'deviceCommon' });
      yield put({
        type: 'getGroups', payload: {
          community_id: getCommunityId()
        }
      });
    },
    *getDeviceList({ payload }, { call, put, select }) {
      yield put({ type: 'concat', payload: { loading: true } });
      const params = yield select(state => state.DeviceManagement.params);
      const newParams = Object.assign(params, payload);
      const { data, code } = yield call(deviceList, params);
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
    *deviceCommon({ payload }, { call, put, select }) {
      const { data, code } = yield call(deviceCommon, payload);
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: {
            door_type: data.door_type
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
        if (pathname === '/deviceManagement') {
          dispatch({ type: 'init' });
        }
      });
    }
  },
};
