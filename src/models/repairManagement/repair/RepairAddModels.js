import { message } from 'antd';
import RepairManagementService from '../../../services/RepairManagementService';

export default {
  namespace: 'RepairAdd',
  state: {
    community_id: sessionStorage.getItem("communityId"),
    fromList: [],
    type: [],
    types: true,//默认户内
    groupData: [],
    buildingData: [],
    unitData: [],
    roomData: [],
    query: {
      community_id: sessionStorage.getItem("communityId"),
      group: '',
      building: '',
      room: '',
      unit: '',
    }
  },
  reducers: {
    concat(state, { payload }) {
      return { ...state, ...payload };
    }
  },
  effects: {
    *init({ payload }, { call, put, select }) {
      const community_id = sessionStorage.getItem("communityId");
      yield put({
        type: 'concat',
        payload: {
          community_id: sessionStorage.getItem("communityId"),
          fromList: [],
          type: [],
          types: true,//默认户内
          groupData: [],
          buildingData: [],
          unitData: [],
          roomData: [],
          query: {
            community_id: sessionStorage.getItem("communityId"),
            group: '',
            building: '',
            room: '',
            unit: '',
          },
        }
      });
      yield put({
        type: 'getRepairType',
        payload: { community_id }
      });
      yield put({
        type: 'getRepairFromList',
        payload: {}
      });
      yield put({
        type: 'getGroups',
        payload: { community_id }
      });
    },
    *getRepairType({ payload }, { call, put, select }) {
      const { data, code } = yield call(RepairManagementService.getRepairType, payload);
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: {
            type: data
          }
        });
      }
    },
    *getRepairFromList({ payload }, { call, put, select }) {
      const { data, code } = yield call(RepairManagementService.repairFromList, payload);
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: {
            fromList: data
          }
        });
      }
    },
    *getGroups({ payload }, { call, put, select }) {
      const { data, code } = yield call(RepairManagementService.getGroups, payload);
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
      const { data, code } = yield call(RepairManagementService.getBuildings, payload);
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: {
            buildingData: data
          }
        });
      }
    },
    *getUnits({ payload }, { call, put, select }) {
      const { data, code } = yield call(RepairManagementService.getUnits, payload);
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: {
            unitData: data
          }
        });
      }
    },
    *getRooms({ payload }, { call, put, select }) {
      const { data, code } = yield call(RepairManagementService.getRooms, payload);
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: {
            roomData: data
          }
        });
      }
    },
    *getAddRepair({ payload }, { call, put, select }) {
      const { code } = yield call(RepairManagementService.addRepair, payload);
      if (code == 20000) {
        message.success('新增成功！');
        setTimeout(() => {
          history.go(-1);
        }, 1000)
      }
    }
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, search }) => {
        if (pathname === '/repairAdd') {
          dispatch({ type: 'init' });
        }
      });
    }
  },
};
