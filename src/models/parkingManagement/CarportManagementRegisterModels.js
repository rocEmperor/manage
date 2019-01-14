import { message } from 'antd';
import queryString from 'query-string';
import CarEquipManagementService from '../../services/CarEquipManagementService';
import { getCommunityId } from '../../utils/util';

export default {
  namespace: 'CarportManagementRegister',
  state: {
    community_id: '',
    id: "",
    detail: {},
    groupData: [],
    buildingData: [],
    unitData: [],
    roomData: [],
    isOwner: 1,
    ownerTypeOption: [],
    name:'',
    tel:''
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
    *getFindOwner({ payload }, { call, put, select }) {/*门禁查找业主信息*/
      const { code, data } = yield call(CarEquipManagementService.findOwner, payload);
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: {
            ownerTypeOption: data
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
      }
    },
    *getCarManageAdd({ payload }, { call, put, select }) {
      const { code } = yield call(CarEquipManagementService.carManageAdd, payload);
      if (code == 20000) {
        message.success('登记成功！');
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
        if (pathname === '/carportManagementRegister') {
          dispatch({
            type: 'concat',
            payload: {
              isOwner: 1,
              name:"",
              tel:"",
            }
          })
          if (query.id) {
            dispatch({ type: 'init' });
            dispatch({ type: 'getCarportDetail', payload: { id: query.id, community_id: sessionStorage.getItem("communityId") } });
            dispatch({
              type: 'concat', payload: {
                id: query.id,
                detail: {}
              }
            })
          }
        }
      });
    }
  },
};
