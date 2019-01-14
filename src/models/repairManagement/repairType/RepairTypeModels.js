import { message } from 'antd';
import RepairManagementService from '../../../services/RepairManagementService';

export default {
  namespace: 'RepairType',
  state: {
    params: {
      page: 1,
      rows: 10,
      community_id: sessionStorage.getItem("communityId"),
    },
    list: [],
    visible: false,
    info: '',
    show_parent: false,
    level: [],
    levelList: [],
  },
  reducers: {
    concat(state, { payload }) {
      return { ...state, ...payload };
    }
  },
  effects: {
    *init({ payload }, { call, put, select }) {
      yield put({
        type: 'getRepairTypeList',
        payload: {
          page: 1,
          rows: 10
        }
      });
      yield put({
        type: 'getRepairTypeLevel',
        payload: {}
      });

    },
    *getRepairTypeList({ payload }, { call, put, select }) {
      const params = yield select(state => state.RepairType.params);
      const newParams = Object.assign(params, payload);
      const { data, code } = yield call(RepairManagementService.repairTypeList, params);
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: {
            list: data,
            params: newParams
          }
        });
      }
    },
    *getRepairTypeLevel({ payload }, { call, put, select }) {
      const { data, code } = yield call(RepairManagementService.repairTypeLevel, payload);
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: {
            level: data,
          }
        });
      }
    },
    *getRepairTypeLevelList({ payload, callback }, { call, put, select }) {
      const { data, code } = yield call(RepairManagementService.repairTypeLevelList, payload);
      if (code == 20000) {
        callback && callback(data);
        yield put({
          type: 'concat',
          payload: {
            levelList: data,
          }
        });
      }
    },
    *getRepairTypeStatus({ payload, callback }, { call, put, select }) {
      const { code } = yield call(RepairManagementService.repairTypeStatus, payload);
      if (code == 20000) {
        yield put({
          type: 'getRepairTypeList',
          payload: {
            page: 1,
            rows: 10
          }
        });
      }
    },
    *getRepairTypeAdd({ payload, callback }, { call, put, select }) {
      const { data, code } = yield call(RepairManagementService.repairTypeAdd, payload);
      if (code == 20000) {
        callback && callback(data);
        message.success("操作成功");
        yield put({
          type: 'concat',
          payload: {
            visible: false,
            info: '',
          }
        });
        yield put({
          type: 'getRepairTypeList',
          payload: {
            page: 1,
            rows: 10
          }
        });
      }
    },
    *getRepairTypeEdit({ payload, callback }, { call, put, select }) {
      const { data, code } = yield call(RepairManagementService.repairTypeEdit, payload);
      if (code == 20000) {
        callback && callback(data);
        message.success("操作成功");
        yield put({
          type: 'concat',
          payload: {
            visible: false,
            info: '',
          }
        });
        yield put({
          type: 'getRepairTypeList',
          payload: {
            page: 1,
            rows: 10
          }
        });
      }
    }

  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, search }) => {
        if (pathname === '/repairType') {
          dispatch({ type: 'init' });
        }
      });
    }
  },
};
