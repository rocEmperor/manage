import { message } from 'antd';
import PropertyServices from './../../services/PropertyServices.js';

const initialState = {
  loading: false,
  list: [],
  totals: '',
  is_reset: false,
  params: {
    page: 1,
    rows: 10,
    title: '',
    proclaim_type:'',
    start_date: '',
    end_date: ''
  }
}
export default {
  namespace: 'SunNoticeModel',
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
      yield put({
        type: 'sunNoticeList',
        payload: {
          page: 1,
          community_id: sessionStorage.getItem("communityId"),
          rows: 10,
          start_date: "",
          end_date: "",
          proclaim_type:'',
        }
      });
      yield put({
        type: 'concat',
        payload: {
          is_reset: true,
          params: {
            page: 1,
            rows: 10,
            title: '',
            proclaim_type:'',
            start_date: '',
            end_date: ''
          }
        }
      });
    },
    *sunNoticeList({ payload }, { call, put, select }) {
      const params = yield select(state => state.SunNoticeModel.params)
      const newParams = Object.assign(params, payload);
      const { data, code } = yield call(PropertyServices.proclaimList, payload);
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: {
            list: data
              ? data.list
              : [],
            totals: parseInt(data.totals),
            params: newParams
          }
        })
      }
    },
    //删除
    *sunNoticeDelete({ payload }, { call, put, select }) {
      const { code } = yield call(PropertyServices.proclaimDel, { id: payload.id });
      if (code == 20000) {
        message.success('删除成功');
        yield put({ type: 'sunNoticeList', payload: payload.params });
      }
    },
    //显示隐藏
    *openDown({ payload }, { call, put }) {
      const { code } = yield call(PropertyServices.proclaimEditShow, { id: payload.id, is_show: payload.is_show, community_id: sessionStorage.getItem("communityId") });
      if (code == 20000) {
        message.destroy();
        message.success("操作成功！");
        yield put({ type: 'sunNoticeList', payload: payload.params });
      }
    },
    //置顶
    *openTop({ payload }, { call, put }) {
      const { code } = yield call(PropertyServices.proclaimEditTop, { id: payload.id, is_top: payload.is_top, community_id: sessionStorage.getItem("communityId") });
      if (code == 20000) {
        message.destroy();
        message.success("操作成功！");
        yield put({ type: 'sunNoticeList', payload: payload.params });
      }
    }
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, search }) => {
        if (pathname === '/sunNotice') {
          dispatch({ type: 'init' });
        }
      })
    }
  }
}
