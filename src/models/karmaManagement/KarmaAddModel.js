import { message } from 'antd';
import queryString from 'query-string';
import { getCommunityId } from '../../utils/util';
import KarmaManagementService from '../../services/KarmaManagementService';
export default {
  namespace: 'KarmaAddModel',
  state: {
    date: '',
    date1: '',
    loading: false,
    info: '',
    groupData: []
  },
  reducers: {
    concat (state, { payload }) {
      return { ...state, ...payload }
    }
  },
  effects: {
    *init ({ payload }, { call, put, select }) {
      yield put({type: 'concat', payload: { info: '' }})
      const id = getCommunityId();
      yield put({
        type: 'groupList',
        payload: {community_id: id}
      });
      if(payload.hasOwnProperty('queryId')){
        yield put({
          type: 'karmaInfo',
          payload: {id: payload.queryId}
        })
      }
    },
    *karmaAdd ({ payload }, { call, put, select }) {
      let defaultParam = {};
      payload = Object.assign({}, defaultParam, payload);
      yield put({ type: 'concat', payload: { loading: true } });
      const { code } = yield call(KarmaManagementService.karmaAddReq, payload);
      if (code === 20000) {
        yield put({ type: 'concat', payload: { loading: false } })
        message.success("新增成功！")
        setTimeout(() => {
          window.location.href = "#/karmaManagement";
        }, 1000)
      }
    },
    *karmaEdit ({ payload }, { call, put, select }) {
      let defaultParam = {};
      payload = Object.assign({}, defaultParam, payload);
      yield put({ type: 'concat', payload: { loading: true } });
      const { code } = yield call(KarmaManagementService.karmaEditReq, payload);
      if (code === 20000) {
        yield put({ type: 'concat', payload: { loading: false } })
        message.success("编辑成功！");
        setTimeout(() => {
          window.location.href = "#/karmaManagement";
        }, 1000)
      }
    },
    *groupList ({ payload }, { call, put, select }) {
      let defaultParam = {}
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
    },
    *karmaInfo ({ payload }, { call, put, select }) {
      let defaultParam = {};
      payload = Object.assign({}, defaultParam, payload);
      yield put({type: 'concat', payload: {loading: true}});
      const { data, code } =yield call(KarmaManagementService.getKarmaInfo, payload);
      if (code === 20000) {
        yield put({
          type: 'concat',
          payload: {
            loading: false,
            info: data,
            date1: data.change_at,
            date: data.found_at
          }
        })
      }
    }
  },
  subscriptions: {
    setup ({ dispatch, history }) {
      return history.listen(({ pathname, search }) => {
        let query = queryString.parse(search);
        if (pathname === '/karmaAdd') {
          if (query.id) {
            dispatch({type: 'init', payload: {queryId: query.id}})
          } else {
            dispatch({type: 'init', payload: {}})
          }
        }
      })
    }
  }
}
