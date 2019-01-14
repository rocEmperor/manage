import { message } from 'antd';
import CarEquipManagementService from '../../services/CarEquipManagementService';
export default {
  namespace: 'ConfigFeeRule',
  state: {
    list: [],
    typeOption: [],
    totals: '',
    id: '',
    show:false,
    params: {
      page: 1,
      rows: 10,
      community_id: sessionStorage.getItem("communityId")
    },
    modalTitle: "新增规则"
  },
  reducers: {
    concat(state, { payload }) {
      return { ...state, ...payload };
    }
  },
  effects: {
    *init({ payload }, { call, put }) {
      let query = {
        params: {
          page: 1,
          rows: 10,
        },
      }
      yield put({type: 'getChargeList', payload: query.params});
      yield put({ type: 'concat', payload: query });
      yield put({ type: 'getChargeType' });
    },
    *getChargeList({ payload }, { call, put, select }) {
      const params = yield select(state => state.ConfigFeeRule.params);
      const newParams = Object.assign(params, payload);
      const { data, code } = yield call(CarEquipManagementService.ChargeList, params);
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: {
            list: data ? data.list : [],
            totals: parseInt(data.totals),
            params: newParams
          }
        });
      }
    },
    *getDelete({ payload }, { call, put }) {
      const { code } = yield call(CarEquipManagementService.Delete, payload);
      if (code == 20000) {
        message.success('删除成功!');
        yield put({
          type: 'concat',
          payload: {
            show: false
          }
        });
        yield put({ type: 'init' });
      }
    },
    *getAdd({ payload }, { call, put }) {
      const { code } = yield call(CarEquipManagementService.Add, payload);
      if (code == 20000) {
        message.success('增加成功!');
        yield put({
          type: 'concat',
          payload: {
            show: false
          }
        });
        yield put({ type: 'init' });
      }
    },
    *getChargeType({ payload }, { call, put }) {
      const { data, code } = yield call(CarEquipManagementService.ChargeType, payload);
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: {
            typeOption: data.types
          }
        });
      }
    },
    *getEdit({ payload }, { call, put }) {
      const { code } = yield call(CarEquipManagementService.Edit, payload);
      if (code == 20000) {
        message.success('编辑成功!');
        yield put({
          type: 'concat',
          payload: {
            show: false
          }
        });
        yield put({ type: 'init' });
      }
    }
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, search }) => {
        if (pathname === '/configFeeRule') {
          dispatch({ type: 'init' });
        }
      });
    }
  }
}