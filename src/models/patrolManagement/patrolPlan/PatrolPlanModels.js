import { message } from 'antd';
import PatrolManagementService from '../../../services/PatrolManagementService';
const initialState = {
  is_reset:false,
  params: {
    page: 1,
    rows: 10,
    community_id: sessionStorage.getItem("communityId"),
    name:"",
    line_name:"",
    user:"",
    start_time:"",
    end_time:""
  },
  list: [],
  paginationTotal: ''
};
export default {
  namespace: 'PatrolPlan',
  state: {...initialState},
  reducers: {
    concat(state, { payload }) {
      return { ...state, ...payload };
    }
  },
  effects: {
    *init({ payload }, { call, put, select }) {
      yield put({type: 'concat', payload: {...initialState}});
      let PatrolPlan = yield select(state => state.PatrolPlan);
      let { params } = PatrolPlan;
      params.community_id = sessionStorage.getItem("communityId");
      yield put({type: 'getPlanList', payload: {
        page: 1,
        rows: 10,
        community_id: sessionStorage.getItem("communityId"),
        name:"",
        line_name:"",
        user:"",
        start_time:"",
        end_time:""
      }});
      yield put({ type: 'concat', payload: {
        is_reset:true,
        params: params
      } });
    },
    *getPlanList({ payload }, { call, put, select }) {
      const params = yield select(state => state.PatrolPlan.params);
      const newParams = Object.assign(params, payload);
      const { data, code } = yield call(PatrolManagementService.planList, params);
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
    *getPlanDelete({ payload }, { call, put, select }) {
      const { code } = yield call(PatrolManagementService.planDelete, payload);
      if (code == 20000) {
        message.success('删除成功！');
        yield put({
          type: 'getPlanList', payload: {
            page: 1,
            rows: 10,
            name: '',
            line_name: '',
            user: '',
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
        if (pathname === '/patrolPlan') {
          dispatch({ type: 'init' });
        }
      });
    }
  },
};
