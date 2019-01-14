import { message } from 'antd';
import CommunityManagementService from './../../services/CommunityManagementService';
const { sharedList,getSharedLift,setSharedLift,sharedDelete, sharedTemplet  } = CommunityManagementService;
import queryString from 'query-string';

export default {
  namespace:"ProjectManagementModel",
  state:{
    community_id: sessionStorage.getItem("communityId"),
    list:[],
    totals:'',
    calc_msg:'',
    type:'',
    rule_type:'',
    visible1:false,
    is_reset:false,
    params:{
      page:1,
      rows:10,
      community_id:'',
      name:'',
      panel_status:'',
      panel_type:'',
      shared_type:1,
    },
    curTabPaneKey: '1'
  },
  reducers:{
    concat(state,{ payload }){
      return { ...state, ...payload };
    }
  },
  effects: {
    *init({ payload },{ call,put,select }){
      let {query} = payload;
      let sharedType = '1';
      if (Object.hasOwnProperty.call(query, 'curTabPaneKey')) {
        sharedType = query.curTabPaneKey
        yield put({
          type: 'concat',
          payload: {
            curTabPaneKey: query.curTabPaneKey,
            is_reset:true,
            params: {
              page: 1,
              rows: 10,
              community_id: '',
              name: '',
              panel_status: '',
              panel_type: '',
              shared_type: 1,
            },
          }
        })
      } else {
        yield put({
          type: 'concat',
          payload: {
            curTabPaneKey: '1',
            is_reset:true,
            params: {
              page: 1,
              rows: 10,
              community_id: '',
              name: '',
              panel_status: '',
              panel_type: '',
              shared_type: 1,
            },
          }
        })
      }
      yield put({ type:'getList',payload:{
        page:1,
        rows:10,
        community_id: sessionStorage.getItem("communityId"),
        name:'',
        panel_status:'',
        panel_type:'',
        shared_type: sharedType,
      }});
      yield put({type:'getSharedLift',payload:{community_id: sessionStorage.getItem("communityId")}})
    },
    *getList({ payload }, { call, put, select }){
      const params = yield select(state=>state.ProjectManagementModel.params);
      const newParams = Object.assign(params, payload);
      const { data,code } = yield call(sharedList, payload);
      if(code == 20000){
        yield put({
          type: 'concat',
          payload: {
            list: data?data.list:[],
            calc_msg:data?data.calc_msg:'',
            totals: data.totals,
            params: newParams
          }
        });
      }
    },
    *getSharedLift({payload},{call,put}){
      const { data,code } = yield call(getSharedLift, payload);
      if(code == 20000){
        yield put({
          type: 'concat',
          payload: {
            rule_type: data?data.rule_type:'',
          }
        });
      }
    },
    *setSharedLift({payload},{call,put}){
      const { code } = yield call(setSharedLift, payload);
      if(code == 20000){
        message.success("设置成功！");
        yield put({
          type: 'concat',
          payload: {
            visible1: false,
          }
        });
      }
    },
    *sharedDelete({payload},{call,put}){
      const { code } = yield call(sharedDelete, payload);
      if(code == 20000){
        message.success("删除成功！");
      }
    },
    *downFiles ({ payload, callback }, { call, put, select }) {
      const { data, code } = yield call(sharedTemplet, payload);
      if (code == 20000) {
        callback && callback(data.down_url)
      }
    }
  },
  subscriptions: {
    setup({ dispatch,history }){
      return history.listen(({ pathname, search })=>{
        let query = queryString.parse(search);
        if (pathname === '/projectManagement') {
          dispatch({ type: 'init', payload: {query: query}});
        }
      })
    }
  }
}
