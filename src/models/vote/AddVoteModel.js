import { message } from 'antd';
import VoteService from '../../services/VoteService';
let initState = {
  problems:[
    {
      option_type: 1,
      options: [
        {
          title: '',
          image_url: '',
          option_desc: '',
          isUpload: true
        },{
          title: '',
          image_url: '',
          option_desc: '',
          isUpload:true,
        }
      ],
      title: '',
      show: 'block'
    }
  ],
  type: 1,
  previewVisible: false,
  previewImage: '',
  result: true,
  visible: false,
  permission: 1,
  selectedRows: [],
  selectedRowKeys: [],
  loading: false,
  data: {},
  files: undefined,
  imageFileList: []
}
export default {
  namespace: 'AddVoteModel',
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
      });
      yield put({type: 'voteGetComm'});
    },
    *voteGetComm ({ payload }, { call, put, select }) {
      let defaultParam = {}
      payload = Object.assign({}, defaultParam, payload);
      yield put({type: 'concat', payload: {loading: true}})
      const { data, code } = yield call(VoteService.voteGetCommList, payload);
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
    *voteAdd ({ payload }, { call, put, select }) {
      const { code } = yield call(VoteService.voteAddReq, payload);
      if (code == 20000) {
        message.success('新增成功');
        window.location.href = '#vote';
      }
    }
  },
  subscriptions: {
    setup ({ dispatch, history }) {
      return history.listen(({ pathname }) => {
        if (pathname === '/addVote') {
          dispatch({ type: 'init' });
        }
      })
    }
  }
}
