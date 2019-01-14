import { message } from 'antd';
import DeviceInspectService from '../../services/DeviceInspectService';
const initialState = {
  is_reset:false,
  params: {
    page: 1,
    rows: 10,
    community_id: sessionStorage.getItem("communityId"),
    head_name: '',
    point_id:'',
    line_id:''
  },
  list: [],
  paginationTotal: '',
  points:[],
  lines:[]
};
export default {
  namespace: 'InspectLineManagement',
  state: {...initialState},
  reducers: {
    concat(state, { payload }) {
      return { ...state, ...payload };
    }
  },
  effects: {
    *init({ payload }, { call, put, select }) {
      yield put({type: 'concat', payload: {...initialState}});
      let InspectLineManagement = yield select(state => state.InspectLineManagement);
      let { params } = InspectLineManagement;
      params.community_id = sessionStorage.getItem("communityId");
      yield put({
        type: 'concat', payload: {
          is_reset:true,
          params: params,
        }
      });
      yield put({
        type: 'getLineList', payload: {
          page: 1,
          rows: 10,
          head_name: '',
          point_id: '',
          line_id:''
        }
      });
      yield put({
        type: 'pointsDropDown',
        payload: {
          community_id: sessionStorage.getItem("communityId")
        }
      })
      yield put({
        type: 'lineDropDown',
        payload: {
          community_id: sessionStorage.getItem("communityId")
        }
      })
    },
    *pointsDropDown({ payload }, { call, put, select }) {
      const { data, code } = yield call(DeviceInspectService.pointsDropDown, payload);
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: {
            points: data?data:[]
          }
        });
      }
    },
    *lineDropDown({ payload }, { call, put, select }) {
      const { data,code } = yield call(DeviceInspectService.lineDropDown, payload);
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: {
            lines:data?data.list:[]
          }
        });
      }
    },
    *getLineList({ payload }, { call, put, select }) {
      const params = yield select(state => state.InspectLineManagement.params);
      const newParams = Object.assign(params, payload);
      const { data, code } = yield call(DeviceInspectService.getLineList, params);
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
    *getLineDelete({ payload }, { call, put, select }) {
      const { code } = yield call(DeviceInspectService.lineDelete, payload);
      if (code == 20000) {
        message.success('删除成功！');
        yield put({
          type: 'getLineList', payload: {
            page: 1,
            rows: 10,
            head_name: '',
            point_id:'',
            line_id:''
          }
        });
      }
    }
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, search }) => {
        if (pathname === '/inspectLineManagement') {
          dispatch({ type: 'init' });
        }
      });
    }
  },
};
