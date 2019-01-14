import { message } from 'antd';
import DeviceInspectService from '../../services/DeviceInspectService';
const initialState = {
  is_reset: false,
  params: {
    page: 1,
    rows: 10,
    community_id: sessionStorage.getItem("communityId"),
    plan_id: '',
    line_id: '',
    status: '',
    user_id: '',
    exec_type: ''
  },
  list: [],
  paginationTotal: '',
  lines: [],
  plans: [],
  userList: []
};
export default {
  namespace: 'InspectPlanManagement',
  state: { ...initialState },
  reducers: {
    concat(state, { payload }) {
      return { ...state, ...payload };
    }
  },
  effects: {
    *init({ payload }, { call, put, select }) {
      yield put({ type: 'concat', payload: { ...initialState } });
      let InspectPlanManagement = yield select(state => state.InspectPlanManagement);
      let { params } = InspectPlanManagement;
      params.community_id = sessionStorage.getItem("communityId");
      yield put({
        type: 'getPlanList', payload: {
          page: 1,
          rows: 10,
          community_id: sessionStorage.getItem("communityId"),
          plan_id: '',
          line_id: '',
          status: '',
          user_id: '',
          exec_type: ''
        }
      });
      yield put({
        type: 'concat', payload: {
          is_reset: true,
          params: params
        }
      });
      yield put({
        type: 'lineDropDown',
        payload: {
          community_id: sessionStorage.getItem("communityId")
        }
      })

      yield put({
        type: 'planDropDown',
        payload: {
          community_id: sessionStorage.getItem("communityId")
        }
      })
      yield put({
        type: 'userList',
        payload: {
          community_id: sessionStorage.getItem("communityId")
        }
      })
    },
    *getPlanList({ payload }, { call, put, select }) {
      const params = yield select(state => state.InspectPlanManagement.params);
      const newParams = Object.assign(params, payload);
      const { data, code } = yield call(DeviceInspectService.getPlanList, params);
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
    *lineDropDown({ payload }, { call, put, select }) {
      const { data, code } = yield call(DeviceInspectService.lineDropDown, payload);
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: {
            lines: data ? data.list : []
          }
        });
      }
    },
    *planStatus({ payload }, { call, put, select }) {
      const { code } = yield call(DeviceInspectService.planStatus, payload);
      if (code == 20000) {
        message.success('操作成功！');
        yield put({
          type: 'getPlanList', payload: {
            page: 1,
            rows: 10,
            plan_id: '',
            line_id: '',
            status: '',
            user_id: '',
            exec_type: ''
          }
        });
      }
    },
    *userList({ payload }, { call, put, select }) {
      const { data, code } = yield call(DeviceInspectService.userList, payload);
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: {
            userList: data ? data : []
          }
        });
      }
    },
    *planDropDown({ payload }, { call, put, select }) {
      const { data, code } = yield call(DeviceInspectService.planDropDown, payload);
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: {
            plans: data ? data.list : []
          }
        });
      }
    },
    *planDelete({ payload }, { call, put, select }) {
      const { code } = yield call(DeviceInspectService.planDelete, payload);
      if (code == 20000) {
        message.success('删除成功！');
        yield put({
          type: 'getPlanList', payload: {
            page: 1,
            rows: 10,
            plan_id: '',
            line_id: '',
            status: '',
            user_id: '',
            exec_type: ''
          }
        });
      }
    }
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, search }) => {
        if (pathname === '/inspectPlanManagement') {
          dispatch({ type: 'init' });
        }
      });
    }
  },
};
