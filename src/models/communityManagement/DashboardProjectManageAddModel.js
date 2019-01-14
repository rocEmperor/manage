import { message } from 'antd';
import querystring from 'query-string';
import CommunityManagementService from './../../services/CommunityManagementService';
const { sharedShow,sharedAdd,sharedEdit } = CommunityManagementService;
const iniatialState = {
  value1:2,
  value2:1,
  loading: false,
  info: '',
  type:'',
  id:'',
};
export default {
  namespace:"DashboardProjectManageAddModel",
  state:{...iniatialState},
  reducers:{
    concat(state,{ payload }){
      return { ...state, ...payload };
    }
  },
  effects:{
    *init({ payload },{ call, put, }){
      yield put({type: 'concat', payload: { ...iniatialState }});
      if(payload.hasOwnProperty('queryId')){
        yield put({
          type: 'sharedShow',
          payload: {id: payload.queryId}
        })
      }
    },
    *sharedAdd({ payload, callback, err },{ call, put, }){
      const { code } = yield call(sharedAdd, payload);
      if(code == 20000){
        message.success("新增成功！");
        callback && callback();
      } else {
        err && err()
      }
    },
    *sharedEdit({ payload, callback, err },{ call, put, }){
      const { code } = yield call(sharedEdit, payload);
      if(code == 20000){
        message.success("编辑成功！");
        callback && callback();
      } else {
        err && err()
      }
    },
    *sharedShow({ payload },{ call, put, }){
      const { data,code } = yield call(sharedShow, payload);
      if (code === 20000) {
        yield put({
          type: 'concat',
          payload: {
            loading: false,
            info: data,
            type:data.shared_type
          }
        })
      }
    },
  },
  subscriptions: {
    setup({ dispatch,history }){
      return history.listen(({pathname,search})=>{
        let query = querystring.parse(search);
        if(pathname === '/dashboardProjectManageAdd'){
          if(query.id){
            dispatch({ type: 'init',payload:{queryId:query.id}});
            dispatch({type: 'concat', payload: {id:query.id}});
          } else {
            dispatch({ type: 'init',payload:{type:''}});
          }
        }
      })
    }
  }
}
