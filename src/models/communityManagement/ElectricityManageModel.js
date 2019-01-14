import CommunityManagementService from './../../services/CommunityManagementService';
const {electrictList, electrictTemplet} = CommunityManagementService;
export default {
  namespace:'ElectricityManageModel',
  state:{
    community_id: sessionStorage.getItem("communityId"),
    list:[],
    totals: '',
    is_reset:false,
    params:{
      page:1,
      rows:10,
      community_id: sessionStorage.getItem("communityId"),
      meter_no:"",
      meter_status:"",
      group:"",
      building:"",
      unit:"",
      room:"",
    }
  },
  reducers: {
    concat(state, { payload }) {
      return { ...state, ...payload };
    }
  },
  effects:{
    *init({ payload }, { call, put,select }) {
      let query ={
        is_reset:true,
        community_id: sessionStorage.getItem("communityId"),
        params: {
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
      }
      yield put({ type: 'concat', payload: query });
      yield put({ type: 'getList', payload: query.params});
    },
    *getList({ payload }, { call, put, select }) {
      const params = yield select(state=>state.ElectricityManageModel.params);
      const newParams = Object.assign(params, payload);
      const { data,code } = yield call(electrictList, payload);
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
    *downFiles ({ payload, callback }, { call, put, select }) {
      const { data, code } = yield call(electrictTemplet, payload);
      if (code == 20000) {
        callback && callback(data.down_url)
      }
    }
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, search }) => {
        if (pathname === '/electricityManage') {
          dispatch({ type: 'init'});
        }
      });
    }
  },
}
