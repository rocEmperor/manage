import { message } from 'antd';
import queryString from 'query-string';
import PropertyServices from './../../services/PropertyServices.js';
export default {
  namespace:'AddNoticeModel',
  state: {
    id:'',
    type: 1,
    img_url:[],
    img_top:[],
    info:{},
  },
  reducers: {
    concat(state, { payload }) {
      return {...state,...payload }; 
    }
  },
  effects: {
    *init({ payload }, { call, put}){
      yield put({
        type: 'concat',
        payload: {
          id: '',
          type: 1,
          img_url: [],
          img_top: [],
          info: {},
        }
      });
    },
    *sunNoticeAdd({payload}, {call, put}){
      const { code } = yield call(PropertyServices.proclaimAdd, payload);
      if(code == 20000){
        message.success("新增成功！");
        setTimeout(() => {
          history.go(-1);
        },2000)
      }
    },
    *sunNoticeEdit({ payload }, { call, put }) {
      const { code } = yield call(PropertyServices.proclaimEdit, payload);
      if (code == 20000) {
        message.success("编辑成功！");
        setTimeout(() => {
          history.go(-1);
        }, 2000)
      }
    },
    *sunNoticeShow({ payload }, { call, put }) {
      const { data,code } = yield call(PropertyServices.proclaimShow, payload);
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
  subscriptions:{
    setup({ dispatch, history}){
      return history.listen(({ pathname, search }) => {
        if(pathname === '/addNotice'){
          dispatch({ type: 'init'});
          let query = queryString.parse(search);
          if (query.id) {
            dispatch({ type: 'sunNoticeShow', payload: { id: query.id} });
          }else{
            dispatch({ type: 'concat', payload: { id: '', info:{} } });
          }
        }
      })
    }
  }
}
