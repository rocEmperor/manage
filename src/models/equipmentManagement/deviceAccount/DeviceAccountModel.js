import { message } from 'antd';
import EquipmentManagementService from '../../../services/EquipmentManagementService';
import { getCommunityId } from '../../../utils/util';

export default {
  namespace: 'DeviceAccount',
  state: {
    params: {
      page: 1,
      rows: 10,
      community_id: ''
    },
    list: [],
    paginationTotal: "",
    statusType: [{
      name: "全部",
      id: ""
    }, {
      name: "运行",
      id: "1"
    }, {
      name: "报废",
      id: "2"
    }],
    categoryIdType: [],
    treeData: [],
    is_reset: false,
    deviceIdType: []
  },
  reducers: {
    concat(state, { payload }) {
      return { ...state, ...payload };
    }
  },
  effects: {
    *init({ payload }, { call, put, select }) {
      const community_id = getCommunityId();
      const { params } = yield select(state => state.DeviceAccount);
      yield put({
        type: 'concat',
        payload: {
          is_reset: true,
          params: { ...params, community_id }
        }
      });
      yield put({
        type: 'getDeviceList', payload: {
          page: 1,
          rows: 10,
          community_id,
          device_id: '',
          device_no: '',
          status: '',
          category_id: ''
        }
      });
      yield put({
        type: 'getDeviceCategoryDropDown', payload: { community_id }
      });
      yield put({
        type: 'getDeviceDropDown', payload: { community_id }
      });
    },
    *getDeviceList({ payload }, { call, put, select }) {
      const params = yield select(state => state.DeviceAccount.params);
      const newParams = Object.assign(params, payload);
      const { data, code } = yield call(EquipmentManagementService.deviceList, newParams);
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
    *getDeviceCategoryDropDown({ payload }, { call, put, select }) {
      const { code, data } = yield call(EquipmentManagementService.deviceCategoryDropDown, payload);
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: {
            treeData: data
          }
        });
      }
    },
    *getDeviceDelete({ payload }, { call, put, select }) {
      const { code } = yield call(EquipmentManagementService.deviceDelete, payload);
      if (code == 20000) {
        message.success('删除成功！');
        yield put({
          type: 'getDeviceList', payload: {
            page: 1,
            rows: 10
          }
        });
      }
    },
    *downFiles({ payload, callback }, { call, put, select }) {/*保养登记导出*/
      const { data, code } = yield call(EquipmentManagementService.deviceExport, payload);
      if (code == 20000) {
        message.success('导出成功！');
        callback && callback(data.down_url);
      }
    },
    *getDeviceDropDown({ payload }, { call, put, select }) {
      const { code, data } = yield call(EquipmentManagementService.deviceDropDown, payload);
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: {
            deviceIdType: data
          }
        });
      }
    }

  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, search }) => {
        if (pathname === '/deviceAccount') {
          dispatch({ type: 'init' });
        }
      });
    }
  },
};
