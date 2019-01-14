import {message} from 'antd';
import queryString from 'query-string';
import CommunityManagementService from './../../services/CommunityManagementService.js';
const { meterReadingEdit, meterReadingView, meterReadingAdd,group,building,unit,room} = CommunityManagementService;


export default {
  namespace: 'DashboardMeterManageAddModel',
  state: {
    id: "",
    info: "",
    groupOption:[],
    buildingOption:[],
    unitOption:[],
    roomOption:[]
  },
  reducers: {
    concat(state, { payload }) {
      return { ...state, ...payload };
    }
  },
  effects: {
    *init({payload}, {call, put}) {
      yield put({type: 'getGroup',payload:{community_id: sessionStorage.getItem('communityId')}});
    },
    //详情
    *getDetail({payload}, {call, put}) {
      const { data } = yield call(meterReadingView, payload);
      yield put({
        type: 'concat',
        payload : {
          info: data,
        }
      })
    },
    // groups
    *getGroup({payload}, {call, put}) {
      const { data } = yield call(group, payload);
      yield put({
        type: 'concat',
        payload : {
          groupOption: data,
        }
      })
    },
    // building
    *buildingList({payload}, {call, put}) {
      const { data } = yield call(building, payload);
      yield put({
        type: 'concat',
        payload : {
          buildingOption: data,
          unitOption:[],
          roomOption:[]
        }
      })
    },
    // units
    *unitList({payload}, {call, put}) {
      const { data } = yield call(unit, payload);
      yield put({
        type: 'concat',
        payload : {
          unitOption: data,
          roomOption:[]
        }
      })
    },
    // rooms
    *roomList({payload}, {call, put}) {
      const { data } = yield call(room, payload);
      yield put({
        type: 'concat',
        payload : {
          roomOption: data,
        }
      })
    },
    // 新增
    *meterReadingAdd({payload, callback, err}, {call, put}) {
      const { code } = yield call(meterReadingAdd, payload);
      if(code == 20000){
        message.success("新增成功！");
        callback && callback();
      } else {
        err && err()
      }
    },
    *meterReadingEdit({payload, callback, err}, {call, put}) {
      const { code } = yield call(meterReadingEdit, payload);
      if(code == 20000){
        message.success("编辑成功！");
        callback && callback();
      } else {
        err && err()
      }
    }
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, search }) => {
        if (pathname === '/dashboardMeterManageAdd') {
          let query = queryString.parse(search);
          if(query.id) {//编辑
            dispatch({type: 'getDetail', payload: {water_meter_id: query.id}});
          }
          dispatch({ type: 'init'});
          dispatch({type: 'concat', payload: {id:query.id, info: ''}});
        }
      });
    }
  }
};
