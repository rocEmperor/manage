import { message } from 'antd';
import CommunityManagementService from './../../services/CommunityManagementService';
const { buildingManageList,buildingManageDelete,groupList,buildingList,unitList } = CommunityManagementService;
const initialState = {
  is_reset:false,
  list: [],
  totals:'',
  groupData:[],
  buildingData:[],
  unitData:[],
  groupId:'',
  params:{
    page:1,
    rows:10,
    //community_id: sessionStorage.getItem("communityId"),
    group_name:"",
    building_name:"",
    unit_name:"",
  }
}
export default {
  namespace: 'BuildingManagementModel',
  state: {...initialState},
  reducers: {
    concat(state, { payload }) {
      return { ...state, ...payload };
    }
  },
  effects: {
    *init({ payload }, { call, put }) {
      yield put({type: 'concat', payload: {...initialState}});
      yield put({
        type:"getList",
        payload:{
          page:1,
          rows:10,
          group_name:"",
          building_name:"",
          unit_name:"",
          //community_id: sessionStorage.getItem("communityId"),  
        }
      })
      yield put({
        type:"getGroupList",
        payload:{
          //community_id: sessionStorage.getItem("communityId"),  
        }
      })
      yield put({
        type:"concat",
        payload:{
          is_reset:true,
          list: [],
          totals:'',
          groupData:[],
          buildingData:[],
          unitData:[],
          groupId:'',
        }
      })
    },
    *getList({ payload,callBack },{ call,put,select }){
      const params = yield select(state=>state.BuildingManagementModel.params);
      const newParams = Object.assign(params, payload);
      const { data,code } = yield call(buildingManageList, payload);
      //const { data,code } = yield call(groupManageList, payload);
      if(code == 20000){
        yield put({
          type: 'concat',
          payload: {
            list: data?data.list:[],
            totals: data.totals,
            params: newParams
          }
        });
        callBack&&callBack()
      }
    },
    *getGroupList({ payload,callBack },{ call,put }){
      const { code,data } = yield call(groupList, payload);
      if(code == 20000){
        yield put({
          type: 'concat',
          payload: {
            groupData: data?data:[],
            buildingData:[],
            unitData:[],
          }
        });
        callBack&&callBack()
      }
    },
    *getBuildingList({ payload,callBack },{ call,put }){
      const { code,data } = yield call(buildingList, payload);
      if(code == 20000){
        yield put({
          type: 'concat',
          payload: {
            buildingData: data?data:[],
            unitData:[],
          }
        });
        callBack&&callBack()
      }
    },
    *getUnitList({ payload,callBack },{ call,put }){
      const { code,data } = yield call(unitList, payload);
      if(code == 20000){
        yield put({
          type: 'concat',
          payload: {
            unitData: data?data:[],
          }
        });
        callBack&&callBack()
      }
    },
    *buildingDelete({ payload, callBack }, { call, put, select }) {
      const { code } = yield call(buildingManageDelete, payload);
      if(code == 20000){
        message.success('删除成功');
        callBack && callBack();
      }
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, search }) => {
        if (pathname === '/buildingManagement') {
          dispatch({ type: 'init',payload:{}});
        }
      });
    }
  },
};
