import queryString from 'query-string';
import PropertyServices from './../../services/PropertyServices.js';
export default {
  namespace: 'ShowNoticeModel',
  state: {
    id: '',
    type: 1,
    img_url: [],
    img_top: [],
    info: {},
    previewVisible:false, 
    previewImage:'',
  },
  reducers: {
    concat(state, { payload }) {
      return { ...state, ...payload };
    }
  },
  effects: {
    *init({ payload }, { call, put }) {
      
    },
    *sunNoticeShow({ payload }, { call, put }) {
      const { data, code } = yield call(PropertyServices.proclaimShow, payload);
      if (code == 20000) {
        if (data.img_url) {
          data.img_url = [{
            uid: -1,
            name: 'logo.png',
            status: 'done',
            url: data.img_url,
          }]
        } else {
          data.img_url = []
        }
        yield put({
          type: 'concat',
          payload: {
            info: data,
            img_url: parseInt(data.proclaim_cate) == 2 ? data.img_url : [],
            img_top: parseInt(data.proclaim_cate) == 3 ? data.img_url : [],
            type: data ? parseInt(data.proclaim_cate) : 1,
            id: payload.id
          }
        })
      }
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, search }) => {
        if (pathname === '/showNotice') {
          dispatch({ type: 'init' });
          let query = queryString.parse(search);
          if (query.id) {
            dispatch({ type: 'sunNoticeShow', payload: { id: query.id } });
          } else {
            dispatch({ type: 'concat', payload: { id: '', info: {} } });
          }
        }
      })
    }
  }
}
