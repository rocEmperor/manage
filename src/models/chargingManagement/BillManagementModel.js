import ChargingManagementService from '../../services/ChargingManagementService';
import { message } from 'antd';
import { download } from '../../utils/util';

const initialState = {
  visible: false,
  visible2: false,
  visible1: false,
  is_reset: false,
  type: "",
  costType: [],
  typeOption: [],
  data: [],
  reportData: {},
  totals: "",
  params: {
    rows: 10,
    page: 1,
    community_id: sessionStorage.getItem("communityId"),
    building: [],
    group: [],
    unit: [],
    room: [],
    year: "",
    costList: ""
  },
}

export default {
  namespace: 'BillManagementModel',
  state: {...initialState},
  reducers: {
    concat(state, { payload }) {
      return { ...state, ...payload };
    }
  },
  effects: {
    *init(payload, { call, put, select }) {
      yield put({type: 'concat', payload: {...initialState}});
      const initParams = {
        rows: 10,
        page: 1,
        community_id: sessionStorage.getItem("communityId"),
        building: [],
        group: [],
        unit: [],
        room: [],
        year: "",
        costList: "",
        typeOption: [],
      };
      yield put({
        type: 'concat', payload: { params: initParams, is_reset: true, }
      })
      yield put({
        type: 'getBillList', payload: initParams
      });
      yield put({
        type: 'payChannel',
      });
      yield put({
        type: 'getPayList'
      });
    },
    *payChannel({ payload }, { call, put, select }) {
      const { data, code } = yield call(ChargingManagementService.payChannelReq, payload);
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: {
            typeOption: data ? data : []
          }
        })
      }
    },
    *getBillList({ payload }, { call, put, select }) {
      const params = yield select(state => state.BillManagementModel.params);
      const newParams = Object.assign(params, payload);
      const { data, code } = yield call(ChargingManagementService.billList, payload);
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: {
            data: data.list,
            reportData: data.reportData,
            totals: data.totals,
            params: newParams,
          }
        });
      }
    },
    *getPayList({ payload }, { call, put, select }) {
      const { data, code } = yield call(ChargingManagementService.payList, payload);
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: {
            costType: data,
          }
        });
      }
    },
    *export({ payload }, { call, put, select }) {
      const { data, code } = yield call(ChargingManagementService.alipayCostDownExportBill, payload);
      if (code == 20000) {
        download(data.down_url);
        message.success('导出成功！');
      }
    },
    *downFilesMore({ payload }, { call, put, select }) {
      const { data, code } = yield call(ChargingManagementService.alipayCostGetPayExcel, payload);
      if (code == 20000) {
        download(data.down_url);
        message.success('导出成功！');
      }
    },
    *downFiles({ payload }, { call, put, select }) {
      const { data, code } = yield call(ChargingManagementService.alipayCostGetExcel, payload);
      if (code == 20000) {
        download(data.down_url);
        message.success('导出成功！');
      }
    },    
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, search }) => {
        if (pathname === '/billManage') {
          dispatch({ type: 'init' });
        }
      });
    }
  },
};
