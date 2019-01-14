import { message } from 'antd';
import DeviceInspectService from '../../services/DeviceInspectService';
const initialState = {
  community_id: sessionStorage.getItem("communityId"),
  is_reset:false,
  params: {
    page: 1,
    rows: 10,
    community_id: sessionStorage.getItem("communityId"),
    device_id: '',
    need_location: '',
    need_photo: '',
  },
  list: [],
  paginationTotal: '',
  positionType: [],
  photoType: [],
  deviceIdType: [],
};
export default {
  namespace: 'InspectPointManagement',
  state: {...initialState},
  reducers: {
    concat(state, { payload }) {
      return { ...state, ...payload };
    }
  },
  effects: {
    *init({ payload }, { call, put, select }) {
      yield put({type: 'concat', payload: {...initialState}});
      let InspectPointManagement = yield select(state => state.InspectPointManagement);
      let { params } = InspectPointManagement;
      params.community_id = sessionStorage.getItem("communityId");
      yield put({
        type: 'concat',
        payload: {
          is_reset:true,
          params: params
        }
      });
      yield put({
        type: 'getPointsList', payload: {
          community_id:sessionStorage.getItem("communityId"),
          page: 1,
          rows: 10,
          device_id: '',
          need_location: '',
          need_photo: '',
        }
      });
      yield put({
        type: 'getLocation',
        payload: {}
      });
      yield put({
        type: 'getPhoto',
        payload: {}
      });
      yield put({
        type: 'deviceDropDown',
        payload: {
          community_id:sessionStorage.getItem("communityId"),
        }
      });
    },
    *deviceDropDown({ payload }, { call, put, select }) {
      const { data,code } = yield call(DeviceInspectService.deviceDropDown, payload);
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: {
            deviceIdType:data?data:[]
          }
        });
      }
    },
    *getPointsList({ payload }, { call, put, select }) {
      const params = yield select(state => state.InspectPointManagement.params);
      const newParams = Object.assign(params, payload);
      const { data, code } = yield call(DeviceInspectService.getPointsList, params);
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: {
            list: data.list,
            paginationTotal: data.totals,
            params: newParams
          }
        });
      }
    },
    *getLocation({ payload }, { call, put, select }) {
      const { data, code } = yield call(DeviceInspectService.getLocation, payload);
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: {
            positionType: data
          }
        });
      }
    },
    *getPhoto({ payload }, { call, put, select }) {
      const { data, code } = yield call(DeviceInspectService.getPhoto, payload);
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: {
            photoType: data
          }
        });
      }
    },
    *getPointsDelete({ payload }, { call, put, select }) {
      const { code } = yield call(DeviceInspectService.pointsDelete, payload);
      if (code == 20000) {
        message.success('删除成功！');
        yield put({
          type: 'getPointsList', payload: {
            page: 1,
            rows: 10,
            device_id: '',
            need_location: '',
            need_photo: '',
          }
        });
      }
    },
    *downFiles({ payload, callback }, { call, put, select }) {
      const { data, code } = yield call(DeviceInspectService.pointsDownload, payload);
      if(code == 20000){
        yield put({
          type: 'concat',
          payload: {
            
          }
        })
      }
      callback&&callback(data.down_url);
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, search }) => {
        if (pathname === '/inspectPointManagement') {
          dispatch({ type: 'init' });
        }
      });
    }
  },
};
