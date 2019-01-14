import ChargingManagementService from '../../services/ChargingManagementService';
import { getCommunityId } from '../../utils/util';
const {
  billChargeList,
  chargeNumberReq,
  getGroupsList,
  costTypeList,
  printBillReq,
  getUnitsList,
  getRoomsList,
  getBuildingsList
} = ChargingManagementService;

export default  {
  namespace: 'ReceiptPrintModel',
  state: {
    totals: 0,
    page: 1,
    data: [],
    groupData: [],
    is_reset:false,
    buildingData: [],
    unitData: [],
    roomData: [],
    submitLoading: false,
    loading: false,
    serviceData: [], // 缴费项
    costType: [],
    payType: [],
    roomsData: [],
    reportData: {},
    bill_list: [],
    info: {},
    current: 1,
    selectedNum: 0,
    selectedRowKeys: [],
    selectDataSource: [],
    flag: false,
    visible: false
  },
  reducers: {
    concat (state, { payload }) {
      return { ...state, ...payload }
    }
  },
  effects: {
    *init ({ payload }, { call, put, select }) {
      let query = {
        community_id: getCommunityId(),
        group: '',
        building: '',
        unit: '',
        room:'',
      };
      yield put({
        type: 'groupList',
        payload: query
      });
      yield put({
        type: 'concat',
        payload: {
          is_reset:true,
          submitLoading: false,
          totals: 0,
          community_id: getCommunityId(),
          data: [],    // 账单列表
          selectedNum:0,       
          roomsData: {},
          reportData: {},
          buildingData: [],  //重置下拉数据
          unitData: [],
          roomData: [],
        }
      });
      yield put({
        type: 'costType'
      })
    },
    *getList ({ payload, callback }, { call, put, select }) {
      let defaultParam = { page: 1, rows: 20 };
      payload = Object.assign({}, defaultParam, payload);
      yield put({
        type: 'concat',
        payload: {
          loading: true,
          submitLoading: true
        }
      });
      const { data, code } = yield call(billChargeList, payload);
      if (code == 20000) {
        if (callback) {
          yield put({
            type: 'concat',
            payload: { searchLoading: false }
          });
        }
        yield put({
          type: 'concat',
          payload: {
            page: 1,
            loading: false,
            submitLoading: false,
            totals: data.totals ? data.totals - 0 : 0,
            data: data.dataList,
            roomsData: data.roomData,
            reportData: data.reportData
          }
        })
      }
    },
    *numberPlus ({ payload }, { call, put, select }) {
      yield call(chargeNumberReq, payload);
    },
    *groupList ({ payload }, { call, put, select }) {
      let defaultParam = {};
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
    *costType ({ payload }, { call, put, select }) {
      const { data, code } = yield call(costTypeList, payload);
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: {
            costType: data
          }
        })
      }
    },
    *getPrintBill ({ payload }, { call, put, select }) {
      const { data, code } = yield call(printBillReq, payload);
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: {
            bill_list: data.bill_list,
            info: data.print_room_data
          }
        })
      }
    },
    *buildingList ( { payload }, { call, put, select }) {
      let defaultParam = {};
      payload = Object.assign({}, defaultParam, payload);
      const { data, code } = yield call(getBuildingsList, payload);
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: {
            buildingData: data,
            unitData: [],
            roomData: [],
          }
        })
      }
    },
    *unitList ( {payload }, { call, put, select }) {
      let defaultParam = {};
      payload = Object.assign({}, defaultParam, payload);
      const { data, code } = yield call(getUnitsList, payload);
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: {
            unitData: data,
            roomData: [],
          }
        })
      }
    },
    *roomList ( {payload }, { call, put, select }) {
      let defaultParam = {};
      payload = Object.assign({}, defaultParam, payload);
      const { data, code } = yield call(getRoomsList, payload);
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: {
            roomData: data
          }
        })
      }
    }
  },
  subscriptions: {
    setup ({ dispatch, history }) {
      return history.listen(({ pathname }) => {
        if (pathname === '/printCharge') {
          dispatch({
            type: 'init',
            payload: {}
          })
        }
      })
    }
  }
}
