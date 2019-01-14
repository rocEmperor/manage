import PatrolManagementService from '../../../services/PatrolManagementService';

export default {
  namespace: 'PatrolData',
  state: {
    community_id: sessionStorage.getItem("communityId"),
    users: [],
    totals: {},
    piedata: [],
    time: [{
      value: "近7天"
    }, {
      value: "近30天"
    }, {
      value: "近1年"
    }],
    cycleActive1: "0",
    cycleActive2: "0"
  },
  reducers: {
    concat(state, { payload }) {
      return { ...state, ...payload };
    }
  },
  effects: {
    *init({ payload }, { call, put, select }) {
      const community_id = sessionStorage.getItem("communityId");
      yield put({
        type: 'getReport', payload: {
          community_id,
          type: 1
        }
      });
      yield put({
        type: 'getReportRank', payload: {
          community_id,
          type: 1
        }
      });
      yield put({
        type: 'concat',
        payload: {
          cycleActive1: "0",
          cycleActive2: "0",
          community_id: community_id,
        }
      });
    },
    *getReport({ payload }, { call, put, select }) {
      const { data, code } = yield call(PatrolManagementService.report, payload);
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: {
            users: data.users,
            totals: data.totals,
          }
        });
      }
    },
    *getReportRank({ payload }, { call, put, select }) {
      const { data, code } = yield call(PatrolManagementService.reportRank, payload);
      if (code == 20000) {
        const piedata = [];
        data.list.map(item => {
          piedata.push({
            name: item.name,
            value: item.error_num.toString(),
          })
        });
        yield put({
          type: 'concat',
          payload: {
            list: data.list,
            piedata
          }
        });
      }
    }
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, search }) => {
        if (pathname === '/patrolData') {
          dispatch({ type: 'init' });
        }
      });
    }
  },
};
