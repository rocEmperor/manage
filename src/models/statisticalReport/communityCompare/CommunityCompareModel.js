import StatisticalReportService from '../../../services/StatisticalReportService';

export default {
  namespace: 'CommunityCompare',
  state: {
    basic: {},
    amountsScale: {},
    totalsScale: {},
    billList: [],
  },
  reducers: {
    concat(state, { payload }) {
      return { ...state, ...payload };
    }
  },
  effects: {
    *init({ payload }, { call, put, select }) {
      yield put({
        type: 'getCommsInfo', payload: {}
      });
      yield put({
        type: 'getBillList', payload: {}
      });
      yield put({
        type: 'getAmountsScale', payload: {}
      });
    },
    *getCommsInfo({ payload }, { call, put, select }) {
      const { data, code } = yield call(StatisticalReportService.commsInfo, payload);
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: {
            basic: data
          }
        });
      }
    },
    *getBillList({ payload }, { call, put, select }) {
      const { data, code } = yield call(StatisticalReportService.billList, payload);
      if (code == 20000) {
        let dateNow = new Date();
        let year = dateNow.getFullYear();
        let month = dateNow.getMonth() + 1;
        yield put({
          type: 'getTotalsScale', payload: {
            cost_type: data["0"] ? data["0"].id : "",
            paid_at: year + '-' + month
          }
        });
        yield put({
          type: 'concat',
          payload: {
            billList: data
          }
        });
      }
    },
    *getAmountsScale({ payload }, { call, put, select }) {
      const { data, code } = yield call(StatisticalReportService.amountsScale, payload);
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: {
            amountsScale: data
          }
        });

      }
    },
    *getTotalsScale({ payload }, { call, put, select }) {
      const { data, code } = yield call(StatisticalReportService.totalsScale, payload);
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: {
            totalsScale: data,
          }
        });
      }
    }
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, search }) => {
        if (pathname === '/communityCompare') {
          dispatch({ type: 'init' });
        }
      });
    }
  },
};