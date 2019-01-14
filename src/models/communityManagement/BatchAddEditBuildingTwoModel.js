import { message } from 'antd';
import CommunityManagementService from './../../services/CommunityManagementService';
const { buildingManageBatchAdd } = CommunityManagementService;
import queryString from 'query-string';
export default {
  namespace: 'BatchAddEditBuildingTwoModel',
  state: {
    list:[],
    deleteId:[],
    errorMsgList:[],
    type:false,
    flag:false,
    group_id:'',
    errId:[],
  },
  reducers: {
    concat(state, { payload }) {
      return { ...state, ...payload };
    }
  },
  effects: {
    *init({ payload }, { call, put }) {
      yield put({
        type:'concat',
        payload:{
          list:[],
          deleteId:[],
          errorMsgList:[],
          type:false,
          flag:false,
          group_id:'',
          errId:[],
        }
      })
      
    },
    // 新增
    *batchAddBuilding({payload, callBack, err}, {call, put}) {
      const { code,error } = yield call(buildingManageBatchAdd, payload);
      if(code == 20000){
        message.success("新增成功！");
        callBack && callBack();
      } else if(code == 50003) {
        //message.error("楼宇重复");
        let errorMsgList = JSON.stringify(error.errorMsg.length>0&&Array.isArray(error.errorMsg)?error.errorMsg:[]);
        let errorMsgList1 = errorMsgList.replace(/幢-/g, '幢');
        let errorList = JSON.parse(errorMsgList1);
        yield put({
          type:'concat',
          payload:{
            errorMsgList:errorList?errorList:[],
          }
        })
        err && err(errorList)
      }
    },
    
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, search }) => {
        if (pathname === '/batchAddBuildingTwo') {
          let query = queryString.parse(search);
          dispatch({ type: 'init'});
          dispatch({type: 'concat', payload: {group_id:query.group_id}});
        }
      });
    }
  },
};
