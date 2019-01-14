import { message } from 'antd';
import RepairManagementService from '../../../services/RepairManagementService';
import { download } from '../../../utils/util';

const initialState = {
  fromList: [],
  type: [],
  status: [],
  is_reset: false,
  query: {
    community_id: sessionStorage.getItem("communityId"),
    group: '',
    building: '',
    room: '',
    unit: '',
  },
  params: {
    page: 1,
    rows: 10,
    community_id: sessionStorage.getItem("communityId"),
    repair_no: '',
    status: '',
    repair_type: '',
    repair_from: '',
    group: '',
    building: '',
    unit: '',
    room: '',
    create_at_end: '',
    create_at_start: '',
    check_at_end: '',
    check_at_start: '',
    operator_name: '',
    member_mobile: '',
    member_name: '',
  },
  list: [],
  paginationTotal: '',
  id: "", //要分配的工单ID
  visible2: false,
}
export default {
  namespace: 'Hard',
  state: {...initialState},
  reducers: {
    concat(state, { payload }) {
      return { ...state, ...payload };
    }
  },
  effects: {
    *init({ payload }, { call, put, select }) {
      yield put({type: 'concat', payload: {...initialState}});
      const community_id = sessionStorage.getItem("communityId");
      yield put({
        type: 'concat',
        payload: {
          community_id: sessionStorage.getItem("communityId"),
          is_reset: true,
          params: {
            page: 1,
            rows: 10,
            community_id: sessionStorage.getItem("communityId"),
          },
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
        type: 'getRepairStatus',
        payload: { type:1}
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
        type: 'getHardList',
        payload: {
          page: 1,
          rows: 10,
          community_id: sessionStorage.getItem("communityId")
        }
      });
    },
    *hardExport({ payload }, { call, put, select }) {
      const { data, code } = yield call(RepairManagementService.hardExport, payload);
      if (code == 20000) {
        download(data.down_url);
        message.success('导出成功！');
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
    *getHardList({ payload }, { call, put, select }) {
      const params = yield select(state => state.Hard.params);
      const newParams = Object.assign(params, payload);
      const { data, code } = yield call(RepairManagementService.hardList, params);
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
    *nullifyRepair({ payload }, { call, put }) {
      const { code } = yield call(RepairManagementService.nullifyRepair, { repair_id: payload.repair_id, });
      if (code == 20000) {
        message.destroy();
        message.success("操作成功！");
        yield put({
          type: 'getHardList',
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
        if (pathname === '/hard') {
          dispatch({ type: 'init' });
        }
      });
    }
  },
};
