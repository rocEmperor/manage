import { message } from 'antd';
import PatrolManagementService from '../../../services/PatrolManagementService';
const initialState = {
  is_reset:false,
  params: {
    page: 1,
    rows: 10,
    community_id: sessionStorage.getItem("communityId"),
    name: '',
    head: '',
    points_name: ''
  },
  list: [],
  paginationTotal: ''
};
export default {
  namespace: 'PatrolLine',
  state: {...initialState},
  reducers: {
    concat(state, { payload }) {
      return { ...state, ...payload };
    }
  },
  effects: {
    *init({ payload }, { call, put, select }) {
      yield put({type: 'concat', payload: {...initialState}});
      let PatrolLine = yield select(state => state.PatrolLine);
      let { params } = PatrolLine;
      params.community_id = sessionStorage.getItem("communityId");
      yield put({
        type: 'concat', payload: {
          is_reset:true,
          params: params,
        }
      });
      yield put({
        type: 'getLineList', payload: {
          page: 1,
          rows: 10,
          name: '',
          head: '',
          points_name: ''
        }
      });
    },
    *getLineList({ payload }, { call, put, select }) {
      const params = {
        page: 1,
        rows: 10,
        community_id: sessionStorage.getItem("communityId"),
      }
      const newParams = Object.assign(params, payload);
      const { data, code } = yield call(PatrolManagementService.lineList, params);
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
    *getLineDelete({ payload }, { call, put, select }) {
      const { code } = yield call(PatrolManagementService.lineDelete, payload);
      if (code == 20000) {
        message.success('删除成功！');
        yield put({
          type: 'getLineList', payload: {
            page: 1,
            rows: 10,
            name: '',
            head: '',
            points_name: ''
          }
        });
      } else if (code == "50001") {
        message.info('当前时间段不可删除，请先修改对应巡更计划');
      } else {
        message.info('删除失败');
      }
    }
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, search }) => {
        if (pathname === '/patrolLine') {
          dispatch({ type: 'init' });
        }
      });
    }
  },
};
