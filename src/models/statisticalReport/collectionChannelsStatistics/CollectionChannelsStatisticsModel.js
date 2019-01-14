import StatisticalReportService from '../../../services/StatisticalReportService.js';
const { payList,getChannelList,exportChannel } = StatisticalReportService;
const initialState = {
  is_reset:false,
  communityList:[],
  payList:[],
  list:[],
  exportUrl:"",
  type:false,
  totals:'',
  params:{
    community_id:'',
    cost_id:'',
    start_time:'',
    end_time:'',
  }
}

export default {
  namespace: 'CollectionChannelsStatisticsModel',
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
          is_reset:true,
          payList:[],
          list:[],
          type:false,
          exportUrl:"",
          totals:'',
          params:{
            community_id:'',
            cost_id:'',
            start_time:'',
            end_time:'',
          }
        }
      });
      yield put({
        type: 'getPayList', payload: {}
      });
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
      const params = yield select(state => state.CollectionChannelsStatisticsModel.params);
      const newParams = Object.assign(params, payload);
      const { data,code } = yield call(getChannelList,payload);
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
            totals:data.total,
            params: newParams,
          }
        });
      }
    },
    *exportChannel({ payload,callback },{ call,put,select }){
      const { data,code } = yield call(exportChannel, payload)
      if(code == 20000){
        yield put({
          type: 'concat',
          payload:{
            exportUrl: data.down_url
          }
        })
      }
      callback&&callback(data.down_url)
    }
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname }) => {
        if (pathname === '/collectionChannelsStatistics') {
          dispatch({ type: 'init' });
        }
      })
    }
  }
}