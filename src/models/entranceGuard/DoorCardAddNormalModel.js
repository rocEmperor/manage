import { message } from 'antd';
import EntranceGuardService from '../../services/EntranceGuardService';
import queryString from 'query-string';
import { getCommunityId } from '../../utils/util';

export default {
  namespace: 'DoorCardAddNormal',
  state: {
    arrData:[{
      key:1,
      name:'',
    }],
    key: 1,
    addVisible:true,
    groupOption: [],
    buildingOption:[],
    unitOption:[],
    roomOption:[],
    carType:[],
    id: '',
    userList:[],
    info: "",
    group:"",
    building:"",
    unit:"",
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
      yield put({ type: 'getGroup', payload: { community_id: sessionStorage.getItem("communityId") } });
      yield put({ type: 'doorCarType', payload: { community_id: sessionStorage.getItem("communityId") } });
    },
    
    *doorCarDetail({ payload }, { call, put }) {
      const { data, code } = yield call(EntranceGuardService.doorCarDetail, payload);
      let arr = [];
      arr.push({
        name:data.card_num,
        key:1,
      })
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: {
            info: data,
            arrData: arr,
            group: data.group,
            building: data.building,
            unit: data.unit,
            room: data.room
          }
        });
        yield put({
          type: 'userList', payload: {
            group: data.group,
            building: data.building,
            unit: data.unit,
            room: data.room,
            community_id: getCommunityId()
          }
        });
        yield put({
          type: 'buildingList',
          payload: {
            group: data.group,
            community_id: getCommunityId()
          }
        })
        yield put({
          type: 'unitList',
          payload: {
            group: data.group,
            building: data.building,
            community_id: getCommunityId()
          }
        })
        yield put({
          type: 'roomList',
          payload: {
            group: data.group,
            building: data.building,
            unit: data.unit,
            community_id: getCommunityId()
          }
        })
      }
    },
    // groups
    *getGroup({ payload }, { call, put }) {
      const { data } = yield call(EntranceGuardService.group, payload);
      yield put({
        type: 'concat',
        payload: {
          groupOption: data,
        }
      })
    },
    // building
    *buildingList({ payload }, { call, put }) {
      const { data } = yield call(EntranceGuardService.building, payload);
      yield put({
        type: 'concat',
        payload: {
          buildingOption: data,
        }
      })
    },
    // units
    *unitList({ payload }, { call, put }) {
      const { data } = yield call(EntranceGuardService.unit, payload);
      yield put({
        type: 'concat',
        payload: {
          unitOption: data,
        }
      })
    },
    // rooms
    *roomList({ payload }, { call, put }) {
      const { data } = yield call(EntranceGuardService.room, payload);
      yield put({
        type: 'concat',
        payload: {
          roomOption: data,
        }
      })
    },
    // 业主列表
    *userList({ payload }, { call, put }) {
      const { data } = yield call(EntranceGuardService.userList, payload);
      yield put({
        type: 'concat',
        payload: {
          userList: data,
        }
      })
    },
    // 门卡类型
    *doorCarType({ payload }, { call, put }) {
      const { data } = yield call(EntranceGuardService.doorCarType, payload);
      yield put({
        type: 'concat',
        payload: {
          carType: data,
        }
      })
    },
    // doorCardAdd
    *doorCardAdd({ payload }, { call, put }) {
      const { code } = yield call(EntranceGuardService.doorCardAdd, payload);
      if (code == 20000) {
        message.success("新增成功！");
        setTimeout(() => {
          history.go(-1);
        }, 2000)
      }
    },
    // doorCardEdit
    *doorCardEdit({ payload }, { call, put }) {
      const { code } = yield call(EntranceGuardService.doorCardEdit, payload);
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
        if (pathname === '/doorCardAddNormal') {
          dispatch({type: 'init', payload: {}});
          if (query.id) {
            dispatch({type: 'doorCarDetail',payload:{id:query.id}});
            dispatch({type: 'concat',payload: {id: query.id,info:''}});
          } else {
            dispatch({type: 'concat',payload: {id: '',info:'', arrData:[{
              key:1,
              name:'',
            }],
            addVisible: true,
            buildingOption:[],
            unitOption:[],
            roomOption:[],
            userList:[]
            }});
          }
        }
      });
    }
  }
}