import { message } from 'antd';
import queryString from 'query-string';
import PropertyServices from './../../services/PropertyServices.js';
export default {
  namespace:'EditNoticeModel',
  state: {
    info:'',
    ueditorContent: "",
    id: ''
  },
  reducers: {
    concat(state, { payload }) {
      return {...state,...payload }; 
    }
  },
  effects: {
    *init({ payload }, { call, put}){
    },
    *sunNoticeDetail({payload}, {call, put}){
      const { data, code } = yield call(PropertyServices.sunNoticeDetail, payload);
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: {
            info:data,
            ueditorContent: data.content
          }
        });
      }
    },
    *sunNoticeEdit({payload}, {call, put}){
      const { code } = yield call(PropertyServices.sunNoticeEdit, payload);
      if(code == 20000){
        message.success("编辑成功！");
        setTimeout(() => {
          location.href = "#/sunNotice";
        },2000)
      }
    }
  },
  subscriptions:{
    setup({ dispatch, history}){
      return history.listen(({ pathname, search }) => {
        if(pathname === '/editNotice'){
          let query = queryString.parse(search);
          dispatch({ type: 'init'});
          dispatch({type: 'concat', payload: {id:query.id}});
          dispatch({type: 'sunNoticeDetail', payload: {id: query.id}});
        }
      })
    }
  }
}
