import StatisticalReportService from '../../../services/StatisticalReportService.js';
const { payList,getMonthList,exportMoth } = StatisticalReportService;
const initialState = {
  communityList:[],
  payList:[],
  is_reset:false,
  type:false,
  exportUrl:'',
  list:[],
  totals:'',
  params:{
    community_id: '',
    cost_id:'',
    start_time:''
  }
}

export default {
  namespace: 'ChargeMonthlyStatementModel',
  state: {...initialState},
  reducers: {
    concat(state, { payload }) {
      return { ...state, ...payload }
    }
  },
  effects: {
    *init({ payload }, { call, put, select }) {
      const mainLayout = yield select(state => state.MainLayout)
      let { communityList } = mainLayout;
      yield put({
        type: 'getPayList', payload: {}
      });
      yield put({
        type:'concat',
        payload:{
          is_reset:true,
          communityList:communityList?communityList:[],
          exportUrl:'',
          payList:[],
          type:false,
          list:[],
          totals:'',
          params:{
            community_id:'',
            cost_id:'',
            start_time:'',
          }
        }
      })
    },
    *getPayList({ payload },{ call,put,select }){
      const { data,code } = yield call(payList,payload)
      if(code == 20000){
        yield put({
          type: 'concat',
          payload: {
            payList: data? data:[]
          }
        });
      }

    },
    *getChannelList({ payload },{ call,put,select }){
      const params = yield select(state => state.ChargeMonthlyStatementModel.params);
      const newParams = Object.assign(params, payload);
      const { data,code } = yield call(getMonthList,payload);
      if(code == 20000){
        let list =data?data.list:[];
        let totalList = data?data.total_data:null;
        totalList!=null?list.push(totalList):list;
        //list.length>0&&Array.isArray(list)?list[list.length-1]['id']=Number(list[list.length-2].id)-1:[];
        yield put({
          type: 'concat',
          payload: {
            list: list,
            type:list.length>0?true:false,
            params: newParams,
            totals:data.total,
          }
        });
      }
    },
    *exportChannel({ payload,callback },{ call,put,select }){
      const { data,code } = yield call(exportMoth, payload)
      if(code == 20000){
        yield put({
          type: 'concat',
          payload:{
            exportUrl: data.down_url
          }
        })
      }
      callback&&callback(data.down_url);
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname }) => {
        if (pathname === '/chargeMonthlyStatement') {
          dispatch({ type: 'init' });
        }
      })
    }
  }
}
