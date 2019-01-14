import { message } from 'antd';
import DispatchManagementService from '../../../services/DispatchManagementService';
const { complaintList, complaintTypes, complaintStatus, complaintMark } = DispatchManagementService;
import queryString from 'query-string';

const initialState = {
  list: [],
  typeOption: [],
  statusOption: [],
  is_reset: false,
  totals: '',
  show: false,
  username: '',
  mobile: '',
  id: '',
  statusId: "",
  params: {
    page: 1,
    rows: 10,
    community_id: sessionStorage.getItem("communityId"),
    username: "",
    mobile: "",
    type: "",
    status: 1
  },
}
export default {
  namespace: 'ComplaintManagement',
  state: {...initialState},
  reducers: {
    concat(state, { payload }) {
      return { ...state, ...payload };
    }
  },
  effects: {
    *init({ payload }, { call, put }) {
      yield put({type: 'concat', payload: {...initialState}});
      yield put({
        type: 'concat',
        payload: {
          is_reset: true,
          params: {
            page: 1,
            rows: 10,
            community_id: sessionStorage.getItem("communityId"),
          },
        }
      });
      yield put({ type: 'getComplaintTypes' });
      yield put({ type: 'getComplaintStatus' });
    },
    *getComplaintList({ payload }, { call, put, select }) {
      const params = yield select(state => state.ComplaintManagement.params);
      const newParams = Object.assign(params, payload);
      const { data, code } = yield call(complaintList, params);
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: {
            list: data ? data.list : [],
            totals: data.totals,
            params: newParams
          }
        });
      }
    },
    *getComplaintTypes({ payload }, { call, put }) {
      const { data, code } = yield call(complaintTypes, payload);
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: {
            typeOption: data.types
          }
        });
      }
    },
    *getComplaintStatus({ payload }, { call, put }) {
      const { data, code } = yield call(complaintStatus, payload);
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: {
            statusOption: data.status
          }
        });
      }
    },
    *getComplaintMark({ payload, callBack }, { call, put }) {
      const { code } = yield call(complaintMark, payload);
      if (code == 20000) {
        message.success('标记成功!');
        callBack && callBack()
        yield put({
          type: 'concat',
          payload: {
            show: false
          }
        });
        yield put({ type: 'init' });
      }
    }
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, search }) => {
        if (pathname === '/complaintManagement') {
          let query = queryString.parse(search);
          dispatch({ type: 'init' });
          if (query.id) {
            dispatch({ type: 'concat', payload: { statusId: query.id } });
            dispatch({ type: 'getComplaintList', payload: { page: 1, rows: 10, status: 1 } })
          } else {
            dispatch({ type: 'concat', payload: { statusId: '' } });
            dispatch({ type: 'getComplaintList', payload: { page: 1, rows: 10, status: '' } });
          }
        }
      });
    }
  },
};
