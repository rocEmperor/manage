import { message } from 'antd';
import queryString from 'query-string';
import CommunityManagementService from './../../services/CommunityManagementService';
const { groupList,buildingManageAdd,buildingManageEdit,buildingManageDetail } = CommunityManagementService;


export default {
  namespace: 'AddEditBuildingModel',
  state: {
    groupData:[],
    unit_id:'',
    info:{},
    groupInfo:'',
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
            groupData: data&&Array.isArray(data)?data:[],
          }
        });
      }
    },
    // 新增
    *buildingAdd({payload, callBack, err}, {call, put}) {
      const { code } = yield call(buildingManageAdd, payload);
      if(code == 20000){
        message.success("新增成功！");
        callBack && callBack();
      } else {
        err && err()
      }
    },
    // 编辑
    *buildingEdit({payload, callBack, err}, {call, put}) {
      const { code } = yield call(buildingManageEdit, payload);
      if(code == 20000){
        message.success("编辑成功！");
        callBack && callBack();
      } else {
        err && err()
      }
    },
    *info({ payload }, { call, put,select }) {
      const { data,code } = yield call(buildingManageDetail, payload);
      const groupData = yield select(state=>state.AddEditBuildingModel.groupData);
      let groupInfo;
      groupData?groupData.map((item,index)=>{
        if(item.group_id == data.group_id){
          groupInfo=item.group_name;
        }
      }):''
      //console.log(groupInfo,'p')
      if(code == 20000){
        yield put({
          type: 'concat',
          payload: {
            info: data,
            groupInfo:groupInfo,
          }
        });
      }
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, search }) => {
        const query = queryString.parse(search);
        if (pathname === '/addBuilding') {
          initData();
        }else if(pathname === '/editBuilding'){
          initData();
          dispatch({ type: 'info', payload:{unit_id:query.unit_id}});
        }
        function initData() {
          dispatch({ type: 'init' });
          dispatch({
            type: 'concat', payload: {
              unit_id: query.unit_id,
              groupInfo:'',
              info: {}
            }
          })
        }
      });
    }
  },
};
