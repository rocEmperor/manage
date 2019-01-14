import StatisticalReportService from '../../../services/StatisticalReportService.js';
import CommunityManagementService from '../../../services/CommunityManagementService';
const { payList,getRoomList,exportRoom } = StatisticalReportService;
const initialState = {
  is_reset:false,
  communityList:[],
  payList:[],
  exportUrl:"",
  totals:'',
  list: [],
  groupData:[],
  buildingData:[],
  unitData:[],
  roomData:[],
  type:false,
  communityId:'',
  params:{
    community_id: '',
    cost_id:'',
    start_time:'',
    group:'',
    building:'',
    unit:'',
    room:'',
  }
}

export default {
  namespace: 'ChargesCollectableDetailedModel',
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
          communityList:communityList?communityList:[],
          is_reset:true,
          payList:[],
          exportUrl:"",
          totals:'',
          list: [],
          type:false,
          communityId:'',
          groupData:[],
          buildingData:[],
          unitData:[],
          roomData:[],
          params:{
            community_id: '',
            cost_id:'',
            start_time:'',
            group:'',
            building:'',
            unit:'',
            room:'',
          }
        }
      })
    },
    *getPayList({ payload },{ call,put,select }){
      const { data,code } = yield call(payList,payload);
      if(code == 20000){
        yield put({
          type: 'concat',
          payload: {
            payList: data? data:[]
          }
        });
      }

    },
    *getList({ payload },{ call,put,select }){
      const params = yield select(state => state.ChargesCollectableDetailedModel.params);
      const newParams = Object.assign(params, payload);
      const { data,code } = yield call(getRoomList,payload);
      let list = data?data.list:[];
      list.map((value,index)=>{
        return Object.assign(value,
          {'housing':value.building+value.unit+value.room},
          {'bill_amounts':value.bill_amount},
          {'bill_lasts':value.bill_last},
          {'bill_historys':value.bill_history}
        )
      })
      list.length>0&&Array.isArray(list)?list[list.length-1]['housing']='':[];
      //list.length>0&&Array.isArray(list)?list[list.length-1]['id']=Number(list[list.length-2].id)-1:[];
      if(code == 20000){
        yield put({
          type: 'concat',
          payload: {
            list: list,
            totals:data.total,
            params: newParams,
            type:list.length>0?true:false,
          }
        });
      }
    },
    *exportMonth({ payload,callback },{ call,put,select }){
      const { data,code } = yield call(exportRoom, payload)
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
    *getGroupList({ payload }, { call, put }) {
      const { data,code } = yield call(CommunityManagementService.group, payload);
      if(code == 20000){
        yield put({
          type: 'concat',
          payload: {
            groupData: data?data:[],
            buildingData:[],
            unitData:[],
            roomData:[],
          }
        });
      }
    },
    *getBuildingList({ payload }, { call, put }) {
      const { data,code } = yield call(CommunityManagementService.building, payload);
      if(code == 20000){
        yield put({
          type: 'concat',
          payload: {
            buildingData: data?data:[],
            unitData:[],
            roomData:[],
          }
        });
      }
    },
    *getUnitList({ payload }, { call, put }) {
      const { data,code } = yield call(CommunityManagementService.unit, payload);
      if(code == 20000){
        yield put({
          type: 'concat',
          payload: {
            unitData: data?data:[],
            roomData:[],
          }
        });
      }
    },
    *getRoomList({ payload }, { call, put }) {
      const { data,code } = yield call(CommunityManagementService.room, payload);
      if(code == 20000){
        yield put({
          type: 'concat',
          payload: {
            roomData: data?data:[],
          }
        });
      }
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname }) => {
        if (pathname === '/chargesCollectableDetailed') {
          dispatch({ type: 'init' });
        }
      })
    }
  }
}