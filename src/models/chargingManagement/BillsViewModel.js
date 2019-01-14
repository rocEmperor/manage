import chargingManagement from '../../services/ChargingManagementService';
import queryString from 'query-string';

export default {
  namespace: 'BillsViewModel',
  state: {
    roomData: [],
    total: '',
    dataList: [],
    reportData: [],
    loading: false
  },
  reducers: {
    concat (state, { payload }) {
      return { ...state, ...payload }
    }
  },
  effects: {
    *init ({ payload }, { call, put, select }) {
      let { query } = payload;
      let layout = yield select(state => state.MainLayout);
      if (layout.communityId) {
        yield put({
          type: 'getDetails',
          payload: {
            room_id: query.id,
            year: (query.year === 'undefined' || query.year == '') ? '' : query.year,
            costList: (query.costList === 'undefined' || query.costList == '') ? [] : (query.costList?(query.costList).split(','):[])
          }
        })
      }
    },
    *getDetails ({ payload }, { call, put, select }) {
      let defaultParam = {};
      payload = Object.assign({}, defaultParam, payload);
      yield put({type: 'concat', payload: {loading: true}});
      const { data, code } = yield call(chargingManagement.billViewList, payload);
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: {
            roomData: data.roomData,
            reportData: data.reportData,
            dataList: data.dataList,
            total: data.totals,
            loading: false
          }
        })
      }
    }
  },
  subscriptions: {
    setup ({ dispatch, history }) {
      return history.listen(({ pathname, search }) => {
        let query = queryString.parse(search);
        if (pathname === '/billsView') {
          dispatch({
            type: 'init',
            payload: { query: query }
          })
        }
      })
    }
  }
}
