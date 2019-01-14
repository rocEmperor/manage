import { message } from 'antd';
import EquipmentManagementService from '../../../services/EquipmentManagementService';
import { getCommunityId } from '../../../utils/util';

export default {
  namespace: 'AccidentRecord',
  state: {
    params: {
      page: 1,
      rows: 10,
      community_id: getCommunityId()
    },
    list: [],
    paginationTotal: ""
  },
  reducers: {
    concat(state, { payload }) {
      return { ...state, ...payload };
    }
  },
  effects: {
    *init({ payload }, { call, put, select }) {
      yield put({
        type: 'getAccidentList', payload: {
          page: 1,
          rows: 10,
          community_id: getCommunityId()
        }
      });
    },
    /**
     * 列表
     * @param page
     * @param rows
     * @param community_id
    */
    *getAccidentList({ payload }, { call, put, select }) {
      const params = yield select(state => state.AccidentRecord.params);
      const newParams = Object.assign(params, payload);
      const { data, code } = yield call(EquipmentManagementService.accidentList, params);
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: {
            list: data?data.list:[],
            paginationTotal: data.totals,
            params: newParams
          }
        });
      }
    },
    *accidentDelete({ payload }, { call, put, select }) {
      const { code } = yield call(EquipmentManagementService.accidentDelete, payload);
      if (code == 20000) {
        message.success('删除成功！');
        yield put({
          type: 'getAccidentList', payload: {
            page: 1,
            rows: 10,
            community_id: getCommunityId()
          }
        });
      }
    },
    *accidentExport({ payload, callback }, { call, put, select }) {
      const { code,data } = yield call(EquipmentManagementService.accidentExport, payload);
      if (code == 20000) {
        message.success('导出成功！');
        yield put({
          type: 'getAccidentList', payload: {
            page: 1,
            rows: 10,
            community_id: getCommunityId()
          }
        });
        callback&&callback(data.down_url);
      }
      
    }
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, search }) => {
        if (pathname === '/accidentRecord') {
          dispatch({ type: 'init' });
        }
      });
    }
  },
};
