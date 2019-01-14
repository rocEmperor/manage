import chargingManagement from '../../services/ChargingManagementService';
import { getCommunityId } from '../../utils/util'
import { message } from 'antd';
export default {
  namespace: 'GatheringCheckModel',
  state: {
    revokeModalVisible: false, // 撤销收款
    invoiceModalVisible: false, // 查看明细
    verificationVisible: false, //提交核销
    recordModalVisible: false, // 发票记录
    printModalVisible: false,  // 打印收据
    templateVisible: false, //选择模版
    loading: false,
    data: [],
    id:'',
    dataSource:[],
    totals: 0,
    invoiceModalInfo: {},
    revokeModalInfo: {},
    selectedRow: [],
    selectedRowKeys: [],
    recordModalInfo: {},
    rows: 10,
    currentPage: 1,
    total_money: '',
    revokeLoading: false,
    recordLoading: false,
    hasCondition: false,
    templateList:[],  //打印模板列表数据
  },
  reducers: {
    concat (state, { payload }) {
      return { ...state, ...payload }
    }
  },
  effects: {
    *init ({ payload }, { call, put, select }) {
      yield put({type: 'concat', payload: {currentPage: 1}})
      yield put({ type: 'templateDropDown', payload: { community_id: getCommunityId(), type: 2 } }); // 模版列表
      yield put({
        type: 'getList',
        payload: {
          community_id: getCommunityId(),
          rows: 10,
          currentPage: 1
        }
      });
    },
    //列表
    *getList ({ payload, page }, { call, put, select }) {
      let defaultParam = {};
      payload = Object.assign({}, defaultParam, payload);
      const {data, code } = yield call(chargingManagement.gatheringCheckList, payload);
      let GatheringCheckModel = yield select(state => state.GatheringCheckModel);
      let { currentPage } = GatheringCheckModel;
      if (code == 20000) {
        if (!page) {
          yield put({type: 'concat', payload: {currentPage: 1}})
        }
        yield put({
          type: 'concat',
          payload: {
            data: data.list ? data.list : [],
            totals: data.totals,
            selectedRow: [],
            selectedRowKeys: [],
            total_money: data.total_money,
            currentPage: page ? page : currentPage
          }
        })
      }
    },
    *recordShow ({ payload, modalType }, { call, put, select }) {
      let defaultParam = {};
      payload = Object.assign({}, defaultParam, payload);
      let type = {};
      type[modalType] = true;
      yield put({ type: 'concat', payload: type });
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
    *checkReq ({ payload, callback }, { call, put, select }) {
      let defaultParam = {};
      let type = payload.type;
      payload = Object.assign({}, defaultParam, payload);
      const { code } = yield call(chargingManagement.billIncomeCheck, payload);
      if (code == 20000) {
        if (type === 1) {
          message.success('撤销成功')
        } else {
          message.success('复核成功')
        }
        callback && callback();
      }
    },
    *submitCheck ({ payload, callback }, { call, put, select }) {
      let defaultParam = {};
      payload = Object.assign({}, defaultParam, payload);
      const { code } = yield call(chargingManagement.billIncomeReview, payload);
      if (code == 20000) {
        message.success('提交成功');
        yield put({type: 'concat', payload: {verificationVisible: false}});
        callback && callback();
      }
    },
    *revoke ({ payload, callback }, { call, put, select }) {
      let defaultParam = {};
      payload = Object.assign({}, defaultParam, payload);
      yield put({type: 'concat', payload: { revokeLoading: true }});
      const { code } = yield call(chargingManagement.billIncome, payload);
      if (code == 20000) {
        message.success('撤销收款成功');
        callback && callback();
        yield put({type: 'concat', payload: { revokeLoading: false }});
      }
    },
    //获取打印模板数据
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
    //获取发票信息
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
    //发票信息编辑
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
  },
  subscriptions: {
    setup ({ dispatch, history }) {
      return history.listen(({ pathname, search }) => {
        if (pathname === '/gatheringCheck') {
          dispatch({type: 'init'})
        }
      })
    }
  }
}