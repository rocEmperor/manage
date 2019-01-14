import { message } from 'antd';
import queryString from 'query-string';
import CarEquipManagementService from '../../services/CarEquipManagementService';
import { getCommunityId } from '../../utils/util';

export default {
  namespace: 'CarportManagementAddEdit',
  state: {
    community_id: '',
    id: '',
    detail: {},
    groupData: [],
    buildingData: [],
    unitData: [],
    roomData: [],
    lotOption: [],
    lotAreaOption: [],
    typeOption: [],
    statusOption: [],
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
      yield put({ type: 'getGroups', payload: { community_id } });
      yield put({ type: 'getLotListAll', payload: { community_id } });
      yield put({ type: 'getCarportTypes', payload: { community_id } });
      yield put({ type: 'getCarportStatus', payload: { community_id } });
    },
    *getGroups({ payload }, { call, put, select }) {
      const { code, data } = yield call(CarEquipManagementService.getGroups, payload);
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: {
            groupData: data,
            buildingData: [],
            unitData: [],
            roomData: [],
          }
        });
      }
    },
    *getBuildings({ payload }, { call, put, select }) {
      const { code, data } = yield call(CarEquipManagementService.getBuildings, payload);
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: {
            buildingData: data,
            unitData: [],
            roomData: [],
          }
        });
      }
    },
    *getUnits({ payload }, { call, put, select }) {
      const { code, data } = yield call(CarEquipManagementService.getUnits, payload);
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: {
            unitData: data,
            roomData: [],
          }
        });
      }
    },
    *getRooms({ payload }, { call, put, select }) {
      const { code, data } = yield call(CarEquipManagementService.getRooms, payload);
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: {
            roomData: data
          }
        });
      }
    },
    *getLotListAll({ payload }, { call, put }) {
      const { data, code } = yield call(CarEquipManagementService.lotListAll, payload);
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: {
            lotOption: data
          }
        });
      }
    },
    *getLotAreaList({ payload }, { call, put }) {
      const { data, code } = yield call(CarEquipManagementService.lotAreaList, payload);
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: {
            lotAreaOption: data
          }
        });
      }
    },
    *getCarportTypes({ payload }, { call, put }) {
      const { data, code } = yield call(CarEquipManagementService.CarportTypes, payload);
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: {
            typeOption: data.types
          }
        });
      }
    },
    *getCarportStatus({ payload }, { call, put }) {
      const { data, code } = yield call(CarEquipManagementService.CarportStatus, payload);
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: {
            statusOption: data.types
          }
        });
      }
    },
    *getCarportDetail({ payload }, { call, put, select }) {
      const { code, data } = yield call(CarEquipManagementService.carportDetail, payload);
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: {
            detail: data
          }
        });
        yield put({
          type: 'getLotAreaList',
          payload: {
            lot_id: data.lot_id,
            community_id: getCommunityId()
          }
        })
        if(data.group){
          yield put({
            type: 'getBuildings',
            payload: {
              group: data.group,
              community_id: getCommunityId()
            }
          })
          yield put({
            type: 'getUnits',
            payload: {
              group: data.group,
              building: data.building,
              community_id: getCommunityId()
            }
          })
          yield put({
            type: 'getRooms',
            payload: {
              group: data.group,
              building: data.building,
              unit: data.unit,
              community_id: getCommunityId()
            }
          })
        }
        
      }
    },
    *getCarportAdd({ payload }, { call, put, select }) {
      const { code } = yield call(CarEquipManagementService.carportAdd, payload);
      if (code == 20000) {
        message.success('新增成功！');
        setTimeout(() => {
          location.href = "#/carportManagement";
        }, 1000)
      }
    },
    *getCarportEdit({ payload }, { call, put, select }) {
      const { code } = yield call(CarEquipManagementService.carportEdit, payload);
      if (code == 20000) {
        message.success('编辑成功！');
        setTimeout(() => {
          location.href = "#/carportManagement";
        }, 1000)
      }
    }

  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, search }) => {
        const query = queryString.parse(search);
        if (pathname === '/carportManagementAdd') {
          initData();
        } else if (pathname === '/carportManagementEdit') {
          initData();
          if (query.id) {
            dispatch({ type: 'getCarportDetail', payload: { id: query.id, community_id: sessionStorage.getItem("communityId") } });
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
