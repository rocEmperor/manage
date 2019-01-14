import StatisticalReportService from '../../../services/StatisticalReportService';

export default {
  namespace: 'SingleCommunity',
  state: {
    basic: {},
    totalScale: {},
    billList: [],
    amountScale: {},
    community_id: sessionStorage.getItem("communityId"),
  },
  reducers: {
    concat(state, { payload }) {
      return { ...state, ...payload };
    }
  },
  effects: {
    *init({ payload }, { call, put, select }) {
      yield put({
        type: 'concat',
        payload: {
          community_id: sessionStorage.getItem("communityId"),
        }
      });
      yield put({
        type: 'getBillList', payload: {}
      });
      yield put({
        type: 'getCommInfo', payload: {
          community_id: sessionStorage.getItem("communityId")
        }
      });
      yield put({
        type: 'getAmountScale', payload: {
          community_id: sessionStorage.getItem("communityId")
        }
      });
    },
    *getTotalScale({ payload }, { call, put, select }) {
      const { data, code } = yield call(StatisticalReportService.totalScale, payload);
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: {
            totalScale: data,
          }
        });

      }
    },
    *getCommInfo({ payload }, { call, put, select }) {
      const { data, code } = yield call(StatisticalReportService.commInfo, payload);
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
      const community_id = sessionStorage.getItem("communityId");
      const { data, code } = yield call(StatisticalReportService.billList, payload);
      if (code == 20000) {
        yield put({
          type: 'getTotalScale', payload: {
            community_id: community_id,
            cost_type: data["0"] ? data["0"].id : ""
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
    *getAmountScale({ payload }, { call, put, select }) {
      const { data, code } = yield call(StatisticalReportService.amountScale, payload);
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: {
            amountScale: data
          }
        });

      }
    }
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, search }) => {
        if (pathname === '/singleCommunity') {
          dispatch({ type: 'init' });
        }
      });
    }
  },
};
