import { message } from 'antd';
import rentalHouseManagementService from "../../services/rentalHouseManagementService";
const initialState = {
  loadingState: true,
  is_reset:false,
  id: '',
  showOrder: false,
  pub_end_time: undefined,
  pub_start_time: undefined,
  params: {
    page: 1,
    rows: 10,
    community_id: '',
    member_name: '',
    mobile: '',
    rent_ref: '',
    status: '',
    group: '',
    building: '',
    unit: '',
    room: '',
    pub_end_time: '',
    pub_start_time: ''
  },
  query: {
    community_id: sessionStorage.getItem("communityId"),
    group: '',
    building: '',
    unit: '',
  },
  list: [],
  totals: '',
  rent_ref: [],
  status: [],
  groupData: [],
  buildingData: [],
  unitData: [],
  roomData: [],
  detailInfo: '',
};
export default {
  namespace: 'HouseSourceManagementModel',
  state: {...initialState},
  reducers: {
    concat(state, { payload }) {
      return { ...state, ...payload }
    }
  },
  effects: {
    *init ({ payload }, { call, put, select }) {
      yield put({type: 'concat', payload: {...initialState}});
      let HouseSourceManagement = yield select(state => state.HouseSourceManagementModel);
      let { query, params } = HouseSourceManagement;
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
          communityList: communityList,
          params: {
            page: 1,
            rows: 10,
            community_id: sessionStorage.getItem("communityId"),
            member_name: '',
            mobile: '',
            rent_ref: '',
            status: '',
            group: '',
            building: '',
            unit: '',
            room: '',
            pub_end_time: '',
            pub_start_time: ''
          },
          query: {
            community_id: sessionStorage.getItem("communityId"),
            group: '',
            building: '',
            unit: '',
          },
        }
      });
      yield put({type: 'getComm', payload: {}});
      yield put({type: 'getList', payload: {
        page: 1,
        rows: 10,
        community_id: sessionStorage.getItem("communityId"),
        member_name: '',
        mobile: '',
        rent_ref: '',
        status: '',
        group: '',
        building: '',
        unit: '',
        room: '',
        pub_end_time: '',
        pub_start_time: ''
      }});
      // yield put({type: 'groupList', payload: {community_id: layout.communityId}})
    },
    *groupList({ payload }, { call, put, select }) {
      const { data, code } = yield call(rentalHouseManagementService.groupsList, payload);
      if (code === 20000) {
        yield put({ type: 'concat', payload: { groupData: data } })
      }
    },
    *getComm({ payload }, { call, put, select }) {
      const { data, code } = yield call(rentalHouseManagementService.commList, payload);
      if (code === 20000) {
        yield put({ type: 'concat', payload: data })
      }
    },
    *getBuildingList({ payload }, { call, put, select }) {
      const { data, code } = yield call(rentalHouseManagementService.buildingList, payload);
      if (code === 20000) {
        yield put({ type: 'concat', payload: { buildingData: data } });
        // 重置默认值
        yield put({
          type: 'concat',
          payload: { unitData: [], roomData: [] }
        })
      }
    },
    *getUnitList({ payload }, { call, put, select }) {
      const { data, code } = yield call(rentalHouseManagementService.Units, payload);
      if (code === 20000) {
        yield put({ type: 'concat', payload: { unitData: data } });
        // 重置默认值
        yield put({
          type: 'concat',
          payload: { roomData: [] }
        })
      }
    },
    *getRoomList({ payload }, { call, put, select }) {
      const { data, code } = yield call(rentalHouseManagementService.roomList, payload);
      if (code === 20000) {
        yield put({ type: 'concat', payload: { roomData: data } });
        // 重置默认值
        yield put({
          type: 'concat',
          payload: {}
        })
      }
    },
    *getList({ payload }, { call, put, select }) {
      yield put({ type: 'concat', payload: { loadingState: true } })
      const { data, code } = yield call(rentalHouseManagementService.list, payload);
      if (code === 20000) {
        yield put({
          type: 'concat', payload: {
            list: data.list,
            totals: data.totals,
            loadingState: false
          }
        });
      }
    },
    *getCancelEntrust({ payload }, { call, put, select }) {
      const params = yield select(state => state.HouseSourceManagementModel.params)
      const { code } = yield call(rentalHouseManagementService.houseSourceCancelEntrust, payload);
      if (code === 20000) {
        yield put({ type: 'concat', payload: {} });
        message.success('操作成功');
        const layout = yield select(state => state.MainLayout);
        yield put({ type: 'getList', payload: { community_id: layout.communityId, page: params.page, rows: params.rows } })
      }
    },
    *getHouseSourcePropertyCreate({ payload, callback }, { call, put, select }) {
      const { code } = yield call(rentalHouseManagementService.houseSourcePropertyCreate, payload);
      if (code === 20000) {
        const layout = yield select(state => state.MainLayout);
        const params = yield select(state => state.HouseSourceManagementModel.params);
        yield put({ type: 'concat', payload: {} });
        yield put({ type: 'concat', payload: { showOrder: false } });
        message.success('预约成功');
        yield put({
          type: 'getList',
          payload: {
            community_id: layout.communityId,
            page: params.page,
            rows: params.rows
          }
        });
        callback && callback();
      }
    }
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname }) => {
        if (pathname === '/rentalHouseManagement') {
          dispatch({ type: 'init' })
        }
      })
    }
  }
}
