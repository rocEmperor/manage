import { message } from 'antd';
import SystemSettingsService from '../../../services/SystemSettingsService';
const defaultState = {
  loading: false,
  is_reset:false,
  is_flag:false,
  list: [],
  params: {
    name:"",
    community_id: sessionStorage.getItem("communityId")
  }
}
export default {
  namespace: 'GroupManagement',
  state: { ...defaultState },
  reducers: {
    concat(state, { payload }) {
      return { ...state, ...payload };
    }
  },
  effects: {
    *init({ payload }, { call, put, select }) {
      let query = {
        loading: false,
        is_reset:true,
        is_flag:false,
        params: {
          name:"",
          community_id: sessionStorage.getItem("communityId")
        },
      }
      yield put({ type: 'concat', payload: query });
      yield put({type: 'getGroupManages',payload: query.params});
    },
    *getGroupManages({ payload }, { call, put, select }) {
      yield put({type: 'concat', payload: { loading: true }});
      const params = yield select(state => state.GroupManagement.params);
      const newParams = Object.assign(params, payload);
      const { data, code } = yield call(SystemSettingsService.groupManages, payload);
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: {
            is_flag:true,
            list:data?data.list:[],
            arrId:data?[data.list[0].id]:[],
            loading: false,
            params: newParams
          }
        });
      }
    },
    *getDeleteManage({ payload }, { call, put, select }) {
      const { code } = yield call(SystemSettingsService.deleteManage, payload);
      if (code == 20000) {
        message.success('删除成功！');
        yield put({
          type: 'getGroupManages',
          payload: { page: 1, rows: 10 }
        });
      }
    }
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, search }) => {
        if (pathname === '/groupManagement') {
          dispatch({ type: 'init' });
        }
      });
    }
  },
};
