import { message } from 'antd';
import PropertyServices from './../../services/PropertyServices.js';

const initialState = {
  loading: false,
  noticeType: [],
  sendType: [],
  list: [],
  totals: '',
  is_reset: false,
  params: {
    page: 1,
    rows: 10,
    community_id: sessionStorage.getItem("communityId"),
    title: "",
    start_date: "",
    end_date: "",
    send_type: "",
    notice_type: "",
  }
}
export default {
  namespace: 'NewsManagerModel',
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
      yield put({ type: 'getSendType' });
      yield put({ type: 'getPushType' });
      yield put({
        type: 'newsList', payload: {
          page: 1,
          community_id: sessionStorage.getItem("communityId"),
          row: 10
        }
      });
      yield put({
        type: 'concat',
        payload: {
          is_reset: true,
          params: {
            page: 1,
            rows: 10,
            community_id: sessionStorage.getItem("communityId"),
            title: "",
            start_date: "",
            end_date: "",
            send_type: "",
            notice_type: "",
          }
        }
      });
    },
    *getSendType({ payload }, { call, put }) {
      const { data, code } = yield call(PropertyServices.getSendType, payload);
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: {
            noticeType: data ? data : [],
          }
        })
      }
    },
    *getPushType({ payload }, { call, put }) {
      const { data, code } = yield call(PropertyServices.getPushType, payload);
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: {
            sendType: data ? data.list : []
          }
        })
      }
    },
    *newsList({ payload }, { call, put, select }) {
      const params = yield select(state => state.NewsManagerModel.params)
      const newParams = Object.assign(params, payload);
      const { data, code } = yield call(PropertyServices.newsList, payload);
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
    //推送
    *newsPush({ payload }, { call, put }) {
      const { code } = yield call(PropertyServices.newsPush, { id: payload.id });
      if (code == 20000) {
        message.destroy();
        message.success('推送成功');
        yield put({ type: 'newsList', payload: payload.params });
      }
    },
    //删除
    *newsDelete({ payload }, { call, put }) {
      const { code } = yield call(PropertyServices.newsDelete, { id: payload.id });
      if (code == 20000) {
        message.destroy();
        message.success('删除成功');
        yield put({ type: 'newsList', payload: payload.params });
      }
    }

  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, search }) => {
        if (pathname === '/newsManager') {
          dispatch({ type: 'init' });
        }
      })
    }
  }
}
