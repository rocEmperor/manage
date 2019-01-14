import { message } from 'antd';
import queryString from 'query-string';
import DispatchManagementService from '../../../services/DispatchManagementService';
const { complaintDetail, complaintMark } = DispatchManagementService;

export default {
  namespace: 'ComplaintView',
  state: {
    username: '',
    mobile: '',
    type: {},
    content: '',
    images: [],
    status: {},
    handle_content: '',
    handle_at: '',
    previewVisible: false,
    previewImage: '',
    btnHide: "none",
    show: false,
    id: '',
    community_id: ''
  },
  reducers: {
    concat(state, { payload }) {
      return { ...state, ...payload };
    }
  },
  effects: {
    *init({ payload }, { call, put }) {
      yield put({ type: 'getComplaintDetail' });
    },
    *getComplaintDetail({ payload }, { call, put }) {
      const { data, code } = yield call(complaintDetail, payload);
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: {
            username: data.detail.username,
            mobile: data.detail.mobile,
            type: data.detail.type,
            content: data.detail.content,
            images: data.detail.images,
            status: data.detail.status,
            handle_content: data.detail.handle_content,
            handle_at: data.detail.handle_at,
            btnHide: data.detail.status.id == 1 ? "block" : "none"
          }
        });
      }
    },
    *getComplaintMark({ payload }, { call, put }) {
      const { code } = yield call(complaintMark, payload);
      if (code == 20000) {
        message.success('标记成功!');
        setTimeout(() => {
          location.href = "#/complaintManagement";
        }, 2000)
        yield put({
          type: 'concat',
          payload: {
            show: false,
            btnHide: 'none'
          }
        });
      }
    }
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, search }) => {
        const query = queryString.parse(search);
        if (pathname === '/complaintView') {
          if (query.id && query.community_id) {
            dispatch({ type: 'concat', payload: { id: query.id, community_id: query.community_id } })
            dispatch({ type: 'getComplaintDetail', payload: { id: query.id, community_id: query.community_id } });
          }
        }

      });
    }
  },
};
