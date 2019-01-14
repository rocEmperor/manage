// import { message } from 'antd';
import queryString from 'query-string';
import CarEquipManagementService from '../../services/CarEquipManagementService';
import { getCommunityId } from '../../utils/util';

export default {
  namespace: 'CarportManagementView',
  state: {
    community_id: '',
    detail: {},
    params: {
      page: 1,
      rows: 10,
      community_id: getCommunityId()
    },
    list: [],
    totals:''
  },
  reducers: {
    concat(state, { payload }) {
      return { ...state, ...payload };
    }
  },
  effects: {
    *init({ payload }, { call, put, select }) {
      const community_id = getCommunityId();
      yield put({type: 'concat', payload: { community_id }});
    },
    *getCarportDetail({ payload }, { call, put, select }) {
      const { code, data } = yield call(CarEquipManagementService.carportDetail, payload);
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: {
            detail: data
          }
        });
      }
    },
    // 车辆详情列表
    *ownerList({ payload }, { call, put, select }) {
      const params = yield select(state => state.CarportManagementView.params);
      const newParams = Object.assign(params, payload);
      const { data, code } = yield call(CarEquipManagementService.ownerList, newParams);
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: {
            list: data.list,
            params: newParams,
            totals: data.totals
          }
        });
      }
    },

  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, search }) => {
        const query = queryString.parse(search);
        if (pathname === '/carportManagementView') {
          if (query.id) {
            dispatch({ type: 'init' });
            dispatch({ type: 'getCarportDetail', payload: { id: query.id, community_id: sessionStorage.getItem("communityId") } });
            dispatch({ type: 'ownerList', payload: { port_id: query.id, community_id: sessionStorage.getItem("communityId") } });
            dispatch({
              type: 'concat', payload: {
                id: query.id,
                detail: {}
              }
            })
          }
        }
      });
    }
  },
};
