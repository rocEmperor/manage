import {message} from 'antd';
import CommunityManagementService from './../../services/CommunityManagementService.js';
import queryString from 'query-string';
const { electrictAdd, electrictEdit, electrictShow,group,building,unit,room} = CommunityManagementService;

export default {
  namespace: 'DashboardElectrictyManageAddModel',
  state: {
    community_id:sessionStorage.getItem('communityId'),
    datatime:'',
    id: "",
    info: "",
    group:[],
    building:[],
    unit:[],
    room:[],
    isAdd:true,
  },
  reducers: {
    concat(state, { payload }) {
      return { ...state, ...payload };
    }
  },
  effects:{
    *init({payload}, {call, put,select}) {
      yield put({type: 'getGroup',payload:{community_id: sessionStorage.getItem('communityId')}});
    },
    //详情
    *getDetail({payload}, {call, put}) {
      const { data } = yield call(electrictShow, payload);
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
          group: data,
        }
      })
    },
    // building
    *buildingList({payload}, {call, put}) {
      const { data } = yield call(building, payload);
      yield put({
        type: 'concat',
        payload : {
          building: data,
          unit:[],
          room:[],
        }
      })
    },
    // units
    *unitList({payload}, {call, put}) {
      const { data } = yield call(unit, payload);
      yield put({
        type: 'concat',
        payload : {
          unit: data,
          room:[],
        }
      })
    },
    // rooms
    *roomList({payload}, {call, put}) {
      const { data } = yield call(room, payload);
      yield put({
        type: 'concat',
        payload : {
          room: data,
        }
      })
    },
    // 新增住户
    *electrictReadingAdd({payload, callback, err}, {call, put}) {
      const { code } = yield call(electrictAdd, payload);
      if(code == 20000){
        message.success("新增成功！");
        callback && callback();
      } else {
        err && err()
      }
    },
    *electrictReadingEdit({payload, callback, err}, {call, put}) {
      const { code } = yield call(electrictEdit, payload);
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
        if (pathname === '/dashboardElectrictyManageAdd') {
          let query = queryString.parse(search);
          if(query.id) {//编辑
            dispatch({type: 'concat', payload: {id:query.id, isAdd:false}});
            dispatch({type: 'getDetail', payload: {meter_id:query.id}});
          }
          dispatch({ type: 'init'});
          dispatch({type: 'concat', payload: {id:query.id, info: ''}});
        }
      });
    }
  }
}
