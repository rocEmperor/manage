import chargingManagement from '../../services/ChargingManagementService';
import { getCommunityId } from '../../utils/util';
import queryString from 'query-string';
import { message } from 'antd';

let initialState = {
  loading: false,
  dataObj: {},
  data: [],
  modalData: [],
  totals: 0,
  currentPage: 1,
  checkIdsList: [],
  checkValueList: {},
  collectTotal: 0,        // 实收总计
  favourableTotal: 0,    // 优惠总计
  unpaidTotal: 0,        // 未付总计
  payableTotal: 0,        // 应缴总计
  currentMoney: 0,
  visible: false,
  visiblePrint: false,
  visibleLook: false,
  typeOption: [],
  templateList: [],
  id: '',
  payType: [],
  roomsData: {},
  reportData: {},
  tableKey: 0,
  lockArr: [],
  success_count: 0,
  defeat_count: 0,
  gatheringLoading1: false,
  gatheringLoading2: false,
  dataSource:[],
};
export default {
  namespace: 'CashierDeskModel',
  state: { ...initialState },
  reducers: {
    concat (state, { payload }) {
      return { ...state, ...payload };
    }
  },
  effects: {
    *init ({ payload }, { call, put, select }) {
      let layout = yield select(state => state.MainLayout);
      yield put({ type: 'concat', payload: initialState });
      if (layout.communityId) {
        yield put({ type: 'payChannel', payload: {} });
        yield put({ type: 'templateDropDown', payload: { community_id: getCommunityId(), type: 2} });
        yield put({ type: 'payType', payload: {}});  // 获取缴费方式
      }
    },
    *getList({ payload, callback }, { call, put, select }) {
      let defaultParam = { page: 1, rows: 10 };
      payload = Object.assign({}, defaultParam, payload);
      yield put({
        type: 'concat',
        payload: {
          loading: true
        }
      });
      const { data, code } = yield call(chargingManagement.collectionsListReq, payload);
      let dataObj = {};
      data.dataList.forEach((val, index) => {
        let target = {...val};
        target.factMoney = val.bill_entry_amount;
        target.payWay = '1';
        dataObj[val.bill_id] = target;
      });
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: {
            page: 1,
            loading: false,
            totals: data.totals ? data.totals - 0 : 0,
            data: data.dataList ? data.dataList : [],
            roomsData: data.roomData,
            reportData: data.reportData,
            dataObj: { ...dataObj },
            selectedRowKeys: []
          }
        });
      }
    },
    *submitCharge ({ payload, callback }, { call, put, select }) {
      let defaultParam = {};
      payload = Object.assign({}, defaultParam, payload);
      yield put({type: 'concat', payload: { gatheringLoading1: true }});
      const { data, code } = yield call(chargingManagement.submitCharge, payload);
      if (code == 20000) {
        if (data.defeat_count == data.success_count) {
          let CashierDeskModel = yield select(state => state.CashierDeskModel);
          let { tableKey } = CashierDeskModel;
          message.success('收款成功');
          yield put({
            type: 'concat',
            payload: {
              data: [],
              visible: false,
              visiblePrint: false,
              modalData: [],
              currentPage: 1,
              checkIdsList: [],
              checkValueList: {},
              totals: 0,
              collectTotal: 0,
              favourableTotal: 0,
              unpaidTotal: 0,
              dataObj: {},
              tableKey: ++tableKey,
              selectedRowKeys: [],
              gatheringLoading1: false
            }
          });
          callback && callback()
        } else {
          yield put({
            type: 'concat',
            payload: {
              lockArr: data.lockArr,
              visible: false,
              success_count: data.success_count,
              defeat_count: data.defeat_count,
              visibleLook: true,
              gatheringLoading1: false
            }
          })
        }
      }
    },
    *saveAndPrint ({ payload, callback }, { call, put, select }) {
      let defaultParam = {};
      payload = Object.assign({}, defaultParam, payload);
      yield put({type: 'concat', payload: { gatheringLoading2: true }});
      const { data, code } = yield call(chargingManagement.billCollectPrint, payload);
      if (code == 20000) {
        if (data.defeat_count == data.success_count) {
          let CashierDeskModel = yield select(state => state.CashierDeskModel);
          let { tableKey } = CashierDeskModel;
          message.success('收款成功');
          yield put({
            type: 'concat',
            payload: {
              data: [],
              visible: false,
              visiblePrint: true,
              modalData: [],
              currentPage: 1,
              checkIdsList: [],
              checkValueList: {},
              totals: 0,
              collectTotal: 0,
              favourableTotal: 0,
              unpaidTotal: 0,
              dataObj: {},
              tableKey: ++tableKey,
              gatheringLoading2: false,
              dataSource:data?data:[],
            }
          });
          callback && callback()
        } else {
          yield put({
            type: 'concat',
            payload: {
              lockArr: data.lockArr,
              visible: false,
              success_count: data.success_count,
              defeat_count: data.defeat_count,
              visibleLook: true,
              gatheringLoading2: false
            }
          })
        }
      }
    },
    *payChannel({ payload }, { call, put, select }) {
      let defaultParam = {};
      payload = Object.assign({}, defaultParam, payload);
      const { data, code } = yield call(chargingManagement.payChannelReq, payload);
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: { typeOption: data ? data : [] }
        })
      }
    },
    *templateDropDown({ payload }, { call, put }) {
      const { data, code } = yield call(chargingManagement.templateDropDown, payload);
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: {
            templateList: data ? data.list : []
          }
        })
      }
    },
    *payType({ payload,callback }, { call, put, select }) {
      const { data, code } = yield call(chargingManagement.payTypeList, payload);
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: { payType: data ? data : [] }
        });
        let info  = yield select(state => state.CashierDeskModel);
        let layout = yield select(state => state.MainLayout);
        let queryList = {
          community_id: layout.communityId,
          group: '',
          building: '',
          unit: '',
          room_id: info.id,
        };
        if (info.id) {   // 放回调内是因为会出现列表getList，比类型payType接口执行得快，payType[0].key为undefined
          yield put({
            type: 'getList',
            payload: queryList
          })
        }
      }
    },
    *numberPlus({ payload }, { call, put, select }) {
      yield call(chargingManagement.chargeNumberReq, payload);
    }
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, search }) => {
        let query = queryString.parse(search);
        if (pathname === '/cashierDesk') {
          dispatch({type: 'init', payload: { query: query }})
        }
      })
    }
  }
}
