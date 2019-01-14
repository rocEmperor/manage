import queryString from 'query-string';
import rentalHouseManagementService from '../../services/rentalHouseManagementService'
export default {
  namespace: 'HouseSourceDetailsModel',
  state: {
    previewVisible: false,
    previewImage: '',
    detailInfo: {}
  },
  reducers: {
    concat (state, { payload }) {
      return {...state, ...payload};
    }
  },
  effects: {
    *init ({ payload }, { call, put, select }) {
      const { data } = yield call(rentalHouseManagementService.detailsList, payload);
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
        if (pathname === '/houseSourceDetails') {
          dispatch({type: 'init', payload: {rent_id: query.id}})
        }
      })
    }
  }
}
