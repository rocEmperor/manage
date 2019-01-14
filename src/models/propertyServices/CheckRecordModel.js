import PropertyServices from './../../services/PropertyServices.js';
import { message } from 'antd';
import { download } from '../../utils/util';

const initialState = {
  list: [],
  totals: '',
  is_reset: false,
  params: {
    page: 1,
    rows: 10,
    community_id: sessionStorage.getItem("communityId"),
    group: "",
    building: "",
    unit: "",
    room: "",
    name: '',
  }
}
export default {
  namespace: 'CheckRecordModel',
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
        type: 'checkList',
        payload: {
          page: 1,
          rows: 10,
          community_id: sessionStorage.getItem("communityId"),
        }
      })
    },
    *checkList({ payload }, { call, put, select }) {
      const params = yield select(state => state.CheckRecordModel.params);
      const newParams = Object.assign(params, payload);
      const { data, code } = yield call(PropertyServices.checkList, params);
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: {
            list: data ? data.list : [],
            totals: parseInt(data.totals),
            params: newParams
          }
        })
      }
    },
    *export({ payload }, { call, put, select }) {
      const { data, code } = yield call(PropertyServices.exportCheckList, payload);
      if (code == 20000) {
        download(data.down_url);
        message.success('导出成功！');
      }
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, search }) => {
        if (pathname === '/checkRecord') {
          dispatch({ type: 'init' });
        }
      })
    }
  }
}
