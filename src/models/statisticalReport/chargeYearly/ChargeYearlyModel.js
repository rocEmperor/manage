import StatisticalReportService from '../../../services/StatisticalReportService.js';
const { payList,exportYear,getYearList } = StatisticalReportService;
const initialState = {
  is_reset:false,
  communityList:[],
  payList:[],
  type:false,
  list: [],
  exportUrl: '',
  totals:'',
  params:{
    community_id: '',
    cost_id:'',
    start_time:'',
  }
}

export default {
  namespace: 'ChargeYearlyModel',
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
        type:'concat',
        payload:{
          communityList:communityList?communityList:[],
          payList:[],
          type:false,
          list: [],
          exportUrl: '',
          totals:'',
          is_reset:true,
          params:{
            community_id: '',
            cost_id:'',
            start_time:'',
          }
        }
      });
      yield put({type:'getPayList',payload:{}})
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
    *getMonthReportList({ payload },{ call,put,select }){
      const params = yield select(state => state.ChargeYearlyModel.params);
      const newParams = Object.assign(params, payload);
      const { data,code } = yield call(getYearList,payload);
      let list = data&&data.list?data.list:[];
      list.map((value,index)=>{
        return Object.assign(value,{'bill_amounts':value.bill_amount},{'bill_lasts':value.bill_last},{'bill_historys':value.bill_history})
      })
      //list.length>0&&Array.isArray(list)?list[list.length-1]['id']=Number(list[list.length-2].id)-1:[];
      // let total = data?data.total_data:null;
      // Object.assign(total,{'community_name':'合计'},{'bill_amounts':total.bill_amount},{'bill_lasts':total.bill_last},{'bill_historys':total.bill_history})
      // list.push(total)
      if(code == 20000){
        yield put({
          type: 'concat',
          payload: {
            list: list,
            totals:data.total,
            type:list.length>0?true:false,
            params: newParams,
          }
        });
      }
    },
    *exportMonth({ payload, callback }, { call, put, select }) {
      const { data, code } = yield call(exportYear, payload);
      if(code == 20000){
        yield put({
          type: 'concat',
          payload: {
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
        if (pathname === '/chargeYearly') {
          dispatch({ type: 'init' });
        }
      })
    }
  }
}