import { message } from 'antd';
import queryString from 'query-string';
import PatrolManagementService from '../../../services/PatrolManagementService';

export default {
  namespace: 'PatrolPlanEdit',
  state: {
    community_id: sessionStorage.getItem("communityId"),
    detail: {},
    selectExecType: '',
    visible: false,
    userList: [],
    lineList: [],
    execType: [],
    selectUserList: []
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
        type: 'getPlanLineList',
        payload: { community_id }
      });
      yield put({
        type: 'getExecType',
        payload: {}
      });
    },
    *getPlanDetail({ payload }, { call, put, select }) {
      const { data, code } = yield call(PatrolManagementService.planDetail, payload);
      if (code == 20000) {
        yield put({
          type: 'getPlanUserList',
          payload: { ...data }
        });
        yield put({
          type: 'concat',
          payload: {
            selectExecType: data.exec_type,
            selectUserList: data.user_list,
            detail: data
          }
        });
      }
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
            userList: data
          }
        });
      }
    },
    *getPlanEdit({ payload }, { call, put, select }) {
      const { code } = yield call(PatrolManagementService.planEdit, payload);
      if (code == 20000) {
        message.success('编辑成功！');
        setTimeout(() => {
          location.href = "#/patrolPlan";
        }, 1000)
      }
    }
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, search }) => {
        if (pathname === '/patrolPlanEdit') {
          dispatch({ type: 'init' });
          const query = queryString.parse(search);
          if (query.id) {
            dispatch({ type: 'getPlanDetail', payload: { id: query.id } });
          }
          dispatch({
            type: 'concat', payload: {
              id: query.id
            }
          })
        }
      });
    }
  },
};
