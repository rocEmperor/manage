import { message } from 'antd';
import queryString from 'query-string';
import EquipmentManagementService from '../../../services/EquipmentManagementService';
import { getCommunityId } from '../../../utils/util';

export default {
  namespace: 'DeviceClassifyAddEdit',
  state: {
    community_id: '',
    detail: {},
    treeData: []
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
        payload: { community_id }
      });
      yield put({
        type: 'getDeviceCategoryDropDown', payload: { community_id,type: 1 }
      });
    },
    *getDeviceCategoryDropDown({ payload }, { call, put, select }) {
      const { code, data } = yield call(EquipmentManagementService.deviceCategoryDropDown, payload);
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: {
            treeData: data
          }
        });
      }
    },
    *getDeviceCategoryShow({ payload }, { call, put, select }) {
      const { code, data } = yield call(EquipmentManagementService.deviceCategoryShow, payload);
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: {
            detail: data
          }
        });
      }
    },
    *getDeviceCategoryAdd({ payload }, { call, put, select }) {
      const { code } = yield call(EquipmentManagementService.deviceCategoryAdd, payload);
      if (code == 20000) {
        message.success('新增成功！');
        setTimeout(() => {
          location.href = "#/deviceClassify";
        }, 1000)
      }
    },
    *getDeviceCategoryEdit({ payload }, { call, put, select }) {
      const { code } = yield call(EquipmentManagementService.deviceCategoryEdit, payload);
      if (code == 20000) {
        message.success('编辑成功！');
        setTimeout(() => {
          location.href = "#/deviceClassify";
        }, 1000)
      }
    }
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, search }) => {
        const query = queryString.parse(search);
        if (pathname === '/deviceClassifyAdd') {
          initData();
        } else if (pathname === '/deviceClassifyEdit') {
          initData();
          if (query.id) {
            dispatch({ type: 'getDeviceCategoryShow', payload: { id: query.id, community_id: sessionStorage.getItem("communityId") } });
          }
        }
        function initData() {
          dispatch({ type: 'init' });
          dispatch({
            type: 'concat', payload: {
              id: query.id,
              detail: {}
            }
          })
        }
      });
    }
  },
};
