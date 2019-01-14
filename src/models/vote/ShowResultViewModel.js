import { message } from 'antd';
import queryString from 'query-string';
import VoteService from '../../services/VoteService';
export default {
  namespace: 'ShowResultViewModel',
  state: {
    loading: false,
    data: {}
  },
  reducers: {
    concat (state, { payload }) {
      return { ...state, ...payload }
    }
  },
  effects: {
    *init ({ payload }, { call, put, select }) {
      let ID = payload.query.vote_id;
      yield put({
        type: 'getDetails',
        payload: {vote_id: ID}
      })
    },
    *getDetails ({ payload }, { call, put, select }) {
      let defaultParam = {};
      payload = Object.assign({}, defaultParam, payload);
      yield put({type: 'concat', payload: { loading: true }});
      const { data, code } = yield call(VoteService.showResultViewReq, payload);
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: {
            loading: false,
            data: data
          }
        })
      }
    },
    *voteDeleteResult ({ payload }, { call, put, select }) {
      let defaultParam = {};
      payload = Object.assign({}, defaultParam, payload);
      const { code } = yield call(VoteService.voteDeleteResultReq, payload);
      if (code == 20000) {
        message.success('删除成功！');
        setTimeout(() => {
          location.href = `#/ViewVote?id=${payload.vote_id}`;
        },1000)
      }
    }
  },
  subscriptions: {
    setup ({ dispatch, history }) {
      return history.listen(({ pathname, search }) => {
        let query = queryString.parse(search);
        if (pathname === '/showResultView') {
          dispatch({
            type: 'init',
            payload: { query: query }
          })
        }
      })
    }
  }
}
