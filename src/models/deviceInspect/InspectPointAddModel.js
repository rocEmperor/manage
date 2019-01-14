import { message } from 'antd';
import queryString from 'query-string';
import DeviceInspectService from '../../services/DeviceInspectService';

export default {
  namespace: 'InspectPointAdd',
  state: {
    id: '',
    pointsdetail: {},
    show: '',
    cityName: '杭州市',
    modalType: "2",
    location_name: '',
    map: '',
    community_id: sessionStorage.getItem("communityId"),
    positionType: [],
    photoType: [],
    treeData: [],
    deviceIdType: [],
  },
  reducers: {
    concat(state, { payload }) {
      return { ...state, ...payload };
    }
  },
  effects: {
    *init({ payload }, { call, put, select }) {
      yield put({
        type: 'getLocation',
        payload: {}
      });
      yield put({
        type: 'getPhoto',
        payload: {}
      });
      yield put({
        type: 'getDeviceCategoryDropDown',
        payload: {
          community_id: sessionStorage.getItem("communityId"),
        }
      });
    },
    *getPointsDetail({ payload }, { call, put, select }) {
      const { data, code } = yield call(DeviceInspectService.pointsDetail, payload);
      if (code == 20000) {
        yield put({
          type: 'deviceDropDown', payload: { community_id: data.community_id, category_id: data.category_id }
        });
        yield put({
          type: 'concat',
          payload: {
            pointsdetail: data,
            modalType: data.need_location,
            map: data.lon + ',' + data.lat,
            location_name: data.location_name
          }
        });
      }
    },
    *getDeviceCategoryDropDown({ payload }, { call, put, select }) {
      const { data, code } = yield call(DeviceInspectService.deviceCategoryDropDown, payload);
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: {
            treeData: data ? data : []
          }
        });
      }
    },
    *deviceDropDown({ payload }, { call, put, select }) {
      const { data, code } = yield call(DeviceInspectService.deviceDropDown, payload);
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: {
            deviceIdType: data ? data : []
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
    *getPointsAdd({ payload }, { call, put, select }) {
      const { code } = yield call(DeviceInspectService.getPointsAdd, payload);
      if (code == 20000) {
        message.success('新增成功！');
        setTimeout(() => {
          location.href = "#/inspectPointManagement";
        }, 1000)
      }
    },
    *getPointsEdit({ payload }, { call, put, select }) {
      const { code } = yield call(DeviceInspectService.getPointsEdit, payload);
      if (code == 20000) {
        message.success('编辑成功！');
        setTimeout(() => {
          location.href = "#/inspectPointManagement";
        }, 1000)
      }
    }
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, search }) => {
        const query = queryString.parse(search);
        function initData() {
          dispatch({ type: 'init' });
          dispatch({
            type: 'concat', payload: {
              id: query.id, pointsdetail: {}, modalType: "", map: "", location_name: "", deviceIdType: []
            }
          })
        }
        if (pathname === '/inspectPointAdd') {
          initData();
          if (query.id) {
            dispatch({ type: 'getPointsDetail', payload: { id: query.id, community_id: sessionStorage.getItem("communityId") } });
          }
        }
      });
    }
  },
};
