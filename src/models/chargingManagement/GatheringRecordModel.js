import chargingManagement from '../../services/ChargingManagementService';
import { message } from 'antd'
import { getCommunityId } from '../../utils/util'
export default {
  namespace: 'GatheringRecordModel',
  state: {
    loading: false,
    data: [],
    currentPage: 1,
    rows: 10,
    totals: 0,
    revokeModalVisible: false, // 撤销收款
    recordModalVisible: false, // 发票记录
    printModalVisible: false,  // 打印收据
    invoiceModalVisible: false, // 查看明细
    templateVisible: false, //选择模版
    id:'',
    dataSource:[],
    invoiceModalInfo: {},
    revokeModalInfo: {},
    recordModalInfo: {},
    revokeLoading: false,
    recordLoading: false,
    templateList:[],
  },
  reducers: {
    concat (state, { payload }) {
      return { ...state, ...payload }
    }
  },
  effects: {
    *init ({ payload }, { call, put, select }) {
      yield put({type: 'concat', payload: {currentPage: 1}});
      yield put({ type: 'templateDropDown', payload: { community_id: getCommunityId(), type: 2 } }); // 模版列表
      yield put({
        type: 'getList',
        payload: {
          community_id: getCommunityId(),
          rows: 10,
          page: 1
        }
      });
    },
    *getList ({ payload, page }, { call, put, select }) {
      let defaultParam = {};
      payload = Object.assign({}, defaultParam, payload);
      let { data, code } = yield call(chargingManagement.gatheringRecordList, payload);
      if (code == 20000) {
        if (!page) {
          yield put({type: 'concat', payload: {currentPage: 1}})
        }
        yield put({
          type: 'concat',
          payload: {
            data: data.list ? data.list : [],
            totals: data.totals
          }
        })
      }
    },
    *recordShow ({ payload, modalType }, { call, put, select }) {
      let defaultParam = {};
      payload = Object.assign({}, defaultParam, payload);
      let type = {};
      type[modalType] = true;
      yield put({ type: 'concat', payload: type
      });
      const { data, code } = yield call(chargingManagement.gatheringRecordShow, payload);
      if (data.list) {
        data.list.forEach((val, index) => {
          data.list[index].id = index;
        })
      }
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: {
            invoiceModalInfo: { ...data },
          }
        })
      }
    },
    *revoke ({ payload, callback }, { call, put, select }) {
      let defaultParam = {};
      payload = Object.assign({}, defaultParam, payload);
      yield put({type: 'concat', payload: { revokeLoading: true }});
      const { code } = yield call(chargingManagement.recordBillIncome, payload);
      if (code == 20000) {
        message.success('撤销收款成功');
        callback && callback();
        yield put({type: 'concat', payload: { revokeLoading: false }});
      }
    },
    *invoiceRecord ({ payload, modalType, recordId }, { call, put, select }) {
      let defaultParam = {};
      payload = Object.assign({}, defaultParam, payload);
      let type = {};
      type[modalType] = true;
      yield put({
        type: 'concat',
        payload: type
      });
      const { data, code } = yield call(chargingManagement.invoiceShow, payload);
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: {
            recordModalInfo: data ? { ...data, record_id: recordId } : {record_id: recordId}
          }
        })
      }
    },
    *invoiceEdit ({ payload, callback }, { call, put, select }) {
      let defaultParam = {};
      payload = Object.assign({}, defaultParam, payload);
      yield put({type: 'concat', payload: { recordLoading: true }});
      const { code } = yield call(chargingManagement.invoiceEdit, payload);
      if (code == 20000) {
        callback && callback();
        yield put({type: 'concat', payload: { recordLoading: false }});
      }
    },
    *printReceiptInfo ({ payload, modalType,callback }, { call, put, select }) {
      let defaultParam = {};
      payload = Object.assign({}, defaultParam, payload);
      let type = {};
      type[modalType] = true;
      yield put({ type: 'concat', payload: type });
      const { data, code } = yield call(chargingManagement.printReceiptInfo, payload);
      if (code == 20000) {
        callback && callback();
        yield put({
          type: 'concat',
          payload: {
            dataSource:data?data:[],
            templateVisible:false,
          }
        })
      }
    },
    *numberPlus({ payload }, { call, put, select }) {
      yield call(chargingManagement.chargeNumberReq, payload);
    },
    *templateDropDown({ payload }, { call, put, select }) {
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
  },
  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen(({ pathname, search }) => {
        if (pathname === '/gatheringRecord') {
          dispatch({type: 'init'})
        }
      })
    }
  }
}
