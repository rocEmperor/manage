import { message } from 'antd';
import queryString from 'query-string';
import VoteService from '../../services/VoteService';

export default {
  namespace: 'EditShowResultModel',
  state: {
    sending:true,
    vote_id: '',
    loading: false,
    data: {},
    content: '',
    discount_content: ''
  },
  reducers: {
    concat (stata, { payload }) {
      return { ...stata, ...payload }
    }
  },
  effects: {
    *init ({ payload }, { call, put, select }) {
      let { query } = payload;
      yield put({
        type: 'concat',
        payload: {
          vote_id: query.vote_id
        }
      });
      let EditShowResultModel = yield select(state => state.EditShowResultModel);
      let ID = EditShowResultModel.vote_id;
      yield put({
        type: 'showResultView',
        payload: { vote_id: ID }
      });
    },
    *submit ({ payload, values }, { call, put, select }) {
      let EditShowResultModel = yield select(state => state.EditShowResultModel);
      let { discount_content, vote_id } = EditShowResultModel;
      yield put({type: 'concat', payload: payload});
      let content = '';
      // 如果没进行编辑，内容还是取原来的值，如果进行了编辑，取编辑后的值
      let pattern = '<p><br></p>';
      discount_content = discount_content.replace(new RegExp(pattern), ''); // 去除编辑器默认的标签
      content = discount_content;
      if(!(/(\w+)|([\u4e00-\u9fa5]+)/g).test(discount_content.replace(/(<\/?[^>]*>)|(&nbsp;)/g, ''))){
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
          result_content: content,
          result_title: values.title,
          vote_id: vote_id
        }
      })
    },
    *showResultView ({ payload }, { call, put, select }) {
      let defaultParam = {};
      payload = Object.assign({}, defaultParam, payload);
      yield put({
        type: 'concat',
        payload: { loading: true }
      });
      const { data, code } = yield call(VoteService.showResultViewReq, payload);
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: {
            loading: false,
            data: data,
            content: data.result_content
          }
        })
      }
    },
    *voteAddShowResult ({ payload }, { call, put, select }) {
      let defaultParam = {};
      payload = Object.assign({}, defaultParam, payload);
      yield put({
        type: 'concat',
        payload: {
          loading: true
        }
      });
      const { code } = yield call(VoteService.voteAddShowResultReq, payload);
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: { loading: true }
        });
        message.success('编辑成功！');
        let EditShowResultModel = yield select(state => state.EditShowResultModel);
        setTimeout(() => {
          location.href = `#/ShowResultView?vote_id=${EditShowResultModel.vote_id}`;
        }, 1000)
      }
    }
  },
  subscriptions: {
    setup ({ dispatch, history }) {
      return history.listen(({ pathname, search }) => {
        let query = queryString.parse(search);
        if (pathname === '/editShowResult') {
          dispatch({
            type: 'init',
            payload: { query: query }
          })
        }
      })
    }
  }
}
