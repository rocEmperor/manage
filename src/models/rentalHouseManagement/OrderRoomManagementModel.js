import { message } from 'antd'
import queryString from 'query-string';
import rentalHouseManagementService from '../../services/rentalHouseManagementService';
const initialState = {
  sign: false,
  reserve_time_start: '',
  reserve_time_end: '',
  id: '',
  is_reset:false,
  statusId:'',
  params:{
    page: 1,
    rows: 10,
    member_name: '',
    member_mobile: '',
    status: '',
    reserve_name: '',
    reserve_mobile: '',
    community_id: '',
    reserve_time_start: '',
    reserve_time_end: ''
  },
  list: [],
  totals: '',
  reserve_status: [],
  detailInfo: '',
  loading: false
};
export default {
  namespace: 'OrderRoomManagementModel',
  state: {...initialState},
  reducers: {
    concat(state, { payload }) {
      return { ...state, ...payload };
    }
  },
  effects: {
    *init({ payload }, { call, put, select }) {
      yield put({type: 'concat', payload: {...initialState}});
      const layout = yield select(state => state.MainLayout);
      let params = yield select(state => state.OrderRoomManagementModel.params);
      params.community_id = layout.communityId;
      yield put({
        type: 'concat',
        payload: {
          params: { ...params }
        }
      })
      yield put({ type: 'getComm', payload: {} });
      if (layout.communityId) {
        if (payload && payload.queryId) {
          yield put({
            type: 'concat',
            payload: {
              is_reset: true,
              params: {
                status: payload.queryId,
                page: 1,
                rows: 10,
                member_name: '',
                member_mobile: '',
                reserve_name: '',
                reserve_mobile: '',
                community_id: '',
                reserve_time_start: '',
                reserve_time_end: ''
              }
            }
          })
          yield put({
            type: 'rentReservePropertyList',
            payload: {
              community_id: layout.communityId,
              status: payload.queryId
            }
          }); // 获取报事报修列表
        } else {
          yield put({ type: 'rentReservePropertyList', payload: { community_id: layout.communityId } }); // 获取报事报修列表
          yield put({
            type: 'concat',
            payload: {
              is_reset: true,
              params: {
                status: '',
                page: 1,
                rows: 10,
                member_name: '',
                member_mobile: '',
                reserve_name: '',
                reserve_mobile: '',
                community_id: '',
                reserve_time_start: '',
                reserve_time_end: ''
              }
            }
          })
        }
      }
    },
    *rentReservePropertyList({ payload }, { call, put, select }) {
      let defaultParam = { page: 1, rows: 10 };
      payload = Object.assign({}, defaultParam, payload);
      yield put({ type: 'concat', payload: { loading: true } })
      const { data, code } = yield call(rentalHouseManagementService.rentReservePropertyList, payload);
      if (code === 20000) {
        yield put({
          type: 'concat',
          payload: {
            list: data.list,
            totals: data.totals,
            loading: false
          }
        })
      }
    },
    *getRentReserveTakeLook({ payload }, { call, put, select }) {
      const layout = yield select(state => state.MainLayout);
      const params = yield select(state => state.OrderRoomManagementModel.params);
      const { code } = yield call(rentalHouseManagementService.rentReserveTakeLook, payload);
      if (code === 20000) {
        yield put({ type: 'concat', payload: {} });
        message.success('标记成功');
        yield put({
          type: 'concat',
          payload: {
            sign: false,
            params: { ...params }
          }
        })
        // form.resetFields(['take_look_note']);
        yield put({
          type: 'rentReservePropertyList',
          payload: {
            community_id: layout.communityId
          }
        })
      }
    },
    *getComm({ payload }, { call, put, select }) {
      const { data, code } = yield call(rentalHouseManagementService.rentReserveGetComm, payload)
      if (code === 20000) {
        yield put({
          type: 'concat',
          payload: {
            reserve_status: data.reserve_status ? data.reserve_status : []
          }
        })
      }
    }
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, search }) => {
        let query = queryString.parse(search);
        if (pathname === '/orderRoomManagement') {
          if (query.id) {
            dispatch({ type: 'concat', payload: { statusId: query.id } });
            dispatch({ type: 'init', payload: { queryId: query.id } })
          } else {
            dispatch({ type: 'init' })
            dispatch({ type: 'concat', payload: { statusId: "" } });
          }
        }
      })
    }
  }
}
