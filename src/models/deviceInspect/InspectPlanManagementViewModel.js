import queryString from 'query-string';
import DeviceInspectService from '../../services/DeviceInspectService'
export default {
  namespace: 'InspectPlanManagementViewModel',
  state: {
    detailInfo: {},
  },
  reducers: {
    concat (state, { payload }) {
      return {...state, ...payload};
    }
  },
  effects: {
    *init ({ payload }, { call, put, select }) {
      const { data } = yield call(DeviceInspectService.planDetail, payload);
      yield put({
        type: 'concat',
        payload: {detailInfo: data}
      })
    }
  },
  subscriptions: {
    setup ({ dispatch, history }) {
      return history.listen (({ pathname, search }) => {
        let query = queryString.parse(search)
        if (pathname === '/inspectPlanManagementView') {
          dispatch({type: 'init', payload: {id: query.id, community_id: sessionStorage.getItem("communityId")}})
        }
      })
    }
  }
}
