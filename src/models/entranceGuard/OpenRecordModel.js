// import { message } from 'antd';
import EntranceGuardService from './../../services/EntranceGuardService.js';

const initialState = {
  list: [],
  totals: '',
  is_reset: false,
  id: '',
  openType:[],
  userType:[],
  previewVisible: false,
  previewImage: '',
  params: {
    page: 1,
    rows: 10,
    community_id: sessionStorage.getItem("communityId"),
    group: "",
    building: "",
    unit: "",
    room: "",
    open_type: "",
    user_type: "",
    device_name: "",
    user_phone: "",
    card_no: "",
    start_time:"",
    end_time:""
  }
}
export default {
  namespace: 'OpenRecord',
  state: { ...initialState },
  reducers: {
    concat(state, { payload }) {
      return {
        ...state,
        ...payload
      };
    }
  },
  effects: {
    *init({ payload }, { call, put }) {
      yield put({ type: 'concat', payload: { ...initialState } });
      yield put({
        type: 'concat',
        payload: {
          is_reset: true,
          params: {
            page: 1,
            rows: 10,
            community_id: sessionStorage.getItem("communityId"),
            group: "",
            building: "",
            unit: "",
            room: "",
            open_type: "",
            user_type: "",
            device_name: "",
            user_phone: "",
            card_no: "",
            start_time:"",
            end_time:""
          }
        }
      })
      yield put({
        type: 'openRecordList',
        payload: {
          page: 1,
          rows: 10,
          community_id: sessionStorage.getItem("communityId")
        }
      })
      yield put({
        type: 'openType',
        payload: {
          community_id: sessionStorage.getItem("communityId")
        }
      })
      yield put({
        type: 'userType',
        payload: {
          community_id: sessionStorage.getItem("communityId")
        }
      })
    },
    *openRecordList({ payload }, { call, put, select }) {
      const params = yield select(state => state.OpenRecord.params);
      const newParams = Object.assign(params, payload);
      const { data, code } = yield call(EntranceGuardService.openRecordList, params);
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: {
            list: data ? data.list : [],
            totals: data.totals,
            params: newParams
          }
        })
      }
    },
    *openType({ payload }, { call, put, select }) {
      const { data, code } = yield call(EntranceGuardService.openType, payload);
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: {
            openType: data
          }
        })
      }
    },
    *userType({ payload }, { call, put, select }) {
      const { data, code } = yield call(EntranceGuardService.userType, payload);
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: {
            userType: data
          }
        })
      }
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, search }) => {
        if (pathname === '/openRecord') {
          dispatch({ type: 'init' });
        }
      })
    }
  }
}
