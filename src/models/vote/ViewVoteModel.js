import { message } from 'antd';
import queryString from 'query-string';
import VoteService from '../../services/VoteService';
export default {
  namespace: 'ViewVoteModel',
  state: {
    vote_id: '',
    visible: false,
    previewImage: '',
    previewVisible: false,
    type: 1,
    flag: 'online_data_show',
    end_time: '',
    show_at: '',
    loading: false,
    data: [],
    data_show: {},
    data_count: {},
    max: 0
  },
  reducers: {
    concat (state, { payload }) {
      return { ...state, ...payload }
    }
  },
  effects: {
    *init ({ payload }, { call, put, select }) {
      let { query } = payload;
      yield put({type: 'concat', payload: {vote_id: query.id}});
      let ViewVoteModel = yield select(state => state.ViewVoteModel);
      yield put({
        type: 'voteShow',
        payload: {
          vote_id: ViewVoteModel.vote_id
        }
      })
    },
    *voteShow ({ payload }, { call, put, select }) {
      let defaultParam = {};
      payload = Object.assign({}, defaultParam, payload);
      yield put({type: 'concat', payload: {loading: true}});
      const { data, code } = yield call(VoteService.voteShowList, payload);
      if (code == 20000) {
        let max = 0;
        data.data_show.online_data_show.map((item, index) => {
          if (item.options.length > max) {
            max = item.options.length;
          }
        });
        yield put({
          type: 'concat',
          payload: {
            loading: false,
            data: data,
            data_show: data.data_show,
            data_count: data.data_count,
            max: +max + 1
          }
        })
      }
    },
    *voteEndtime ({ payload }, { call, put, select }) {
      let ViewVoteModel = yield select(state => state.ViewVoteModel);
      let type = payload.type;
      delete payload.type
      let defaultParam = {};
      let ajax = ['voteEndtime', 'voteShowtime'];
      payload = Object.assign({}, defaultParam, payload);
      if (ajax[+type - 1] === 'voteEndtime') {
        const { code } = yield call(VoteService.voteEndtimeReq, payload);
        if (code == 20000) {
          message.success('修改成功');
          let ID = ViewVoteModel.vote_id;
          yield put({
            type: 'voteShow',
            payload: {vote_id: ID}
          })
        }
      } else if (ajax[+type - 1] === 'voteShowtime') {
        const { code } = yield call(VoteService.voteShowtimeReq, payload)
        if (code == 20000) {
          message.success('修改成功');
          let ID = ViewVoteModel.vote_id;
          yield put({
            type: 'voteShow',
            payload: {vote_id: ID}
          })
        }
      }
    },
    *downFiles({ payload, callback }, { call, put, select }) {
      const { data, code } = yield call(VoteService.voteDataExport, payload);
      if(code == 20000){
        yield put({
          type: 'concat',
          payload: {
            
          }
        })
      }
      callback&&callback(data.down_url);
    },
  },
  subscriptions: {
    setup ({ dispatch, history }) {
      return history.listen(({ pathname, search }) => {
        let query = queryString.parse(search);
        if (pathname === '/viewVote') {
          dispatch({type: 'init',payload: {query: query}})
        }
      })
    }
  }
}
