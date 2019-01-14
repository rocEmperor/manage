import { message } from 'antd';
import DeviceInspectService from '../../services/DeviceInspectService';
const initialState = {
  is_reset: false,
  params: {
    page: 1,
    rows: 10,
    community_id: sessionStorage.getItem("communityId"),
    plan_name: "",
    line_name: "",
    user_id: "",
    start_at: "",
    end_at: ""
  },
  list: [],
  userList: [],
  paginationTotal: ''
};
export default {
  namespace: 'OutlierData',
  state: { ...initialState },
  reducers: {
    concat(state, { payload }) {
      return { ...state, ...payload };
    }
  },
  effects: {
    *init({ payload }, { call, put, select }) {
      yield put({ type: 'concat', payload: { ...initialState } });
      let OutlierData = yield select(state => state.OutlierData);
      let { params } = OutlierData;
      params.community_id = sessionStorage.getItem("communityId");
      yield put({
        type: 'concat', payload: {
          is_reset: true,
          params: params,
        }
      });
      yield put({
        type: 'outlierDataList', payload: {
          page: 1,
          rows: 10,
          plan_name: "",
          line_name: "",
          user_id: "",
          start_at: "",
          end_at: ""
        }
      });
      yield put({
        type: 'userList',
        payload: {
          community_id: sessionStorage.getItem("communityId")
        }
      })
    },
    *outlierDataList({ payload }, { call, put, select }) {
      const params = {
        page: 1,
        rows: 10,
        community_id: sessionStorage.getItem("communityId"),
      }
      const newParams = Object.assign(params, payload);
      const { data, code } = yield call(DeviceInspectService.outlierDataList, params);
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
    *outlierDataExport({ payload, callback }, { call, put, select }) {
      const { code, data } = yield call(DeviceInspectService.outlierDataExport, payload);
      if (code == 20000) {
        message.success('导出成功！');
        callback && callback(data.down_url);
      }
    }
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, search }) => {
        if (pathname === '/outlierData') {
          dispatch({ type: 'init' });
        }
      });
    }
  },
};
