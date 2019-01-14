import { message } from 'antd';
import CommunityManagementService from './../../services/CommunityManagementService';
const { groupManageList,groupManageDelete,groupManageAdd,groupManageEdit,groupManageDetail } =  CommunityManagementService;

export default {
  namespace: 'AreaManagementModel',
  state: {
    is_reset:false,
    groupData:[],
    list:[],
    info:{},
    totals:'',
    id:'',
    visible:false,
    params:{
      page:1,
      rows:10,
      group_name:"",
    }
  },
  reducers: {
    concat(state, { payload }) {
      return { ...state, ...payload };
    }
  },
  effects: {
    *init({ payload }, { call, put }) {
      yield put({
        type:"getList",
        payload:{
          page:1,
          rows:10,
          group_name:"",
          //community_id: sessionStorage.getItem("communityId"),  
        }
      })
      yield put({
        type:"concat",
        payload:{
          is_reset:true,
          groupData:[],
          list:[],
          info:{},
          totals:'',
          id:'',
          visible:false,
          params:{
            page:1,
            rows:10,
            group_name:"",
          }
        }
      })
    },
    *getList({ payload },{ call,put,select }){
      const params = yield select(state=>state.AreaManagementModel.params);
      const newParams = Object.assign(params, payload);
      const { data,code } = yield call(groupManageList, payload);
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
      }
    },
    *areaDelete({ payload, callBack }, { call, put, select }) {
      const { code } = yield call(groupManageDelete, payload);
      if(code == 20000){
        message.success('删除成功');
        callBack && callBack();
      }
    },
    // 新增
    *areaAdd({payload, callBack, err}, {call, put}) {
      const { code } = yield call(groupManageAdd, payload);
      if(code == 20000){
        yield put({
          type: 'concat',
          payload: {
            visible:false,
          }
        });
        message.success("新增成功！");
        callBack && callBack();
      } else {
        err && err()
      }
    },
    *areaEdit({payload, callBack, err}, {call, put}) {
      const { code } = yield call(groupManageEdit, payload);
      if(code == 20000){
        yield put({
          type: 'concat',
          payload: {
            visible:false,
          }
        });
        message.success("编辑成功！");
        callBack && callBack();
      } else {
        err && err()
      }
    },
    //详情
    *areaInfo({payload,callBack}, {call, put}) {
      const { code,data } = yield call(groupManageDetail, payload);
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: {
            info: data,
          }
        });
        callBack&&callBack(data)
      }
      // yield put({
      //   type: 'concat',
      //   payload : {
      //     info: data,
      //   }
      // })
      // callback&&callback()
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, search }) => {
        if (pathname === '/areaManagement') {
          dispatch({ type: 'init'});
          dispatch({ type: 'concat',payload:{info:{}}});
        }
      });
    }
  },
};
