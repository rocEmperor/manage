import { message } from 'antd';
import ChargingManagementService from './../../services/ChargingManagementService';
const { billIncomeReviewList, gatheringRecordShow, billIncomeConfirm } = ChargingManagementService;

export default {
  namespace: 'VerificationModel',
  state: {
    list: [],
    is_reset: false,
    totals: '',
    detail:'',
    communityList:[],
    visible:false,
    params: {
      page: 1,
      rows: 10,
      community_id: "",
      check_status: "",
      entry_at: "",
      income_end: "",
      income_start: "",
    }
  },
  reducers: {
    concat(state, { payload }) {
      return { ...state, ...payload };
    }
  },
  effects: {
    *init({ payload }, { call, put, select }) {
      const mainLayout = yield select(state => state.MainLayout);
      let { communityList } = mainLayout;
      yield put({
        type: 'getList', payload: {
          page: 1,
          rows: 10,
          community_id: "",
          check_status: "",
          entry_at:"",
          income_end:"",
          income_start:"",
        }
      });
      yield put({
        type: 'concat',
        payload: {
          is_reset: true,
          communityList: communityList,
          detail: '',
          totals: '',
          visible: false,
          params: {
            page: 1,
            rows: 10,
            community_id: "",
            check_status: "",
            entry_at: "",
            income_end: "",
            income_start: "",
          }
        }
      });
    },
    *getList({ payload }, { call, put, select }) {
      const params = yield select(state => state.VerificationModel.params);
      const newParams = Object.assign(params, payload);
      const { data, code } = yield call(billIncomeReviewList, payload);
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: {
            list: data ? data.list : [],
            totals: data.totals,
            params: newParams
          }
        });
      }
    },
    *incomeConfirmInfo({ payload }, { call, put, select }) {
      const { data, code } = yield call(gatheringRecordShow, payload);
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: {
            detail: data 
          }
        });
      }
    },
    *billIncomeConfirm({ payload }, { call, put, select }) {
      const params = yield select(state => state.VerificationModel.params);
      const { code } = yield call(billIncomeConfirm, payload);
      if (code == 20000) {
        message.destroy();
        message.success('操作成功');
        yield put({
          type: 'getList',
          payload: params
        })
        yield put({
          type: 'concat',
          payload: {
            params: params
          }
        });
      }
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, search }) => {
        if (pathname === '/verification') {
          dispatch({ type: 'init' });
        }
      });
    }
  },
};
