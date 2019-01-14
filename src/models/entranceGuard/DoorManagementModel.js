import { message } from 'antd';
import EntranceGuardService from './../../services/EntranceGuardService';

const initialState = {
  list: [],
  treeData: [],
  supplierOption: [],
  totals: '',
  is_reset: false,
  id: '',
  params: {
    page: 1,
    rows: 10,
    community_id: sessionStorage.getItem("communityId"),
    device_id: "",
    status: "",
    supplier_id: "",
    unit_id: "",
    start_time: '',
    end_time: '',
  }
}
export default {
  namespace: 'DoorManagement',
  state: { ...initialState },
  reducers: {
    concat(state, { payload }) {
      return {
        ...state,
        ...payload
      };
    }
  },
  effects: {
    *init({ payload }, { call, put }) {
      yield put({ type: 'concat', payload: { ...initialState } });
      yield put({
        type: 'concat',
        payload: {
          is_reset: true,
          params: {
            page: 1,
            rows: 10,
            community_id: sessionStorage.getItem("communityId"),
            device_id: "",
            status: "",
            supplier_id: "",
            unit_id: "",
            start_time: '',
            end_time: '',
          }
        }
      })
      // 列表
      yield put({
        type: 'smartDoorList', payload: {
          page: 1,
          rows: 10,
          community_id: sessionStorage.getItem("communityId"),
          device_id: "",
          status: "",
          supplier_id: "",
          unit_id: "",
          start_time: '',
          end_time: '',
        }
      });

      // 苑/期/区
      yield put({
        type: 'getPermissionsOption', payload: {
          community_id: sessionStorage.getItem("communityId")
        }
      });

      // 供应商列表
      yield put({
        type: 'getSupplierOption', payload: {
          community_id: sessionStorage.getItem("communityId")
        }
      });
    },
    *smartDoorList({ payload }, { call, put, select }) {
      const params = yield select(state => state.DoorManagement.params);
      const newParams = Object.assign(params, payload);
      const { data, code } = yield call(EntranceGuardService.smartDoorList, params);
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: {
            list: data ? data.list : [],
            totals: data.totals,
            params: newParams
          }
        })
      }
    },
    *getPermissionsOption({ payload }, { call, put, select }) {
      const { data, code } = yield call(EntranceGuardService.getPermissionsOption, payload);
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: {
            treeData: data
          }
        })
      }
    },
    *getSupplierOption({ payload }, { call, put, select }) {
      const { data, code } = yield call(EntranceGuardService.getSupplierOption, payload);
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: {
            supplierOption: data.supplier
          }
        })
      }
    },
    *doorDelete({ payload }, { call, put, select }) {
      const { code } = yield call(EntranceGuardService.doorDelete, payload);
      if (code == 20000) {
        message.success('删除成功！');
        yield put({
          type: 'smartDoorList', payload: {
            page: 1,
            rows: 10,
            device_id: "",
            status: "",
            supplier_id: "",
            unit_id: "",
            start_time: '',
            end_time: '',
          }
        });
      }
    },
    *disabledDropDown({ payload }, { call, put, select }) {
      const { code } = yield call(EntranceGuardService.disabledDropDown, payload);
      if (code == 20000) {
        message.success('操作成功！');
        yield put({
          type: 'smartDoorList', payload: {
            page: 1,
            rows: 10,
            device_id: "",
            status: "",
            supplier_id: "",
            unit_id: "",
            start_time: '',
            end_time: '',
          }
        });
      }
    }
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, search }) => {
        if (pathname === '/doorManagement') {
          dispatch({ type: 'init' });
        }
      })
    }
  }
}
