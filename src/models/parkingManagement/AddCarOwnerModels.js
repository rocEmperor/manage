import { message } from 'antd';
import CarEquipManagementService from '../../services/CarEquipManagementService';
import queryString from 'query-string';

export default {
  namespace: 'AddCarOwner',
  state: {
    lots: [],
    arrData:[{
      key:1,
      name:'',
    }],
    key: 1,
    addVisible:true,
    typeOption: [],
    tradingOption: [],
    groupOption: [],
    buildingOption:[],
    unitOption:[],
    roomOption:[],
    lotsOption:[],
    typeVisible:false,
    totals: '',
    id: '',
    info: "",
    group:"",
    building:"",
    show: false,
    params: {
      page: 1,
      rows: 10,
      community_id: sessionStorage.getItem("communityId")
    },
  },
  reducers: {
    concat(state, { payload }) {
      return { ...state, ...payload };
    }
  },
  effects: {
    *init({ payload }, { call, put }) {
      yield put({
        type: 'concat',
        payload: {
          params: {
            page: 1,
            rows: 10,
            community_id: sessionStorage.getItem("communityId")
          },
        }
      });
      yield put({ type: 'getAddTradingType' });
      yield put({ type: 'getAddOwnerType' });  
      yield put({ type: 'getGroup', payload: { community_id: sessionStorage.getItem("communityId") } });
      yield put({ type: 'getLots', payload: { community_id: sessionStorage.getItem("communityId") } });
    },
    *getAddOwnerType({ payload }, { call, put }) {
      const { data, code } = yield call(CarEquipManagementService.OwnerType, payload);
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: {
            typeOption: data.types
          }
        });
      }
    },
    *carOwnerView({ payload }, { call, put }) {
      const { data, code } = yield call(CarEquipManagementService.carOwnerView, payload);
      let arr = [];
      data.plate.map((value, index) =>{
        arr.push({
          name:value,
          key:index,
        })
      });
      if(data.tran_type.id==2){
        yield put({
          type: 'concat',
          payload: {
            typeVisible: true,
          }
        });
      }
      if(data.plate.length >= 3){
        yield put({
          type: 'concat',
          payload: {
            addVisible: false,
          }
        });
      }
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: {
            info: data,
            arrData: arr
          }
        });
      }
    },
    *getLots({ payload }, { call, put }) {
      const { data, code } = yield call(CarEquipManagementService.Addlots, payload);
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: {
            lotsOption: data
          }
        });
      }
    },
    *getAddTradingType({ payload }, { call, put }) {
      const { data, code } = yield call(CarEquipManagementService.TradingType, payload);
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: {
            tradingOption: data.types
          }
        });
      }
    },
    // groups
    *getGroup({ payload }, { call, put }) {
      const { data } = yield call(CarEquipManagementService.group, payload);
      yield put({
        type: 'concat',
        payload: {
          groupOption: data,
        }
      })
    },
    // building
    *buildingList({ payload }, { call, put }) {
      const { data } = yield call(CarEquipManagementService.building, payload);
      yield put({
        type: 'concat',
        payload: {
          buildingOption: data,
        }
      })
    },
    // units
    *unitList({ payload }, { call, put }) {
      const { data } = yield call(CarEquipManagementService.unit, payload);
      yield put({
        type: 'concat',
        payload: {
          unitOption: data,
        }
      })
    },
    // rooms
    *roomList({ payload }, { call, put }) {
      const { data } = yield call(CarEquipManagementService.room, payload);
      yield put({
        type: 'concat',
        payload: {
          roomOption: data,
        }
      })
    },
    // AddSubmit
    *AddSubmit({ payload }, { call, put }) {
      const { code } = yield call(CarEquipManagementService.AddSubmit, payload);
      if (code == 20000) {
        message.success("新增成功！");
        setTimeout(() => {
          history.go(-1);
        }, 2000)
      }
    },
    // editUser
    *EditUser({ payload }, { call, put }) {
      const { code } = yield call(CarEquipManagementService.editUser, payload);
      if (code == 20000) {
        message.success("编辑成功！");
        setTimeout(() => {
          history.go(-1);
        }, 2000)
      }
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, search }) => {
        let query = queryString.parse(search);
        if (pathname === '/addCarOwner') {
          if (query.id) {
            dispatch({type: 'init', payload: {id: query.id}});
            dispatch({type: 'carOwnerView',payload:{id:query.id}});
            dispatch({type: 'concat',payload: {id: query.id,info:''}});
          } else {
            dispatch({type: 'init', payload: {}});
            dispatch({type: 'concat',payload: {id: '',info:'', arrData:[{
              key:1,
              name:'',
            }],addVisible: true}});
          }
        }
      });
    }
  }
}