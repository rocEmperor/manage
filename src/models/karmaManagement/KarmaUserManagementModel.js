import { message } from 'antd';
import KarmaManagementService from '../../services/KarmaManagementService';
const initialState = {
  is_reset:false,
  params:{
    page: 1,
    rows: 10,
    community_name: '',
    name: '',
    social_name: '',
    community_id: ''
  },
  query: {
    community_id: sessionStorage.getItem("communityId"),
    group: '',
  },
  list: [],
  totals: '',
  groupData: [],
  socialList: [],
  loading: false
};
export default {
  namespace: 'KarmaUserManagementModel',
  state: {...initialState},
  reducers: {
    concat (state, { payload }) {
      return { ...state, ...payload }
    }
  },
  effects: {
    *init ({ payload }, { call, put, select }) {
      yield put({type: 'concat', payload: {...initialState}});
      let KarmaUserManagement = yield select(state => state.KarmaUserManagementModel);
      let { params,query } = KarmaUserManagement;
      params.community_id = sessionStorage.getItem("communityId");
      query.community_id = sessionStorage.getItem("communityId");
      yield put({
        type: 'concat',
        payload: {
          is_reset:true,
          query: query,
          params: params
        }
      });
      if (params.community_id) {
        yield put({type: 'socialList', payload: {community_id: params.community_id}});
        yield put({type: 'karmaUserList', payload: {
          page: 1,
          rows: 10,
          community_name: '',
          name: '',
          social_name: '',
          community_id: params.community_id
        }});
        yield put({type: 'groupList', payload: {community_id: params.community_id}});
      }
    },
    *karmaUserList ({ payload }, { call, put, select }) {
      let defaultParam = { page: 1, rows: 10 };
      payload = Object.assign({}, defaultParam, payload);
      yield put({type: 'concat', payload: {loading: true}})
      const { data, code } = yield call(KarmaManagementService.getKarmaUserList, payload);
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
    *karmaUserDelete ({ payload }, { call, put, select }) {
      let layout = yield select(state => state.MainLayout);
      let defaultParam = {};
      payload = Object.assign({}, defaultParam, payload);
      const { code } = yield call(KarmaManagementService.karmaUserDeleteReq, payload);
      if (code === 20000) {
        message.success('删除成功!');
        let query = {
          community_id: layout.communityId,
          page: 1,
          row: 10
        };
        yield put({
          type: 'karmaUserList',
          payload: query
        })
      }
    },
    *socialList ({ payload }, { call, put, select }) {
      let defaultParam = { page: 1, rows: 10 };
      payload = Object.assign({}, defaultParam, payload);
      const { data, code } = yield call(KarmaManagementService.getSocialList, payload);
      if (code === 20000) {
        yield put({
          type: 'concat',
          payload: { socialList: data.list }
        })
      }
    },
    *groupList ({ payload }, { call, put, select }) {
      let defaultParam = {}
      payload = Object.assign({}, defaultParam, payload);
      const { data, code } = yield call(KarmaManagementService.getGroupsList, payload);
      if (code === 20000) {
        yield put({
          type: 'concat',
          payload: {
            groupData: data
          }
        })
      }
    }
  },
  subscriptions: {
    setup ({ dispatch, history }) {
      return history.listen(({ pathname }) => {
        if (pathname === '/karmaUserManagement') {
          dispatch({type: 'init'})
        }
      })
    }
  }
}
