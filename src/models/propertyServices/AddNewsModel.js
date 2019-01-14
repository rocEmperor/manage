import { message } from 'antd';
import PropertyServices from './../../services/PropertyServices.js';
export default {
  namespace:'AddNewsModel',
  state: {
    noticeType:[],
    sendType: [],
    business_img:'',
    change_img:false,
    id:'',
    info:'',
    img_url:[],
    business_img_local:'',
    params:{
      status:''
    }
  },
  reducers: {
    concat(state, { payload }) {
      return {...state,...payload }; 
    }
  },
  effects: {
    *init({ payload }, { call, put}){
      yield put({ type: 'getSendType'});
      yield put({ type: 'getPushType'});
      yield put({
        type: 'concat',
        payload: {
          change_img: false,
          id:'',
          info:'',
          img_url:[]
        }
      })
    },
    *getSendType({ payload }, { call, put, select}){
      const params = yield select(state => state.AddNewsModel.params);
      const newParams = Object.assign(params, payload);
      const { data,code } = yield call(PropertyServices.getSendType, payload);
      if( code == 20000){
        yield put({
          type: 'concat',
          payload: {
            noticeType:data ? data:[], 
            params: newParams
          }
        })
      }
    },
    *getPushType({ payload }, { call, put}){
      const { data,code } = yield call(PropertyServices.getPushType, payload);
      if( code == 20000){
        yield put({
          type: 'concat',
          payload: {
            sendType:data ? data.list:[]
          }
        })
      }
    },
    *newsAdd({ payload }, { call, put }) {
      const { code } = yield call (PropertyServices.newsAdd, payload);
      if(code == 20000){
        message.success("新增成功！");
        setTimeout(() => {
          location.href = '#/newsManager';
        },2000)
      }
    }
  },
  subscriptions:{
    setup({ dispatch, history}){
      return history.listen(({ pathname, search }) => {
        if(pathname === '/addNews'){
          dispatch({ type: 'init'});
        }
      })
    }
  }
}
