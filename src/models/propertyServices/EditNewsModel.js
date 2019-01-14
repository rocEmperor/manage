import { message } from 'antd';
import queryString from 'query-string';
import PropertyServices from './../../services/PropertyServices.js';
export default {
  namespace: 'EditNewsModel',
  state: {
    noticeType:[],
    sendType:[],
    previewVisible:false,
    previewImage:'',
    id:'',
    info:'',
    business_img:'',
    img_url:[],
    business_img_local:'',
    discount_content:'',
    change_img:'',
    params:{
      status:''
    }
  },
  reducers: {
    concat(state, { payload }){
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
      const params = yield select(state => state.EditNewsModel.params);
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
    *newsShow({ payload }, { call, put}){
      const { data,code } = yield call(PropertyServices.newsShow, payload);
      if(code == 20000){
        if(data.img_url){
          data.business_img=[{
            uid: -1,
            name: 'logo.png',
            status: 'done',
            url:data.img_url,
          }]
        }else{
          data.business_img=[]
        }
        yield put({
          type: 'concat',
          payload: {
            info: data,
            img_url:data.business_img,
          }
        })
      }
    },
    *newsEdit({ payload }, { call, put }){
      const { code } = yield call(PropertyServices.newsEdit, payload);
      if(code == 20000){
        message.success("编辑成功！");
        setTimeout(() => {
          location.href = "#/newsManager";
        },2000)
      }
    }
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, search }) => {
        if (pathname === '/editNews') {
          let query = queryString.parse(search);
          if(query.id){
            dispatch({type: 'newsShow', payload: {id:query.id,community_id:sessionStorage.getItem("communityId")}});
            dispatch({ type: 'concat' , payload:{id:query.id}});
          }
          dispatch({ type: 'init'});
          dispatch({ type: 'concat' , payload:{id:query.id}});
        }
      });
    }
  }
}
