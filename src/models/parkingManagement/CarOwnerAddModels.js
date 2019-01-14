import { message } from 'antd';
import queryString from 'query-string';
import CarEquipManagementService from '../../services/CarEquipManagementService';
import { getCommunityId } from '../../utils/util';

export default {
  namespace: 'CarOwnerAdd',
  state: {
    community_id: '',
    id: "",
    detail: {},
    groupData: [],
    buildingData: [],
    unitData: [],
    roomData: [],
    car_port_num:'',
    isOwner: 1,
    ownerTypeOption: [],
    car_port_status: '1',
    flag: false,
    lot_id: '',
    lot_area_id: '',
    show: false,
    list:[],
    group:"",
    building:"",
    unit:"",
    carport_id:'',
    totals:'',
    params: {
      page: 1,
      rows: 10,
      community_id: getCommunityId()
    },
    lotOption: [],
    lotAreaOption: [],
    statusOption:[],
    typeOption:[],
    name:'',
    tel: '',
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
      yield put({ type: 'getCarportStatus', payload: { community_id } });
      yield put({ type: 'getCarportTypes', payload: { community_id } });
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
    *getCarportList({ payload }, { call, put, select }) {
      const params = yield select(state => state.CarOwnerAdd.params);
      const newParams = Object.assign(params, payload);
      const { data, code } = yield call(CarEquipManagementService.CarportList, newParams);
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: {
            list: data ? data.list : [],
            totals: parseInt(data.totals),
            params: newParams
          }
        });
      }
    },
    *getFindOwner({ payload,callback }, { call, put, select }) {/*门禁查找业主信息*/
      const { code, data } = yield call(CarEquipManagementService.findOwner, payload);
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: {
            ownerTypeOption: data,
          }
        });
        callback && callback(data)
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
    *getCarportDetail({ payload }, { call, put, select }) {
      const { code, data } = yield call(CarEquipManagementService.carManageDetail, payload);
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: {
            detail: data,
            isOwner: data.room_type,
            lot_id: data.lot_id,
            lot_area_id: data.lot_area_id,
            car_port_num: data.car_port_num,
            carport_id: data.carport_id,
            group: data.group,
            building: data.building,
            unit: data.unit,
            car_port_status: data.carport_pay_type
          }
        });
        if(data.room_type == 1){
          yield put({
            type: 'getFindOwner',
            payload: {
              group: data.group,
              building: data.building,
              unit: data.unit,
              room: data.room,
              community_id: getCommunityId()
            }
          })
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
        yield put({
          type: 'getLotAreaList',
          payload: {
            lot_id: data.lot_id,
            community_id: getCommunityId()
          }
        })
        
      }
    },
    *getCarManageAdd({ payload }, { call, put, select }) {
      const { code } = yield call(CarEquipManagementService.carManageAdd, payload);
      if (code == 20000) {
        message.success('新增成功！');
        setTimeout(() => {
          location.href = "#/carOwnerManagement";
        }, 1000)
      }
    },
    *getCarManageEdit({ payload }, { call, put, select }) {
      const { code } = yield call(CarEquipManagementService.carManageEdit, payload);
      if (code == 20000) {
        message.success('编辑成功！');
        setTimeout(() => {
          location.href = "#/carOwnerManagement";
        }, 1000)
      }
    }
    

  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, search }) => {
        const query = queryString.parse(search);
        if (pathname === '/carOwnerAdd') {
          dispatch({ type: 'init' });
          dispatch({type: 'concat',payload:{
            detail: {},
            id:"",
            car_port_num:"",
            name:"",
            tel:"",
            isOwner:1,
            lot_id:"",
            lot_area_id:'',
            buildingData:[],
            unitData:[],
            roomData:[],
            ownerTypeOption:[],
            flag: false,
          }})
          if (query.id) {
            dispatch({ type: 'getCarportDetail', payload: { user_carport_id: query.id, community_id: sessionStorage.getItem("communityId") } });
            dispatch({
              type: 'concat', payload: {
                id: query.id,
                detail: {}
              }
            })
          }else{
            dispatch({
              type: 'concat',
              payload: {
                car_port_status:"1",
              }
            })
          }
        }
      });
    }
  },
};
