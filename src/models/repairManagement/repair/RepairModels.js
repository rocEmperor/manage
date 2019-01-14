import { message } from 'antd';
import RepairManagementService from '../../../services/RepairManagementService';
import { download } from '../../../utils/util';
import queryString from 'query-string';
const initialState = {
  community_id: sessionStorage.getItem("communityId"),
  is_reset: false,
  query: {
    community_id: sessionStorage.getItem("communityId"),
    group: '',
    building: '',
    room: '',
    unit: '',
  },
  list: [],
  paginationTotal: '',
  status: [],
  fromList: [],
  userInfo: '',
  type: [],
  show: false,
  visible1: false,  //工单分配modal
  visible3: false, //标记完成
  id: "", //要分配的工单ID
  operator_name: '',
  peopleGroups: [],
  user: [],
  show_amount: false,
  visible: false,
  visible4: false,
  visible2: false,
  statusId: '',//首页快速链接待办事项
  epair_type_desc: undefined,
  amount: undefined,
  repair_no: undefined,
};
const initialParams = {
  page: 1,
  rows: 10,
  community_id: sessionStorage.getItem("communityId"),
  building: undefined,
  create_at_end: undefined,
  create_at_start: undefined,
  group: undefined,
  listStatus: undefined,
  member_mobile: undefined,
  member_name: undefined,
  operator_name: undefined,
  repair_from: undefined,
  repair_no: undefined,
  repair_type: undefined,
  room: undefined,
  status: undefined,
  unit: undefined,
};
export default {
  namespace: 'Repair',
  state: { ...initialState, params: { ...initialParams } },
  reducers: {
    concat(state, { payload }) {
      return { ...state, ...payload };
    }
  },
  effects: {
    *init({ payload }, { call, put, select }) {
      yield put({ type: 'concat', payload: { ...initialState, params: { ...initialParams } } });
      const community_id = sessionStorage.getItem("communityId");
      yield put({
        type: 'concat',
        payload: {
          is_reset: true,
          community_id: sessionStorage.getItem("communityId")
        }
      });
      yield put({
        type: 'getRepairType',
        payload: { community_id }
      });
      yield put({
        type: 'getGroups',
        payload: { community_id }
      });
      yield put({
        type: 'getRepairFromList',
        payload: {}
      });
      yield put({
        type: 'getRepairStatus',
        payload: {}
      });
      yield put({
        type: 'getUserInfo',
        payload: {}
      });
    },
    *getRepairList({ payload }, { call, put, select }) {
      const params = yield select(state => state.Repair.params);
      const newParams = Object.assign(params, payload);
      const { data, code } = yield call(RepairManagementService.repairList, payload);
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
    *getUserInfo({ payload }, { call, put, select }) {
      const { data, code } = yield call(RepairManagementService.getUserInfo, payload);
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: {
            userInfo: data
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
    *getRepairStatus({ payload }, { call, put, select }) {
      const { data, code } = yield call(RepairManagementService.getRepairStatus, payload);
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: {
            status: data.list
          }
        });
      }
    },
    *getGroupGetGroups({ payload }, { call, put, select }) {
      const { data, code } = yield call(RepairManagementService.groupGetGroups, payload);
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: {
            peopleGroups: data.list
          }
        });
      }
    },
    *getGroupUsers({ payload }, { call, put, select }) {
      const { data, code } = yield call(RepairManagementService.getGroupUsers, payload);
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: {
            user: data.list
          }
        });
      }
    },
    *getAssignRepair({ payload }, { call, put, select }) {
      const { code } = yield call(RepairManagementService.assignRepair, payload);
      if (code == 20000) {
        message.success('操作成功！');
        yield put({
          type: 'concat',
          payload: {
            visible1: false
          }
        });
        yield put({
          type: 'getRepairList',
          payload: {
            community_id: sessionStorage.getItem("communityId"),
            page: 1,
            rows: 10
          }
        });
      }
    },
    *repairMakePay({ payload }, { call, put, select }) {
      const { code } = yield call(RepairManagementService.repairMakePay, payload);
      if (code == 20000) {
        message.success('操作成功！');
        yield put({
          type: 'concat',
          payload: {
            visible4: false
          }
        });
        yield put({
          type: 'getRepairList',
          payload: {
            community_id: sessionStorage.getItem("communityId"),
            page: 1,
            rows: 10
          }
        });
      }
    },
    *nullifyRepair({ payload,callBack }, { call, put }) {
      const { code } = yield call(RepairManagementService.nullifyRepair, { repair_id: payload.repair_id, });
      if (code == 20000) {
        message.destroy();
        message.success("操作成功！");
        callBack&&callBack()
      }
    },
    *repairCreateNew({ payload }, { call, put }) {
      const { code } = yield call(RepairManagementService.repairCreateNew, payload);
      if (code == 20000) {
        message.destroy();
        message.success("操作成功！");
        yield put({
          type: 'getRepairList',
          payload: {
            community_id: sessionStorage.getItem("communityId"),
            page: 1,
            rows: 10
          }
        });
      }
    },
    *checkHard({ payload }, { call, put, select }) {
      const { code } = yield call(RepairManagementService.checkHard, payload);
      const { statusId } = yield select(state => state.Repair);
      if (code === 20000) {
        message.destroy();
        message.success("操作成功!");
        yield put({
          type: 'concat',
          payload: {
            visible: false
          }
        })
        yield put({
          type: 'getRepairList',
          payload: {
            page: 1, rows: 10, status: statusId, community_id: sessionStorage.getItem("communityId")
          }
        });
        // yield put({ type: 'init' });
      }
    },
    *repairReview({ payload }, { call, put }) {
      const { code } = yield call(RepairManagementService.repairReview, payload);
      if (code === 20000) {
        message.destroy();
        message.success("操作成功!");
        yield put({
          type: 'concat',
          payload: {
            visible2: false
          }
        })
        yield put({
          type: 'getRepairList',
          payload: {
            community_id: sessionStorage.getItem("communityId"),
            page: 1,
            rows: 10
          }
        });
      }
    },
    *repairExport({ payload }, { call, put }) {
      const { data, code } = yield call(RepairManagementService.repairExport, payload);
      if (code == 20000) {
        download(data.down_url);
        message.success('导出成功！');
      }
    }
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, search }) => {
        if (pathname === '/repair') {
          let query = queryString.parse(search);
          dispatch({ type: 'init' });
          if (query.id) {
            dispatch({ type: 'concat', payload: { statusId: query.id } });
            dispatch({ type: 'getRepairList', payload: { page: 1, rows: 10, status: query.id, community_id: sessionStorage.getItem("communityId") } })
          } else {
            dispatch({ type: 'concat', payload: { statusId: '' } });
            dispatch({ type: 'getRepairList', payload: { page: 1, rows: 10, status: '', community_id: sessionStorage.getItem("communityId") } });
          }
        }
      });
    }
  },
};
