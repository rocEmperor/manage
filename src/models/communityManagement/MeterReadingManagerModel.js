import CommunityManagementService from './../../services/CommunityManagementService';
const { meterReadingManagerList, waterTemplet  } = CommunityManagementService;

export default {
  namespace: 'MeterReadingManagerModel',
  state: {
    list:[],
    totals: '',
    is_reset:false,
    params:{
      page:1,
      rows:10,
      community_id:'',
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
  effects: {
    *init({ payload }, { call, put }) {
      let query = {
        is_reset:true,
        params:{
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
      yield put({ type: 'getList', payload: query.params});
      yield put({ type: 'concat', payload: query });
    },
    *getList({ payload }, { call, put, select }) {
      const params = yield select(state=>state.MeterReadingManagerModel.params);
      const newParams = Object.assign(params, payload);
      const { data,code } = yield call(meterReadingManagerList, payload);
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
      const { data, code } = yield call(waterTemplet, payload);
      if (code == 20000) {
        callback && callback(data.down_url)
      }
    }
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, search }) => {
        if (pathname === '/meterReadingManager') {
          dispatch({ type: 'init'});
        }
      });
    }
  },
};
