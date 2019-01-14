import queryString from 'query-string';
import GovernmentNoticeService from '../../services/GovernmentNoticeService';

export default {
  namespace: 'GovernmentNoticeViewModel',
  state: {
    loading: false,
    info: ''
  },
  reducers: {
    concat (state, { payload }) {
      return { ...state, ...payload };
    }
  },
  effects: {
    *init ({ payload }, { call, put, select }) {
      yield put({
        type: 'NewsDetail',
        payload: { id: payload.id }
      })
    },
    *NewsDetail ({ payload }, { call, put, select }) {
      let defaultParam = {};
      payload = Object.assign({}, defaultParam, payload);
      yield put({type: 'concat', payload: {loading: true}});
      const { data, code } = yield call(GovernmentNoticeService.newsDetailList, payload);
      if (code === 20000) {
        yield put({
          type: 'concat',
          payload: {
            loading: false,
            info: data
          }
        })
      }
    }
  },
  subscriptions: {
    setup ({ dispatch, history }) {
      return history.listen(({ pathname, search }) => {
        let query = queryString.parse(search);
        if (pathname === '/governmentNoticeView') {
          dispatch({ type: 'init', payload: {id: query.id} })
        }
      })
    }
  }
}
