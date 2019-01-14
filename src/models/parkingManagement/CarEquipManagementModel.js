import CarEquipManagementService from '../../services/CarEquipManagementService';
const initialState = {
  list: [],
  typeOption: [],
  totals: '',
  id: '',
  is_reset:false,
  params: {
    page: 1,
    rows: 10,
    community_id: sessionStorage.getItem("communityId"),
    type: '',
    address: '',
    device_id: ''
  },
};
export default {
  namespace: 'CarEquipManagement',
  state: {...initialState},
  reducers: {
    concat(state, { payload }) {
      return { ...state, ...payload };
    }
  },
  effects: {
    *init({ payload }, { call, put,select }) {
      yield put({type: 'concat', payload: {...initialState}});
      let CarEquipManagement = yield select(state => state.CarEquipManagement);
      let { params } = CarEquipManagement;
      params.community_id = sessionStorage.getItem("communityId");
      yield put({ type: 'concat', payload:{
        is_reset:true,
        params: params
      } });
      yield put({ type: 'getCarEquipList', payload:{
        page: 1,
        rows: 10,
        community_id: sessionStorage.getItem("communityId"),
        type: '',
        address: '',
        device_id: ''
      }});
      yield put({ type: 'getCarEquipType' });
    },
    *getCarEquipList({ payload }, { call, put, select }) {
      const params = yield select(state => state.CarEquipManagement.params);
      const newParams = Object.assign(params, payload);
      const { data, code } = yield call(CarEquipManagementService.carEquipList, params);
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: {
            list: data ? data.list : [],
            totals: parseInt(data.totals),
            params: newParams
          }
        });
      }
    },
    *getCarEquipType({ payload }, { call, put }) {
      const { data, code } = yield call(CarEquipManagementService.carEquipType, payload);
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: {
            typeOption: data.types
          }
        });
      }
    }
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, search }) => {
        if (pathname === '/carEquipManagement') {
          dispatch({ type: 'init' });
        }
      });
    }
  }
}