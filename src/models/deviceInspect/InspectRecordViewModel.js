import queryString from 'query-string';
import DeviceInspectService from '../../services/DeviceInspectService'
export default {
  namespace: 'InspectRecordViewModel',
  state: {
    detailInfo: {},
    list: [],
    previewVisible: false,
    previewImage: '',
    params: {
      page: 1,
      rows: 10,
      community_id: sessionStorage.getItem("communityId")
    }
  },
  reducers: {
    concat (state, { payload }) {
      return {...state, ...payload};
    }
  },
  effects: {
    *init ({ payload }, { call, put, select }) {
      const { data } = yield call(DeviceInspectService.inspectRecordView, payload);
      yield put({
        type: 'concat',
        payload: {
          detailInfo: data
        }
      })
      yield put({
        type: 'inspectRecordViewList',
        payload: {
          page: 1,
          rows: 10,
          id: data.id
        }
      })
      
    },
    *inspectRecordViewList({ payload }, { call, put, select }) {
      const params = {
        page: 1,
        rows: 10,
        community_id: sessionStorage.getItem("communityId"),
      }
      const newParams = Object.assign(params, payload);
      const { data, code } = yield call(DeviceInspectService.inspectRecordViewList, params);
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: {
            list: data.list,
            paginationTotal: data.totals,
            params: newParams
          }
        });
      }
    },
  },
  subscriptions: {
    setup ({ dispatch, history }) {
      return history.listen (({ pathname, search }) => {
        let query = queryString.parse(search)
        if (pathname === '/inspectRecordView') {
          dispatch({type: 'init', payload: {id: query.id,community_id: sessionStorage.getItem("communityId")}})
        }
      })
    }
  }
}
