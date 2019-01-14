import { message } from 'antd';
import queryString from 'query-string';
import PropertyServices from './../../services/PropertyServices.js';
export default {
  namespace: 'AddGuideModel',
  state: {
    id:'',
    info:"",
    typeList:[]//分类列表
  },
  reducers: {
    concat(state, { payload }){
      return {...state,...payload };
    }
  },
  effects: {
    *init({ payload }, { call, put}){
      yield put({ type: 'getGuideTypeList',payload:{} });
    },
    //分类列表
    *getGuideTypeList({payload}, {call, put}){
      const { data,code } = yield call(PropertyServices.guideTypeList, payload);
      if(code == 20000){
        yield put({
          type: 'concat',
          payload: {
            typeList: data?data.type:[],
          }
        });
      }
    },
    //新增
    *addGuide({payload}, {call, put}) {
      const { code } = yield call(PropertyServices.guideCreate, payload);
      if(code == 20000){
        message.success("新增成功！");
        setTimeout(() => {
          location.href = "#/communityGuide";
        },2000)
      }
    },
    //编辑
    *editGuide({payload}, {call, put}) {
      const { code } = yield call(PropertyServices.guideEdit, payload);
      if(code == 20000){
        message.success("编辑成功！");
        setTimeout(() => {
          location.href = "#/communityGuide";
        },2000)
      }
    },
    //获取详情
    *guideDeteil({ payload }, { call, put }){
      const { data,code } = yield call(PropertyServices.guideDetail, payload);
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: {
            info:data.detail
          }
        });
      }
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, search }) => {
        if (pathname === '/addGuide') {
          let query = queryString.parse(search);
          dispatch({ type: 'init'});
          if(query.id){//编辑
            dispatch({type: 'guideDeteil', payload: {id: query.id,community_id:sessionStorage.getItem("communityId")}});
            dispatch({type: 'concat', payload: {id:query.id}});
          }else{//新增
            dispatch({type: 'concat', payload: {id:'', info: '',community_id:sessionStorage.getItem("communityId")}});
          }
          
        }
      });
    }
  }
}
