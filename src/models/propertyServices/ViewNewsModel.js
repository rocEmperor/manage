import queryString from 'query-string';
import PropertyServices from './../../services/PropertyServices.js';
export default {
  namespace: 'ViewNewsModel',
  state: {
    info:'',
    previewVisible:false,
    previewImage:'',
  },
  reducers: {
    concat(state, { payload }){
      return {...state,...payload};
    }
  },
  effects: {
    *info({ payload }, { call, put }){
      const { data,code } = yield call(PropertyServices.newsShow, payload);
      if(code == 20000){
        yield put({
          type: 'concat',
          payload: {
            info: data
          }
        })
      }
    },

  },
  subscriptions:{
    setup({ dispatch, history }){
      return history.listen(({ pathname, search }) => {
        const query = queryString.parse(search);
        if(pathname === '/viewNews'){
          if(query.id){
            dispatch({ type: 'info', payload:{id:query.id}})
          }
        }
      })
    }
  }
}
