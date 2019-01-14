import { message } from 'antd';
import PropertyServices from './../../services/PropertyServices.js';
export default {
  namespace: 'CommunityGuideModel',
  state: {
    loading: false,
    totals:'',
    list:[],
    is_reset:false,
    params:{
      page:1,
      rows:10,
      community_id:sessionStorage.getItem("communityId"),
    }
  },
  reducers: {
    concat(state, { payload }) {
      return {...state,...payload };	
    }
  },
  effects: {
    *init({ payload }, { call, put }) {
      yield put({
        type: 'getList',
        payload: {
          page:1,
          rows:10,
          community_id:sessionStorage.getItem("communityId"),
        }
      });
      yield put({
        type: 'concat',
        payload: {
          is_reset:true,
          params: {
            page: 1,
            rows: 10,
            community_id: sessionStorage.getItem("communityId"),
          }
        }
      });
    },
    //列表
    *getList({payload}, {call, put, select}){
      const params = yield select(state=>state.CommunityGuideModel.params);
      const newParams = Object.assign(params, payload);
      const { data,code } = yield call(PropertyServices.communityGuideList, payload);
      if(code == 20000){
        yield put({
          type: 'concat',
          payload: {
            list: data?data.list:[],
            totals: data.totals,
            params: newParams
          }
        });
      }
    },
    //显示隐藏
    *guideOpenDown({payload}, {call, put}){
      const { code } = yield call(PropertyServices.guideOpenDown, {id:payload.id,status:payload.status,community_id:sessionStorage.getItem("communityId"),});
      if(code == 20000){
        message.destroy();
        message.success("操作成功！");
        yield put({ type: 'getList', payload:payload.params});
      }
    }
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, search }) => {
        if (pathname === '/communityGuide') {
          dispatch({ type: 'init'});
        }
      });
    }
  }

}
