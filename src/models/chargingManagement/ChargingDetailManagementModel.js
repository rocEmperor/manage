import ChargingManagementService from '../../services/ChargingManagementService';
import { message } from 'antd';
const {
  chargeListReq,
  getGroupsList,
  payChannelReq,
  costTypeList,
  payStatusReq,
  chargeExportBillReq,
  community
} = ChargingManagementService;
const initialState = {
  current: 1,
  submitLoading: false,
  flag: 1,
  data: [],
  reportData: {},
  loading: false,
  progressPercent: 0,
  progressState: 'active',
  textShow: false,
  total: 0,
  total_money: 0,
  helisBill: false,
  sum: 0,
  successCount: 0,
  groupData: [],
  buildingData: [],
  unitData: [],
  roomData: [],
  costType: [],
  path: '',
  file_name: '',
  typeOption: [],
  progressStates: 'active',
  textShows: false,
  successCounts: 0,
  sums: 0,
  progressPercents: 0,
  payStatus: [],
  communityList: [],
  community_id: sessionStorage.getItem("communityId"),
  params:{
    community_id: sessionStorage.getItem("communityId"),
    group: '',
    building: '',
    unit: '',
    room: '',
    room_status: '',
    date: '',
    trade_no: '',
    costList: '',
    pay_channel: '',
    pay_type: '',
    trade_type: '',
    page: 1,
    rows: 10
  },
  query:{
    community_id: sessionStorage.getItem("communityId"),
    group: '',
    building: '',
    unit: '',
  }
};
export default {
  namespace: 'ChargingDetailManagementModel',
  state: {...initialState},
  reducers: {
    concat (state, { payload }) {
      return { ...state, ...payload }
    }
  },
  effects: {
    *init ({ payload }, { call, put, select }) {
      yield put({type: 'concat', payload: {...initialState}})
      let query = {
        community_id: sessionStorage.getItem("communityId"),
        group: '',
        building: '',
        unit: '',
      };
      let listQuery = {
        community_id: sessionStorage.getItem("communityId"),
        group: '',
        building: '',
        unit: '',
        room: '',
        room_status:"",
        date:'',
        trade_no: '',
        costList:'',
        pay_channel:'',
        page:1,
        rows:10,
        source:1,
        trade_type:'',
        pay_type:'',
      };
      yield put({type: 'getList', payload: listQuery});
      yield put({type: 'groupList', payload: query});
      yield put({type: 'costType', payload: {}});
      yield put({type: 'getPayStatus', payload: {data: ''}});
      yield put({type: 'payChannel', payload: {}});
      yield put({type: 'getCommunityList'})
    },
    *getList ({ payload, callback }, { call, put, select }) {
      const params = yield select(state => state.ChargingDetailManagementModel.params);
      const newParams = Object.assign(params, payload);
      const { data, code } = yield call(chargeListReq, payload);
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: {
            loading: false,
            data: data.list,
            reportData: data.reportData,
            total: data.totals ? data.totals - 0 : 0,
            total_money: data.total_money
          }
        });
        if (callback) {
          yield put({
            type: 'concat',
            payload: {
              loading: false,
              submitLoading: false,
              params: newParams
            }
          })
        }
      }
    },
    *groupList ({ payload }, { call, put, select }) {
      let defaultParam = {}
      payload = Object.assign({}, defaultParam, payload);
      const { data, code } = yield call(getGroupsList, payload);
      if (code == 20000) {
        yield put({type: 'concat', payload: {groupData: data}})
      }
    },
    *costType ({ payload }, { call, put, select }) {
      const { data, code } = yield call(costTypeList, payload);
      if (code == 20000) {
        yield put({type: 'concat', payload: { costType: data }})
      }
    },
    *getPayStatus ({ payload }, { call, put, select }) {
      // let date = new Date();
      // let dateNow = `${date.getFullYear()}-${(date.getMonth()+1)}`;
      yield put({type: 'concat', payload: {submitLoading: true}})
      const { data, code } = yield call(payStatusReq, payload);
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: {
            payStatus: data,
            code: data.code
          }
        })
      }
    },
    *payChannel ({ payload }, { call, put, select }) {
      let defaultParam = {}
      payload = Object.assign({}, defaultParam, payload);
      const { data, code } = yield call(payChannelReq, payload);
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: {
            typeOption: data ? data : []
          }
        })
      }
    },
    *chargeExportBill ({ payload }, { call, put, select }) {
      let defaultParam = {}
      payload = Object.assign({}, defaultParam, payload);
      const { data, code } = yield call(chargeExportBillReq, payload);
      if (code == 20000) {
        location.href = data.down_url;
        message.success('报表数据已生成!');
      }
    },
    *getCommunityList({ payload }, { call, put }) {
      const { data,code } = yield call(community, payload);
      if(code == 20000){
        yield put({
          type: 'concat',
          payload: {
            communityList: data ? data : []
          }
        });
      }
    },
  },
  subscriptions: {
    setup ({ dispatch, history }) {
      return history.listen(({ pathname }) => {
        if (pathname === '/chargeDetailManagement') {
          dispatch({
            type: 'init',
            payload: {}
          });
          dispatch({
            type: 'concat',
            payload: {
              flag: 1
            }
          })
        }
      })
    }
  }
}
