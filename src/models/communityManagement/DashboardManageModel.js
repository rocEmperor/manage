
import { message } from 'antd';
import CommunityManagementService from './../../services/CommunityManagementService';
const { sharedList,getSharedLift,setSharedLift,sharedDeleteMeter, sharedTemplet,meterReadingManagerList, waterTemplet,electrictList, electrictTemplet, meterExport,sharedDelete } = CommunityManagementService;
import queryString from 'query-string';
const iniatialState={
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
    community_id:sessionStorage.getItem("communityId"),
    name:'',
    panel_status:'',
    panel_type:'',
    shared_type:4,
  },
  params1:{
    page:1,
    rows:10,
    community_id:sessionStorage.getItem("communityId"),
    meter_no:"",
    meter_status:"",
    group:"",
    building:"",
    unit:"",
    room:"",
  },
  curTabPaneKey: '4'
}
export default {
  namespace:"DashboardManageModel",
  state:{...iniatialState},
  reducers:{
    concat(state,{ payload }){
      return { ...state, ...payload };
    }
  },
  effects: {
    *init({ payload },{ call,put,select }){
      let {query} = payload;
      let sharedType = '4';
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
              community_id: sessionStorage.getItem("communityId"),
              name: '',
              panel_status: '',
              panel_type: '',
              shared_type: 4,
            },
            params1:{
              page:1,
              rows:10,
              community_id:sessionStorage.getItem("communityId"),
              meter_no:"",
              meter_status:"",
              group:"",
              building:"",
              unit:"",
              room:"",
            },
          }
        })
      } else {
        yield put({
          type: 'concat',
          payload: {
            curTabPaneKey: '4',
            is_reset:true,
            params: {
              page: 1,
              rows: 10,
              community_id: sessionStorage.getItem("communityId"),
              name: '',
              panel_status: '',
              panel_type: '',
              shared_type: 4,
            },
            params1:{
              page:1,
              rows:10,
              community_id:sessionStorage.getItem("communityId"),
              meter_no:"",
              meter_status:"",
              group:"",
              building:"",
              unit:"",
              room:"",
            },
          }
        })
      }
      if(sharedType==1||sharedType==2||sharedType==3){
        yield put({ type:'getList',payload:{
          page:1,
          rows:10,
          community_id: sessionStorage.getItem("communityId"),
          name:'',
          panel_status:'',
          panel_type:'',
          shared_type: sharedType,
        }});
      }else if(sharedType==5){
        //独立电表表列表
        yield put({ type: 'getElectricityList', payload:{
          page: 1,
          rows: 10,
          community_id: sessionStorage.getItem("communityId"),
          meter_no: "",
          meter_status: "",
          group: "",
          building: "",
          unit: "",
          room: "",
        }});
      }else{
        //独立水表列表
        yield put({ type: 'getWaterList', payload:{
          page: 1,
          rows: 10,
          community_id: sessionStorage.getItem("communityId"),
          meter_no: "",
          meter_status: "",
          group: "",
          building: "",
          unit: "",
          room: "",
        }});
      }
      yield put({type:'getSharedLift',payload:{community_id: sessionStorage.getItem("communityId")}})
    },
    //水表列表
    *getWaterList({ payload }, { call, put, select }){
      const params1 = yield select(state=>state.DashboardManageModel.params1);
      const newParams = Object.assign(params1, payload);
      const { data,code } = yield call(meterReadingManagerList, payload);
      if(code == 20000){
        yield put({
          type: 'concat',
          payload: {
            list: data?data.list:[],
            totals: data.totals,
            params1: newParams
          }
        });
      }
    },
    //水表导出
    *downFilesWater ({ payload, callback }, { call, put, select }) {
      const { data, code } = yield call(waterTemplet, payload);
      if (code == 20000) {
        callback && callback(data.down_url)
      }
    },
    //电表列表
    *getElectricityList({ payload }, { call, put, select }) {
      const params1 = yield select(state=>state.DashboardManageModel.params1);
      const newParams = Object.assign(params1, payload);
      const { data,code } = yield call(electrictList, payload);
      if(code == 20000){
        yield put({
          type: 'concat',
          payload: {
            list: data?data.list:[],
            totals: data.totals,
            params1: newParams
          }
        });
      }
    },
    //电表导出
    *downElectricityFiles ({ payload, callback }, { call, put, select }) {
      const { data, code } = yield call(electrictTemplet, payload);
      if (code == 20000) {
        callback && callback(data.down_url)
      }
    },
    //仪表导出
    *meterExport({ payload,callback },{ call,put,select }){
      const { data,code } = yield call(meterExport, payload)
      if(code == 20000){
        yield put({
          type: 'concat',
          payload:{
            exportUrl: data
          }
        })
      }
      callback&&callback(data);
    },
    //水电表删除
    *sharedDeleteMeter({payload},{call,put}){
      const { code } = yield call(sharedDeleteMeter, payload);
      if(code == 20000){
        message.success("删除成功！");
      }
    },
    //公摊项目列表
    *getList({ payload }, { call, put, select }){
      const params = yield select(state=>state.DashboardManageModel.params);
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
        let curTabPaneKey = query.curTabPaneKey
        if (pathname === '/dashboardManage') {
          dispatch({ type: 'init', payload: {query: query}});
          let param = {
            page: 1,
            rows: 10,
            community_id: sessionStorage.getItem("communityId"),
            meter_no: "",
            meter_status: "",
            group: "",
            building: "",
            unit: "",
            room: "",
          }
          if(curTabPaneKey==4){
            dispatch({type: 'getWaterList', payload: param})
          }else if(curTabPaneKey==5){
            dispatch({type: 'getElectricityList', payload: param})
          }
        }
      })
    }
  }
}
