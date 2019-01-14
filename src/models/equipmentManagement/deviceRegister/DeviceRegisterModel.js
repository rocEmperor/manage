import { message } from 'antd';
import EquipmentManagementService from '../../../services/EquipmentManagementService';
import { getCommunityId } from '../../../utils/util';

export default {
  namespace: 'DeviceRegister',
  state: {
    params: {
      page: 1,
      rows: 10,
      community_id: ''
    },
    list: [],
    paginationTotal: "",
    statusType: [{
      id: '',
      name: "全部"
    }, {
      id: "1",
      name: "合格"
    }, {
      id: "2",
      name: "不合格"
    }],
    categoryIdType: [],
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
      const { params } = yield select(state => state.DeviceRegister);
      yield put({
        type: 'concat',
        payload: {
          is_reset: true,
          params: { ...params, community_id }
        }
      });
      yield put({
        type: 'getDeviceRepairList', payload: {
          page: 1,
          rows: 10,
          community_id,
          device_id: '',
          repair_person: '',
          status: '',
          start_at: '',
          end_at: ''
        }
      });
      yield put({
        type: 'getDeviceDropDown', payload: { community_id }
      });
    },
    *getDeviceRepairList({ payload }, { call, put, select }) {/*保养登记列表*/
      const params = yield select(state => state.DeviceRegister.params);
      const newParams = Object.assign(params, payload);
      const { data, code } = yield call(EquipmentManagementService.deviceRepairList, newParams);
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
    *getDeviceRepairDelete({ payload }, { call, put, select }) {/*保养登记删除*/
      const { code } = yield call(EquipmentManagementService.deviceRepairDelete, payload);
      if (code == 20000) {
        message.success('删除成功！');
        yield put({
          type: 'getDeviceRepairList', payload: {
            page: 1,
            rows: 10
          }
        });
      }
    },
    *downFiles({ payload, callback }, { call, put, select }) {/*保养登记导出*/
      const { data, code } = yield call(EquipmentManagementService.deviceRepairExport, payload);
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
        if (pathname === '/deviceRegister') {
          dispatch({ type: 'init' });
        }
      });
    }
  },
};
