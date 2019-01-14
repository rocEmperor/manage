import ChargingManagementService from '../../services/ChargingManagementService';
import { getCommunityId } from '../../utils/util';
const {
  costTypeList,
  getGroupsList,
  getSrarchBillList,
  getBuildingsList,
  getUnitsList,
  templateDropDown,
  printInfoList,
  chargeNumberReq,
} = ChargingManagementService;
const initialState = {
  is_reset:false,
  tableType: '1',              // 搜索结果table的显示类型，1：按单元收缴table 2:按户收缴table
  startTime: '',               // 开始时间
  endTime: '',                 // 结束时间
  printShow: false,
  data: [],                     // 存储按户收缴数据
  groupData: [],
  buildingData: [],
  unitData: [],
  serviceData: [],             // 缴费项
  entry_amounts: 0,            // 缴费总金额
  billdata: [],                 // 账单列表
  totals: '',         
  code_image: [],              // 小区二维码图片
  logo_url: [],                 // 小区log图片
  model_title: '',             // 模板标题
  first_area: '',              // 自定义区域1
  second_area: '',             // 自定义区域2
  curDataSource: [],
  curColumns: [],
  visiableTemplate:false,
  selectedRowKeys:[],
  templateList:[],
  params:{
    community_id: sessionStorage.getItem("communityId"),
    group: '',
    unit: '',
    building: '',
    cost_type: '',
    acct_period_end: '',
    acct_period_start: '',
    page: 1, 
    rows: 50 
  }
};
export default {
  namespace: 'ReminderPrintModel',
  state: {...initialState},
  reducers: {
    concat (state, { payload }) {
      return { ...state, ...payload }
    }
  },
  effects: {
    *init ({ payload }, { call, put, select }) {
      yield put({type: 'concat', payload: {...initialState}});
      let query = {
        community_id: getCommunityId(),
        group: '',
        building: '',
        unit: ''
      };
      yield put({type: 'groupList', payload: query});     // 获取苑期区
      yield put({ type: 'serviceList', payload: {} });     // 获取缴费项
      yield put({ type: 'templateDropDown', payload: { community_id: getCommunityId(),type:1} });     // 模版列表
      yield put({
        type: 'concat',
        payload: {
          is_reset:true,
          billdata: [],        // 账单列表
          totals:'',
          buildingData:[],
          unitData:[],
        }
      })
    },
    *groupList ({ payload }, { call, put, select }) {
      let defaultParam = {}
      payload = Object.assign({}, defaultParam, payload);
      const { data, code } = yield call(getGroupsList, payload);
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: {
            groupData: data
          }
        })
      }
    },
    *serviceList ({ payload }, { call, put, select }) {
      const { data, code } = yield call(costTypeList, payload);
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: {
            serviceData: data
          }
        })
      }
    },
    *templateDropDown({ payload }, { call, put, select }) {
      const { data, code } = yield call(templateDropDown, payload);
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: {
            templateList: data?data.list:[]
          }
        })
      }
    },
    *getList ({ payload, callback }, { call, put, select }) {
      let params = yield select(state => state.ReminderPrintModel).params;
      payload = Object.assign({}, params, payload);
      const { data, code } = yield call(getSrarchBillList, payload);
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: {
            entry_amounts: data.entry_amounts == null ? '0' : data.entry_amounts,
            billdata: data.list,
            totals:data.totals,
            params:payload
          }
        });
      }
    },
    *buildingList ({ payload }, { call, put, select }) {
      let defaultParam = {};
      payload = Object.assign({}, defaultParam, payload);
      const { data, code } = yield call(getBuildingsList, payload);
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: {
            buildingData: data,
            unitData:[],
          }
        })
      }
    },
    *unitList ({ payload }, { call, put, select }) {
      let defaultParam = {};
      payload = Object.assign({}, defaultParam, payload);
      const { data, code } = yield call(getUnitsList, payload);
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: {
            unitData: data
          }
        })
      }
    },
    *numberPlus({ payload }, { call, put, select }) {
      yield call(chargeNumberReq, payload);
    },
    *printInfo ({ payload,callback}, { call, put }) {
      const { data, code } = yield call(printInfoList, payload);
      if (code == 20000) {
        callback && callback()
        yield put({
          type: 'concat',
          payload: {
            data: data,
            printShow: true
          }
        })
      }
    }
  },
  subscriptions: {
    setup ({ dispatch, history }) {
      return history.listen(({ pathname }) => {
        if (pathname === '/printLetter') {
          dispatch({
            type: 'init',
            payload: {}
          })
        }
      })
    }
  }
}
