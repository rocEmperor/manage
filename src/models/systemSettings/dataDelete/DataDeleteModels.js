import { message } from 'antd';
import SystemSettingsService from '../../../services/SystemSettingsService';
const initialState = {
  params: {
    page: 1,
    rows: 10,
    community_id: sessionStorage.getItem("communityId"),
    group: '',
    building: '',
    unit: '',
    room: '',
    costList: [],
    acct_period: ''
  },
  query: {
    community_id: sessionStorage.getItem("communityId"),
    group: '',
    building: '',
    unit: '',
  },
  communityList: [],
  groupData: [],
  buildingData: [],
  is_reset: false,
  unitData: [],
  roomData: [],
  costType: [],
  selectedRowKeys: [],
  selectedIds: [],
  loading: false
};
export default {
  namespace: 'DataDelete',
  state: {...initialState},
  reducers: {
    concat(state, { payload }) {
      return { ...state, ...payload };
    }
  },
  effects: {
    *init({ payload }, { call, put, select }) {
      yield put({type: 'concat', payload: {...initialState}});
      let DataDelete = yield select(state => state.DataDelete);
      let { query, params } = DataDelete;
      query.community_id = sessionStorage.getItem("communityId");
      params.community_id = sessionStorage.getItem("communityId");
      yield put({
        type: 'concat',
        payload: {
          is_reset:true,
          query: query,
          params: params
        }
      });
      const communityList = yield select(state => state.MainLayout.communityList);
      yield put({
        type: 'concat',
        payload: {
          communityList: communityList,
          params: {
            page: 1,
            rows: 10,
            community_id: sessionStorage.getItem("communityId"),
            group: '',
            building: '',
            unit: '',
            room: '',
            costList: [],
            acct_period: '',
            status: "1"
          },
          query: {
            community_id: sessionStorage.getItem("communityId"),
            group: '',
            building: '',
            unit: '',
          },
        }
      });
      yield put({
        type: 'getDelBillList',
        payload: {
          page: 1,
          rows: 10,
          community_id: sessionStorage.getItem("communityId"),
          group: '',
          building: '',
          unit: '',
          room: '',
          costList: [],
          acct_period: '',
          status: "1"
        }
      });
      yield put({
        type: 'getPayList',
        payload: {}
      });
    },
    *getDelBillList({ payload }, { call, put, select }) {
      yield put({ type: 'concat', payload: { loading: true } });
      const params = yield select(state => state.DataDelete.params);
      const newParams = Object.assign(params, payload);
      const { data, code } = yield call(SystemSettingsService.delBillList, payload);
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: {
            list: data.list,
            paginationTotal: data.totals,
            params: newParams,
            loading: false
          }
        });
      }
    },
    *getPayList({ payload }, { call, put, select }) {
      const { data, code } = yield call(SystemSettingsService.payList, payload);
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: {
            costType: data
          }
        });
      }
    },
    *getDelBillCheck({ payload }, { call, put, select }) {
      const { code } = yield call(SystemSettingsService.delBillCheck, payload);
      const params = yield select(state => state.DataDelete.params);
      if (code == 20000) {
        message.success('删除成功！');
        yield put({
          type: 'getDelBillList', payload: params
        });
        yield put({
          type: 'concat',
          payload: {
            selectedRowKeys: []
          }
        });
      }else{
        yield put({
          type: 'getDelBillList', payload: params
        });
        yield put({
          type: 'concat',
          payload: {
            selectedRowKeys: []
          }
        });
      }
    },
    *getDelBillAll({ payload }, { call, put, select }) {
      const { code } = yield call(SystemSettingsService.delBillCheck, payload);
      const params = yield select(state => state.DataDelete.params);
      if (code == 20000) {
        message.success('删除成功！');
        yield put({
          type: 'getDelBillList', payload: params
        });
      }else{
        yield put({
          type: 'getDelBillList', payload: params
        });
        yield put({
          type: 'concat',
          payload: {
            selectedRowKeys: []
          }
        });
      }
    }
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, search }) => {
        if (pathname === '/dataDelete') {
          dispatch({ type: 'init' });
        }
      });
    }
  },
};
