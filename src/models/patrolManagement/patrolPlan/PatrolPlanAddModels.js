import { message } from 'antd';
import PatrolManagementService from '../../../services/PatrolManagementService';

export default {
  namespace: 'PatrolPlanAdd',
  state: {
    community_id: sessionStorage.getItem("communityId"),
    detail: {},
    selectExecType: '',
    visible: false,
    userList: [],
    lineList: [],
    execType: [],
    startValue: null
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
          community_id: community_id,
          selectExecType:'',
        }
      });
      yield put({
        type: 'getPlanLineList',
        payload: { community_id }
      });
      yield put({
        type: 'getExecType',
        payload: {}
      });
    },
    *getPlanLineList({ payload }, { call, put, select }) {
      const { data, code } = yield call(PatrolManagementService.planLineList, payload);
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: {
            lineList: data
          }
        });
      }
    },
    *getExecType({ payload }, { call, put, select }) {
      const { data, code } = yield call(PatrolManagementService.getExecType, payload);
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: {
            execType: data
          }
        });
      }
    },
    *getPlanUserList({ payload }, { call, put, select }) {
      const { data, code } = yield call(PatrolManagementService.planUserList, payload);
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: {
            userList: data,
            visible: true
          }
        });
      }
    },
    *getPlanAdd({ payload }, { call, put, select }) {
      const { code } = yield call(PatrolManagementService.planAdd, payload);
      if (code == 20000) {
        message.success('新增成功！');
        setTimeout(() => {
          location.href = "#/patrolPlan";
        }, 1000)
        yield put({
          type: 'concat',
          payload: {
            visible: false
          }
        });
      }
    }
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, search }) => {
        if (pathname === '/patrolPlanAdd') {
          dispatch({ type: 'init' });
        }
      });
    }
  },
};
