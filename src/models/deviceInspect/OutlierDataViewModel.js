import queryString from 'query-string';
import DeviceInspectService from '../../services/DeviceInspectService'
export default {
  namespace: 'OutlierDataViewModel',
  state: {
    previewVisible: false,
    previewImage: '',
    detailInfo: {},
    images: []
  },
  reducers: {
    concat (state, { payload }) {
      return {...state, ...payload};
    }
  },
  effects: {
    *init ({ payload }, { call, put, select }) {
      const { data } = yield call(DeviceInspectService.outlierDataView, payload);
      yield put({
        type: 'concat',
        payload: {detailInfo: data,images:data.image_list}
      })
    }
  },
  subscriptions: {
    setup ({ dispatch, history }) {
      return history.listen (({ pathname, search }) => {
        let query = queryString.parse(search)
        if (pathname === '/outlierDataView') {
          dispatch({type: 'init', payload: {id: query.id, community_id: sessionStorage.getItem("communityId")}})
        }
      })
    }
  }
}
