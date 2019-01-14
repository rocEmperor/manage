import { message } from 'antd';
import KarmaManagementService from '../../services/KarmaManagementService';
const initialState = {
  params:{
    page: 1,
    rows: 10,
    social_id: '',
    community_id: ''
  },
  is_reset:false,
  list: [],
  totals: '',
  groupData: [],
  socialList: [],
  loading: false
}
export default {
  namespace: 'KarmaManagementModel',
  state: {...initialState},
  reducers: {
    concat (state, { payload }) {
      return { ...state, ...payload }
    }
  },
  effects: {
    *init ({ payload }, { call, put, select }) {
      yield put({type: 'concat', payload: {...initialState}});
      let KarmaManagement = yield select(state => state.KarmaManagementModel);
      let { params } = KarmaManagement;
      params.community_id = sessionStorage.getItem("communityId");
      yield put({
        type: 'concat',
        payload: {
          is_reset:true,
          params: params
        }
      });
      if (params.community_id) {
        yield put({
          type: 'socialList',
          payload: {community_id: params.community_id}
        });
        yield put({
          type: 'karmaList',
          payload: {community_id: params.community_id}
        });
        yield put({
          type: 'groupList',
          payload: {community_id: params.community_id}
        });
      }
    },
    *karmaList ({ payload }, { call, put, select}) {
      let defaultParam = { page: 1, rows: 10 };
      payload = Object.assign({}, defaultParam, payload);
      yield put({type: 'concat', payload: {loading: true}});
      const { data, code } = yield call(KarmaManagementService.getKarmaList, payload);
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
    *karmaDelete ({ payload }, { call, put, select}) {
      let defaultParam = {};
      payload = Object.assign({}, defaultParam, payload);
      const { code } = yield call(KarmaManagementService.karmaDeleteReq, payload);
      if (code === 20000) {
        yield put({ type: 'concat', payload: {} });
        message.success('删除成功!');
        let layout = yield select(state => state.MainLayout);
        let query = { community_id: layout.communityId, page: 1, row: 10};
        yield put({
          type: 'karmaList',
          payload: query
        })
      }
    },
    *socialList ({ payload }, { call, put, select}) {
      let defaultParam = { page: 1, rows: 10 };
      payload = Object.assign({}, defaultParam, payload);
      const { data, code } = yield call(KarmaManagementService.getSocialList, payload);
      if (code === 20000) {
        yield put({
          type: 'concat',
          payload: {
            socialList: data.list
          }
        })
      }
    },
    *groupList ({ payload }, { call, put, select}) {
      let defaultParam = {};
      payload = Object.assign({}, defaultParam, payload);
      const { data, code } = yield call(KarmaManagementService.communityChange, payload);
      if (code === 20000) {
        yield put({
          type: 'concat',
          payload: {
            groupData: data.list
          }
        })
      }
    }
  },
  subscriptions: {
    setup ({ dispatch, history }) {
      return history.listen(({ pathname }) => {
        if (pathname === '/karmaManagement') {
          dispatch({ type: 'init' })
        }
      })
    }
  }
}
