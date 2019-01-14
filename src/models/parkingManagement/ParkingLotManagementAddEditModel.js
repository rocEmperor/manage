import { message } from 'antd';
import queryString from 'query-string';
import CarEquipManagementService from '../../services/CarEquipManagementService';
import { getCommunityId } from '../../utils/util';

export default {
  namespace: 'ParkingLotManagementAddEdit',
  state: {
    community_id: '',
    detail: {},
    treeData: [],
    id: ''
  },
  reducers: {
    concat(state, { payload }) {
      return { ...state, ...payload };
    }
  },
  effects: {
    *init({ payload }, { call, put, select }) {
      const community_id = getCommunityId();
      yield put({ type: 'concat', payload: { community_id } });
      yield put({ type: 'lotListAll', payload: { community_id } });
    },
    *lotListAll({ payload }, { call, put, select }) {
      const { code, data } = yield call(CarEquipManagementService.parkList, payload);
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: {
            treeData: data?data.list:[]
          }
        });
      }
    },
    *getLotAreaDetail({ payload }, { call, put, select }) {
      const { code, data } = yield call(CarEquipManagementService.lotAreaDetail, payload);
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: {
            detail: data
          }
        });
      }
    },
    *getLotAreaAdd({ payload }, { call, put, select }) {
      const { code } = yield call(CarEquipManagementService.lotAreaAdd, payload);
      if (code == 20000) {
        message.success('新增成功！');
        setTimeout(() => {
          location.href = "#/parkingLotManagement";
        }, 1000)
      }
    },
    *getLotAreaEdit({ payload }, { call, put, select }) {
      const { code } = yield call(CarEquipManagementService.lotAreaEdit, payload);
      if (code == 20000) {
        message.success('编辑成功！');
        setTimeout(() => {
          location.href = "#/parkingLotManagement";
        }, 1000)
      }
    }
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, search }) => {
        const query = queryString.parse(search);
        if (pathname === '/parkingLotManagementAdd') {
          initData();
        } else if (pathname === '/parkingLotManagementEdit') {
          initData();
          if (query.id) {
            dispatch({ type: 'getLotAreaDetail', payload: { id: query.id, community_id: sessionStorage.getItem("communityId") } });
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
