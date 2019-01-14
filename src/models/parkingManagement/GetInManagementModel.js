import CarEquipManagementService from '../../services/CarEquipManagementService';
const initialState = {
  list: [],
  typeOption: [],
  totals: '',
  id: '',
  is_reset: false,
  params: {
    page: 1,
    rows: 10,
    community_id: sessionStorage.getItem("communityId"),
    car_num: "",
    in_time_start: "",
    in_time_end: "",
    type: "",
    name: ""
  },
};
export default {
  namespace: 'GetInManagement',
  state: { ...initialState },
  reducers: {
    concat(state, { payload }) {
      return { ...state, ...payload };
    }
  },
  effects: {
    *init({ payload }, { call, put, select }) {
      yield put({ type: 'concat', payload: { ...initialState } });
      let GetInManagement = yield select(state => state.GetInManagement);

      const myDate = new Date();
      const year = myDate.getFullYear();
      const month = myDate.getMonth()+1;
      const getDate = myDate.getDate();
      const time = year + '-' + month + '-' + getDate;

      let { params } = GetInManagement;
      params.community_id = sessionStorage.getItem("communityId");
      let query = {
        is_reset: true,
        params: {
          page: 1,
          rows: 10,
          community_id: sessionStorage.getItem("communityId"),
          car_num: "",
          in_time_start: time,
          in_time_end: time,
          type: "",
          name: ""
        },
      }
      yield put({ type: 'getInList', payload: query.params });
      yield put({
        type: 'concat', payload: {
          is_reset: true,
          params: params
        }
      });
      yield put({ type: 'getInType' });
    },
    *getInList({ payload }, { call, put, select }) {
      const params = yield select(state => state.GetInManagement.params);
      const newParams = Object.assign(params, payload);
      const { data, code } = yield call(CarEquipManagementService.InList, params);
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
    *getInType({ payload }, { call, put }) {
      const { data, code } = yield call(CarEquipManagementService.InType, payload);
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
        if (pathname === '/getInManagement') {
          dispatch({ type: 'init' });
        }
      });
    }
  }
}