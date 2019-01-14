import { message } from 'antd';
import queryString from 'query-string';
import PatrolManagementService from '../../../services/PatrolManagementService';

export default {
  namespace: 'PatrolLineAddEdit',
  state: {
    community_id: sessionStorage.getItem("communityId"),
    id: '',
    detail: {},
    mockData: [],
    targetKeys: [],
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
        }
      });
      yield put({
        type: 'getPointsListUnchoose',
        payload: { community_id }
      });
    },
    *getPointsListUnchoose({ payload }, { call, put, select }) {
      const { data, code } = yield call(PatrolManagementService.pointsListUnchoose, payload);
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: {
            mockData: data,
          }
        });
      }
    },
    *getLineDetail({ payload }, { call, put, select }) {
      const { data, code } = yield call(PatrolManagementService.lineDetail, payload);
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: {
            detail: data,
            targetKeys: data.choose_list.map(item => item.key)
          }
        });
      }
    },
    *getLineAdd({ payload }, { call, put, select }) {
      const { code } = yield call(PatrolManagementService.lineAdd, payload);
      if (code == 20000) {
        message.success('新增成功！');
        setTimeout(() => {
          location.href = "#/patrolLine";
        }, 1000)
      }
    },
    *getLineEdit({ payload }, { call, put, select }) {
      const { code } = yield call(PatrolManagementService.lineEdit, payload);
      if (code == 20000) {
        message.success('编辑成功！');
        setTimeout(() => {
          location.href = "#/patrolLine";
        }, 1000)
      }
    }
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, search }) => {
        const query = queryString.parse(search);
        function initData() {
          dispatch({ type: 'init' });
          dispatch({
            type: 'concat', payload: {
              id: query.id,
              detail: {},
              mockData: [],
              targetKeys: [],
            }
          })
        }
        if (pathname === '/patrolLineAdd') {
          initData();
        } else if (pathname === '/patrolLineEdit') {
          initData();
          if (query.id) {
            dispatch({ type: 'getLineDetail', payload: { id: query.id } });
          }
        }
      });
    }
  },
};
