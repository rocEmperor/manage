import queryString from 'query-string';
import rentalHouseManagementService from '../../services/rentalHouseManagementService';
export default {
  namespace: 'ViewOrderRoomModel',
  state: {
    previewVisible: false,
    previewImage: '',
    detailInfo: ''
  },
  reducers: {
    concat (state, { payload }) {
      return { ...state, ...payload }
    }
  },
  effects: {
    *init ({ payload }, { call, put, select }) {
      const { data, code } = yield call(rentalHouseManagementService.rentReservePropertyShow, payload);
      if (code === 20000) {
        yield put({
          type: 'concat',
          payload: {
            detailInfo: data
          }
        })
      }
    }
  },
  subscriptions: {
    setup ({ dispatch, history }) {
      return history.listen(({ pathname, search }) => {
        let query = queryString.parse(search);
        if (pathname === '/viewOrderRoom') {
          dispatch({type: 'init', payload: {reserve_id: query.id}})
        }
      })
    }
  }
}
