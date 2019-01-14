import ChargingManagementService from '../../services/ChargingManagementService';
const { templateList,templateDelete } = ChargingManagementService;
import { message } from 'antd';

export default {
  namespace: 'TemplateManagementModel',
  state: {
    params:{
      name:'',
      type:'',
      community_id: sessionStorage.getItem("communityId"),
      rows: 10,
      page: 1,
    },
    list:[],
    totals:'',
    is_reset:false,
  },
  reducers: {
    concat(state, { payload }) {
      return { ...state, ...payload };
    }
  },
  effects: {
    *init({ payload }, { call, put, select }) {
      const params = {
        name: '',
        type: '',
        rows: 10,
        page: 1,
        community_id: sessionStorage.getItem("communityId"),
      }
      yield put({
        type: 'concat',
        payload: {
          is_reset:true,
        }
      });
      yield put({
        type: 'getTemplateList', payload: params
      });
    },
    *getTemplateList({ payload }, { call, put, select }) {
      const params = yield select(state => state.TemplateManagementModel.params);
      const newParams = Object.assign(params, payload);
      const { data, code } = yield call(templateList, payload);
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: {
            list:data.list,
            totals:data.totals,
            params: newParams,
          }
        });
      }
    },
    *templateDelete({ payload,callback }, { call, put, select }) {
      const { code } = yield call(templateDelete, payload);
      if (code == 20000) {
        message.success('删除成功');
        callback && callback();
      }
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, search }) => {
        if (pathname === '/printTemplate') {
          dispatch({ type: 'init' });
        }
      });
    }
  },
};
