import CommunityManagementService from './../../services/CommunityManagementService';
import queryString from 'query-string';
const { changerView } = CommunityManagementService;

export default {
  namespace: 'ChangerViewModel',
  state: {
    info:'',
    previewVisible:false,
    previewImage:'',
    btnHide: 'none'
  },
  reducers: {
    concat(state, { payload }) {
      return { ...state, ...payload };
    }
  },
  effects: {
    *info({ payload }, { call, put }) {
      const { data, code } = yield call(changerView, payload);
      if(code == 20000){
        yield put({
          type: 'concat',
          payload: {
            info: data
          }
        });
        if (data.status == 1) {
          yield put({
            type: 'concat',
            payload: {
              btnHide:'block'
            }
          });
        } else {
          yield put({
            type: 'concat',
            payload: {
              btnHide:'none'
            }
          });
        }
      }
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, search }) => {
        const query = queryString.parse(search);
        if (pathname === '/changerView') {
          if(query.id){
            dispatch({ type: 'info', payload:{changer_id:query.id}});
          }
        }
      });
    }
  },
};
