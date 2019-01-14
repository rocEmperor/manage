import { message } from 'antd';
import queryString from 'query-string';
import RepairManagementService from '../../../services/RepairManagementService';
export default {
  namespace:'RepairAllocationModel',
  state:{
    departmentList:[],
    staffList:[],
    repair_id:'',
    type: ''
  },
  reducers: {
    concat(state,{ payload }){
      return {...state,...payload};
    }
  },
  effects: {
    *init({ payload }, { call,put }){
      yield put({ type: 'getGroups' });
      yield put({
        type:'concat',
        payload: {
          repair_id:'',
        }
      })
    },
    *getGroups( { payload }, { call, put } ){
      const { data, code } = yield call(RepairManagementService.groupGetGroups, payload);
      if( code == 20000 ){
        let str = JSON.stringify(data.list);
        let str1 = str.replace(/value/g, 'label');
        let str2 = str1.replace(/id/g, 'value');
        let str3 = str2.replace(/select/g,'disabled')
        let arr = JSON.parse(str3);
        yield put({
          type:'concat',
          payload: {
            departmentList:arr,
            unfoldList:arr?[arr[0].value]:[]
          }
        })
      }
    },
    *getGroupUsers({ payload },{ call,put }){
      const { data,code } = yield call(RepairManagementService.getGroupUsers,payload);
      if( code === 20000 ){
        yield put({
          type:'concat',
          payload: {
            staffList:data?data.list:[],
          }
        })
      }
    },
    *assignRepair({ payload },{ call,put }){
      const { code } = yield call(RepairManagementService.assignRepair,payload);
      if(code == 20000){
        message.success("操作成功！");
        setTimeout(() => {
          history.go(-1);
        },2000)
      }
    }
  },
  subscriptions : {
    setup({ dispatch,history }) {
      return history.listen(({pathname,search}) => {
        if (pathname === '/repairAllocation') {
          let query = queryString.parse(search);
          dispatch({
            type: 'concat', payload: {
              type: query.type
            }
          })
          if(query.id){
            dispatch({ type: 'concat' , payload:{repair_id:query.id}});
          }
          dispatch({type: 'getGroups'});
        }
      })
    }
  }
}
