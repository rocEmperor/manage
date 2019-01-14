//import { message } from 'antd';
import CommunityManagementService from './../../services/CommunityManagementService';
const { groupList } = CommunityManagementService;

export default {
  namespace: 'BatchAddEditBuildingOneModel',
  state: {
    groupData:[]
  },
  reducers: {
    concat(state, { payload }) {
      return { ...state, ...payload };
    }
  },
  effects: {
    *init({ payload }, { call, put }) {
      yield put({
        type:"getGroupList",
        payload:{
          //community_id: sessionStorage.getItem("communityId"),  
        }
      })
    },
    *getGroupList({ payload },{ call,put }){
      const { code,data } = yield call(groupList, payload);
      if(code == 20000){
        yield put({
          type: 'concat',
          payload: {
            groupData: data?data:[],
          }
        });
      }
    },
    
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, search }) => {
        if (pathname === '/batchAddBuildingOne') {
          dispatch({ type: 'init'});
        }
      });
    }
  },
};
