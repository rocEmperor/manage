import { message } from 'antd';
import PropertyServices from './../../services/PropertyServices.js';
import queryString from 'query-string';

const initialState = {
  list: [],
  expressCompany: [],
  packageStatus: [],
  totals: '',
  is_reset: false,
  statusId: '',//首页待办事项进入
  id: '',
  params: {
    page: 1,
    rows: 10,
    community_id: sessionStorage.getItem("communityId"),
    receiver: "",
    mobile: "",
    delivery_id: "",
    tracking_no: "",
    group: "",
    building: "",
    unit: "",
    room: "",
    status: "",
    time_start: '',
    time_end: '',
  }
}
export default {
  namespace: 'PackageManagement',
  state: {...initialState},
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
      yield put({type: 'concat', payload: {...initialState}});
      yield put({ type: 'getPackageStatus' });
      yield put({ type: 'getPackageDelivery' });
      yield put({
        type: 'concat',
        payload: {
          is_reset: true,
          params: {
            page: 1,
            rows: 10,
            community_id: sessionStorage.getItem("communityId"),
            receiver: "",
            mobile: "",
            delivery_id: "",
            tracking_no: "",
            group: "",
            building: "",
            unit: "",
            room: "",
            status: "",
          }
        }
      })
    },
    *getPackageList({ payload }, { call, put, select }) {
      const params = yield select(state => state.PackageManagement.params);
      const newParams = Object.assign(params, payload);
      const { data, code } = yield call(PropertyServices.packageList, params);
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
    *getPackageStatus({ payload }, { call, put }) {
      const { data, code } = yield call(PropertyServices.packageStatus, payload);
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: {
            packageStatus: data.status
          }
        });
      }
    },
    *getPackageDelivery({ payload }, { call, put }) {
      const { data, code } = yield call(PropertyServices.packageDelivery, payload);
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: {
            expressCompany: data.delivery
          }
        });
      }
    },
    *getPackageReceive({ payload }, { call, put }) {
      const { code } = yield call(PropertyServices.packageReceive, {
        id: payload.id,
        status: payload.status,
        community_id: sessionStorage.getItem("communityId")
      });
      if (code == 20000) {
        message.destroy();
        message.success("领取成功！");
        yield put({ type: 'getPackageList', payload: payload.params });
      }
    }
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, search }) => {
        if (pathname === '/packageManagement') {
          let query = queryString.parse(search);
          dispatch({ type: 'init' });
          if (query.id) {
            dispatch({ type: 'concat', payload: { statusId: query.id } });
            dispatch({
              type: 'getPackageList', payload: {
                page: 1,
                rows: 10,
                status: query.id,
                community_id: sessionStorage.getItem("communityId"),
              }
            })
          } else {
            dispatch({ type: 'concat', payload: { statusId: '' } });
            dispatch({
              type: 'getPackageList', payload: {
                page: 1,
                rows: 10,
                status: '',
                community_id: sessionStorage.getItem("communityId"),
              }
            });
          }
        }
      })
    }
  }
}
