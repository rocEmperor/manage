import { message } from 'antd';
import CommunityManagementService from './../../services/CommunityManagementService';
const { labelList, labelAdd, labelEdit, labelDelete, labelModelType } = CommunityManagementService;

export default {
  namespace: 'TagsModel',
  state: {
    list: [],
    is_reset: false,
    totals: '',
    info: "",
    labelType:[],
    params: {
      page: 1,
      rows: 10,
      name: "",
      label_type:"",
    }
  },
  reducers: {
    concat(state, { payload }) {
      return { ...state, ...payload };
    }
  },
  effects: {
    *init({ payload }, { call, put }) {
      yield put({
        type: 'getList', payload: {
          page: 1,
          rows: 10,
          community_id: sessionStorage.getItem("communityId"),
          name: "",
          label_type:"",
        }
      });
      yield put({
        type: 'concat',
        payload: {
          is_reset: true,
          info:"",
          params: {
            page: 1,
            rows: 10,
            community_id: sessionStorage.getItem("communityId"),
            name: "",
            label_type:"",
          }
        }
      });
      yield put({ type: 'labelType' });
    },
    *getList({ payload }, { call, put, select }) {
      const params = yield select(state => state.TagsModel.params);
      const newParams = Object.assign(params, payload);
      const { data, code } = yield call(labelList, payload);
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: {
            list: data ? data.list : [],
            totals: data.totals,
            params: newParams
          }
        });
      }
    },
    *labelType({ payload }, { call, put, select }) {
      const params = yield select(state => state.TagsModel.params);
      const newParams = Object.assign(params, payload);
      const { data, code } = yield call(labelModelType, payload);
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: {
            labelType: data ? data.list : [],
            params: newParams
          }
        });
      }
    },
    *labelAdd({ payload }, { call, put, select }) {
      const params = yield select(state => state.TagsModel.params);
      const { code } = yield call(labelAdd, payload);
      if (code == 20000) {
        message.success('新增成功');
        yield put({
          type: 'getList',
          payload: params
        })
        yield put({
          type: 'concat',
          payload: {
            params: params,
            visible: false,
            info: '',
          }
        });
      }
    },
    *labelEdit({ payload }, { call, put, select }) {
      const params = yield select(state => state.TagsModel.params);
      const { code } = yield call(labelEdit, payload);
      if (code == 20000) {
        message.success('编辑成功');
        yield put({
          type: 'getList',
          payload: params
        })
        yield put({
          type: 'concat',
          payload: {
            visible: false,
            info: '',
            params: params
          }
        });
      }
    },
    *labelDelete({ payload }, { call, put, select }) {
      const params = yield select(state => state.TagsModel.params);
      const { code } = yield call(labelDelete, payload);
      if (code == 20000) {
        message.success('删除成功');
        yield put({
          type: 'getList',
          payload: params
        })
        yield put({
          type: 'concat',
          payload: {
            params: params
          }
        });
      }
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, search }) => {
        if (pathname === '/tags') {
          dispatch({ type: 'init' });
        }
      });
    }
  },
};
