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
    car_num:"",
    out_time_start:"",
    out_time_end:"",
    amount_min:"",
    amount_max:"",
    car_type:""
  },
};
export default {
  namespace: 'GetOutManagement',
  state: {...initialState},
  reducers: {
    concat(state, { payload }) {
      return { ...state, ...payload };
    }
  },
  effects: {
    *init({ payload }, { call, put,select }) {
      yield put({type: 'concat', payload: {...initialState}});
      let GetOutManagement = yield select(state => state.GetOutManagement);
      let { params } = GetOutManagement;
      params.community_id = sessionStorage.getItem("communityId");
      let query = {
        is_reset:true,
        params: {
          page: 1,
          rows: 10,
          community_id: sessionStorage.getItem("communityId"),
          car_num:"",
          out_time_start:"",
          out_time_end:"",
          amount_min:"",
          amount_max:"",
          car_type:""
        },
      }
      yield put({ type: 'getOutList', payload: query.params});
      yield put({ type: 'concat', payload: {
        is_reset:true,
        params: params
      } });
      yield put({ type: 'getOutType' });
    },
    *getOutList({ payload }, { call, put, select }) {
      const params = yield select(state => state.GetOutManagement.params);
      const newParams = Object.assign(params, payload);
      const { data, code } = yield call(CarEquipManagementService.OutList, params);
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
    *getOutType({ payload }, { call, put }) {
      const { data, code } = yield call(CarEquipManagementService.OutType, payload);
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
        if (pathname === '/getOutManagement') {
          dispatch({ type: 'init' });
        }
      });
    }
  }
}