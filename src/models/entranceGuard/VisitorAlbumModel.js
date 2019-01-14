// import { message } from 'antd';
import EntranceGuardService from './../../services/EntranceGuardService.js';

const initialState = {
  list: [],
  totals: '',
  is_reset: false,
  id: '',
  previewVisible: false,
  previewImage: '',
  userType:[],
  params: {
    page: 1,
    rows: 10,
    community_id: sessionStorage.getItem("communityId"),
    group: "",
    building: "",
    unit: "",
    room: "",
    call_type: "",
    user_type: "",
    user_name: "",
    start_time: "",
    end_time: "",
    device_name: ""
  }
}
export default {
  namespace: 'VisitorAlbum',
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
            call_type: "",
            user_type: "",
            user_name: "",
            start_time: "",
            end_time: "",
            device_name: ""
          }
        }
      })
      yield put({
        type: 'visitorAlbumList',
        payload: {
          page: 1,
          rows: 10,
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
    *visitorAlbumList({ payload }, { call, put, select }) {
      const params = yield select(state => state.VisitorAlbum.params);
      const newParams = Object.assign(params, payload);
      const { data, code } = yield call(EntranceGuardService.visitorAlbumList, params);
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
    *userType({ payload }, { call, put, select }) {
      const { data, code } = yield call(EntranceGuardService.userTypes, payload);
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
        if (pathname === '/visitorAlbum') {
          dispatch({ type: 'init' });
        }
      })
    }
  }
}
