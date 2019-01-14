import { message } from 'antd';
import rentalHouseManagementService from '../../services/rentalHouseManagementService';
import { download } from '../../utils/util';
const initialState = {
  settle_time_start: '',
  settle_time_end: '',
  is_reset:false,
  params:{
    page: 1,
    rows: 10,
    community_id: '',
    bill_order_no: '',
    group: '',
    building: '',
    unit: '',
    room: '',
    settle_time_start: '',
    settle_time_end: ''
  },
  query: {
    community_id: sessionStorage.getItem("communityId"),
    group: '',
    building: '',
    unit: '',
  },
  list: [],
  totals: '',
  groupData: [],
  buildingData: [],
  unitData: [],
  roomData: [],
  totalMoney: '',
  loading: false
};
export default {
  namespace: 'RentalIncomeModel',
  state: {...initialState},
  reducers: {
    concat(state, { payload }) {
      return { ...state, ...payload };
    }
  },
  effects: {
    *init ({ payload }, { call, put, select }) {
      yield put({type: 'concat', payload: {...initialState}});
      let RentalIncome = yield select(state => state.RentalIncomeModel);
      let { query, params } = RentalIncome;
      query.community_id = sessionStorage.getItem("communityId");
      params.community_id = sessionStorage.getItem("communityId");
      yield put({
        type: 'concat',
        payload: {
          is_reset:true,
          query: query,
          params: params
        }
      });
      const communityList = yield select(state => state.MainLayout.communityList);
      yield put({
        type: 'concat',
        payload: {
          buildingData: [],
          unitData: [],
          roomData: [],
          is_reset:true,
          communityList: communityList,
          params: {
            community_id: sessionStorage.getItem("communityId"),
            page: 1,
            rows: 10,
            bill_order_no: '',
            group: '',
            building: '',
            unit: '',
            room: '',
            settle_time_start: '',
            settle_time_end: ''
          }
        }
      });
      const layout = yield select(state => state.MainLayout);
      if (layout.communityId) {
        yield put({
          type: 'getIncomPropertyList',
          payload: {
            community_id: layout.communityId,
            page: 1,
            rows: 10,
            bill_order_no: '',
            group: '',
            building: '',
            unit: '',
            room: '',
            settle_time_start: '',
            settle_time_end: ''
          }
        });
        // yield put({
        //   type: 'getGroupList',
        //   payload: {community_id: layout.communityId}
        // })
      }
    },
    *getIncomPropertyList({ payload }, { call, put, select }) {
      let defaultParam = { page: 1, rows: 10 };
      payload = Object.assign({}, defaultParam, payload);
      yield put({ type: 'concat', payload: { loading: true } });
      const { data, code } = yield call(rentalHouseManagementService.incomPropertyList, payload);
      if (code === 20000) {
        yield put({
          type: 'concat',
          payload: {
            list: data.list,
            totals: data.totals,
            totalMoney: data.totalMoney,
            loading: false
          }
        })
      }
    },
    *getBuildingList({ payload }, { call, put, select }) {
      let defaultParam = {}
      payload = Object.assign({}, defaultParam, payload);
      const { data, code } = yield call(rentalHouseManagementService.buildingList, payload);
      if (code === 20000) {
        yield put({
          type: 'concat',
          payload: {
            buildingData: data
          }
        })
      }
    },
    *getUnitList({ payload }, { call, put, select }) {
      let defaultParam = {}
      payload = Object.assign({}, defaultParam, payload);
      const { data, code } = yield call(rentalHouseManagementService.Units, payload);
      if (code === 20000) {
        yield put({
          type: 'concat',
          payload: {
            unitData: data
          }
        })
      }
    },
    *getRoomList({ payload }, { call, put, select }) {
      let defaultParam = {}
      payload = Object.assign({}, defaultParam, payload);
      const { data, code } = yield call(rentalHouseManagementService.roomList, payload);
      if (code === 20000) {
        yield put({
          type: 'concat',
          payload: {
            roomData: data
          }
        })
      }
    },
    *getGroupList({ payload }, { call, put, select }) {
      let defaultParam = {}
      payload = Object.assign({}, defaultParam, payload);
      const { data, code } = yield call(rentalHouseManagementService.groupsList, payload);
      if (code === 20000) {
        yield put({
          type: 'concat',
          payload: {
            groupData: data
          }
        })
      }
    },
    *propertyExport({ payload }, { call, put }) {
      const { data, code } = yield call(rentalHouseManagementService.propertyExport, payload);
      if (code == 20000) {
        download(data.down_url);
        message.success('导出成功！');
      }
    }
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname }) => {
        if (pathname === '/rentalIncome') {
          dispatch({ type: 'init' })
        }
      })
    }
  }
}
