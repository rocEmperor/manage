import { message } from 'antd';
import EquipmentManagementService from '../../../services/EquipmentManagementService';
import { getCommunityId } from '../../../utils/util';

export default {
  namespace: 'DeviceClassify',
  state: {
    params: {
      page: 1,
      rows: 10,
      community_id: ''
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
      const community_id = getCommunityId();
      yield put({
        type: 'concat',
        payload: {
          params: {
            page: 1,
            rows: 10,
            community_id: community_id
          },
          list: [],
          paginationTotal: ""
        }
      });
      yield put({
        type: 'getDeviceCategoryList', payload: {
          page: 1,
          rows: 10,
        }
      });
    },
    *getDeviceCategoryList({ payload }, { call, put, select }) {
      const params = yield select(state => state.DeviceClassify.params);
      const newParams = Object.assign(params, payload);
      const { data, code } = yield call(EquipmentManagementService.deviceCategoryList, params);
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: {
            list: data.list,
            paginationTotal: data.totals,
            params: newParams
          }
        });
      }
    },
    *getDeviceCategoryDelete({ payload }, { call, put, select }) {
      const { code } = yield call(EquipmentManagementService.deviceCategoryDelete, payload);
      if (code == 20000) {
        message.success('删除成功！');
        yield put({
          type: 'getDeviceCategoryList', payload: {
            page: 1,
            rows: 10
          }
        });
      }
    }
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, search }) => {
        if (pathname === '/deviceClassify') {
          dispatch({ type: 'init' });
        }
      });
    }
  },
};
