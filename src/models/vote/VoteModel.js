import { message } from 'antd';
import VoteService from '../../services/VoteService';
export default {
  namespace: 'VoteModel',
  state: {
    current: 1,
    loading: false,
    data: [],
    total: {}
  },
  reducers: {
    concat (state, { payload }) {
      return { ...state, ...payload }
    }
  },
  effects: {
    *init ({ payload }, { call, put, select }) {
      let MainLyout = yield select(state => state.MainLayout);
      if (MainLyout.communityId) {
        yield put({
          type: 'getList',
          payload: {community_id: MainLyout.communityId}
        });
        yield put({
          type: 'concat',
          payload: {current: 1}
        })
      }
    },
    *getList ({ payload }, { call, put, select }) {
      let defaultParam = { page:1, rows:10 };
      payload = Object.assign({}, defaultParam, payload);
      yield put({
        type: 'concat',
        payload: { loading: true }
      });
      const { data, code } = yield call(VoteService.getListReq, payload);
      if (code === 20000) {
        yield put({
          type: 'concat',
          payload: {
            loading: false,
            data: data.list,
            total: data.totals
          }
        });
      }
    },
    *voteOnOff ({ payload }, { call, put, select }) {
      let VoteModel = yield select(state => state.VoteModel);
      let MainLayout = yield select(state => state.MainLayout);
      let parm = { community_id: MainLayout.communityId, page: VoteModel.current }
      let api = ['voteDeleteReq', 'voteOnOffReq'];
      let type = payload.type;
      delete payload.type;
      let defaultParam = {};
      payload = Object.assign({}, defaultParam, payload);
      if (api[type - 1] === 'voteDeleteReq') {
        const { code } = yield call(VoteService.voteDeleteReq, payload);
        if (code === 20000) {
          message.success('删除成功');
          yield put({type: 'getList', payload: parm})
        }
      } else if (api[type - 1] === 'voteOnOffReq') {
        const { code } = yield call(VoteService.voteOnOffReq, payload);
        if (code === 20000) {
          // message.success('上架成功');
          yield put({type: 'getList', payload: parm})
        }
      }
    }
  },
  subscriptions: {
    setup ({ dispatch, history }) {
      return history.listen(({ pathname }) => {
        if (pathname === '/vote') {
          dispatch({ type: 'init' })
        }
      })
    }
  }
}
