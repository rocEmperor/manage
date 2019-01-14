import GovernmentNoticeService from '../../services/GovernmentNoticeService';
// const { governmentNoticeList, newReadInfo, isReadNewInfo } = GovernmentNoticeService;

export default {
  namespace: 'GovernmentNoticeModel',
  state: {
    localsize: 10,
    news_amount: '',
    loading: false,
    data: [],
    paginationTotal: 0,
    isRead: '',
    current:1,
    param:{
      community_id: sessionStorage.getItem("communityId"),
      page: 1,
      rows: 10,
      title: '',
      start_date: '',
      end_date: '',
      send_type: '',
      notice_type: ''
    }
  },
  reducers: {
    concat (state, { payload }) {
      return { ...state, ...payload }
    }
  },
  effects: {
    *init ({ payload }, { call, put, select }) {
      let query = {
        community_id: sessionStorage.getItem("communityId"),
        param:{
          page: 1,
          rows: 10,
          title: '',
          start_date: '',
          end_date: '',
          send_type: '',
          notice_type: ''
        }
      }
      yield put({ type: 'getList', payload: query })
      yield put({ type: 'concat', payload: query })
    },
    *getList ({ payload }, { call, put, select }) {
      let defaultParam = { page: 1, rows: 10 };
      payload = Object.assign({}, defaultParam, payload);
      yield put({ type: 'concat', payload: {loading: true} });
      const { data, code } = yield call(GovernmentNoticeService.governmentNoticeList, payload);
      if (code === 20000) {
        yield put({
          type: 'concat',
          payload: {
            loading: false,
            data: data.list || [],
            paginationTotal: data.totals
          }
        })
      }
    },
    *newRead ({ payload }, { call, put, select }) {
      let defaultParam = { page: 1, rows: 10 };
      payload = Object.assign({}, defaultParam, payload);
      yield put({ type: 'concat', payload: {loading: true} });
      const { data, code } = yield call(GovernmentNoticeService.newReadInfo, payload);
      if (code === 20000) {
        yield put({
          type: 'concat',
          payload: {
            loading: false
          }
        });
        let layout = yield select(state => state.MainLayout);
        yield put({
          type: 'isRead',
          payload: { community_id: layout.communityId }
        });
        yield put({
          type: 'concat',
          payload: {
            news_amount: data.unread
          }
        })
      }
    },
    *isRead ({ payload }, { call, put, select }) {
      let defaultParam = {};
      payload = Object.assign({}, defaultParam, payload);
      yield put({ type: 'concat', payload: {loading: true} });
      const { data, code } = yield call(GovernmentNoticeService.isReadNewInfo, payload);
      if (code === 20000) {
        yield put({
          type: 'concat',
          payload: {
            loading: false,
            isRead: data.unread
          }
        })
      }
    }
  },
  subscriptions: {
    setup ({ dispatch, history }) {
      return history.listen(({ pathname }) => {
        if (pathname === '/governmentNotice') {
          dispatch({ type: 'init' })
        }
      })
    }
  }
}