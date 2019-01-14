import { message } from 'antd';
import queryString from 'query-string';
import VoteService from '../../services/VoteService';
let initState = {
  sending:true,
  vote_id: '',
  loading: false,
  data: {},
  content: '',
  discount_content: ''
};
export default {
  namespace: 'AddShowResultModel',
  state: { ...initState },
  reducers: {
    concat (state, { payload }) {
      return { ...state, ...payload }
    }
  },
  effects: {
    *init ({ payload }, { call, put, select }) {
      yield put({
        type: 'concat',
        payload: { ...initState }
      })
      let { query } = payload;
      yield put({
        type: 'concat',
        payload: {vote_id: query.vote_id}
      })
    },
    *voteAddShowResult ({ payload }, { call, put, select }) {
      let defaultParam = {};
      payload = Object.assign({}, defaultParam, payload);
      yield put({type: 'concat', payload: { loading: true }});
      const { code } = yield call(VoteService.voteAddShowResultReq, payload);
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: {loading: true}
        });
        message.success('新增成功！');
        let AddShowResultModel = yield select(state => state.AddShowResultModel)
        setTimeout(() => {
          location.href = `#/ShowResultView?vote_id=${AddShowResultModel.vote_id}`;
        }, 1000)
      }
    },
    *submit ({ payload, values }, { call, put, select }) {
      yield put({
        type: 'concat',
        payload: payload
      });
      // 如果没进行编辑，内容还是取原来的值，如果进行了编辑，取编辑后的值
      let pattern = '<p><br></p>';
      let AddShowResultModel = yield select(state => state.AddShowResultModel);
      let { discount_content, vote_id } = AddShowResultModel;
      discount_content = discount_content.replace(new RegExp(pattern), ""); //去除编辑器默认的标签
      if(!(/(\w+)|([\u4e00-\u9fa5]+)/g).test(discount_content.replace(/(<\/?[^>]*>)|(&nbsp;)/g,''))){
        message.destroy();
        yield put({
          type: 'concat',
          payload: {
            loading: false,
            content: ''
          }
        });
        message.error("内容不能为空");
        return false
      }
      yield put({
        type: 'voteAddShowResult',
        payload: {
          result_content: discount_content,
          result_title: values.title,
          vote_id: vote_id
        }
      })
    }
  },
  subscriptions: {
    setup ({ dispatch, history }) {
      return history.listen(({ pathname, search }) => {
        let query = queryString.parse(search)
        if (pathname === '/addShowResult') {
          dispatch({
            type: 'init',
            payload: {query: query}
          })
        }
      })
    }
  }
}
