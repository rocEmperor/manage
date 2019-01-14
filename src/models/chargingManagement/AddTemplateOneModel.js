import ChargingManagementService from './../../services/ChargingManagementService';
import { message } from 'antd';
const { templateAdd,templateEdit,templateShow } = ChargingManagementService;
import queryString from 'query-string';

export default {
  namespace: 'AddTemplateOneModel',
  state: {
    loading: false,
    info: '',
  },
  reducers: {
    concat(state, { payload }) {
      return { ...state, ...payload };
    }
  },
  effects: {
    *init({ payload }, { call, put }) {
      
    },
    *info({ payload }, { call, put }) {
      const { data, code } = yield call(templateShow, payload);
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: {
            info: data,
          }
        });
      }
    },
    *templateAdd({ payload, callback, err }, { call, put }) {
      const { data,code } = yield call(templateAdd, payload);
      if (code == 20000) {
        message.success("新增成功！");
        callback && callback(data);
      }
    },
    *templateEdit({ payload, callback, err }, { call, put }) {
      const { data,code } = yield call(templateEdit, payload);
      if (code == 20000) {
        message.success("编辑成功！");
        callback && callback(data);
      }
    },
    
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, search }) => {
        if (pathname === '/addTemplateOne') {
          let query = queryString.parse(search);
          if (query.id) {
            dispatch({ type: 'info', payload: { id: query.id} });
          } else {
            dispatch({ type: 'concat', payload: { info: '' } });
          }
        }
      });
    }
  },
};
