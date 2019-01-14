import { message } from 'antd';
import CarEquipManagementService from '../../services/CarEquipManagementService';
import { getCommunityId } from '../../utils/util';

export default {
  namespace: 'CarportManagement',
  state: {
    params: {
      page: 1,
      rows: 10,
      community_id: getCommunityId(),
      lot_id: "",
      lot_area_id: "",
      car_port_type: "",
      car_port_num: "",
      car_port_status: "",
      room_name: "",
      room_mobile: "",
      building: "",
      group: "",
      room: "",
      unit: ""
    },
    list: [],
    totals: '',
    lotOption: [],
    lotAreaOption: [],
    typeOption: [],
    statusOption: [],
    visible: false,
    is_reset: false,
    exportUrl: '',
    selectedRowKeys:[],
    selectedIds: [],
  },
  reducers: {
    concat(state, { payload }) {
      return { ...state, ...payload };
    }
  },
  effects: {
    *init({ payload }, { call, put, select }) {
      const community_id = getCommunityId();
      const { params } = yield select(state => state.CarportManagement);
      yield put({
        type: 'concat',
        payload: {
          is_reset: true,
          params: { ...params, community_id }
        }
      });
      yield put({
        type: 'getCarportList', payload: {
          page: 1,
          rows: 10,
          community_id,
          lot_id: "",
          lot_area_id: "",
          car_port_type: "",
          car_port_num: "",
          car_port_status: "",
          room_name: "",
          room_mobile: "",
          building: "",
          group: "",
          room: "",
          unit: ""
        }
      });
      yield put({ type: 'getLotListAll', payload: {
        community_id: getCommunityId()
      } });
      yield put({ type: 'getCarportTypes' });
      yield put({ type: 'getCarportStatus' });
    },
    *getCarportList({ payload }, { call, put, select }) {
      const params = yield select(state => state.CarportManagement.params);
      const newParams = Object.assign(params, payload);
      let { data, code } = yield call(CarEquipManagementService.CarportList, newParams);
      if(data.list && data.list.length ==0 && newParams.page > 1){
        newParams.page--;
        data = yield call(CarEquipManagementService.CarportList, newParams);
        if (code == 20000) {
          yield put({
            type: 'concat',
            payload: {
              list: data.data ? data.data.list : [],
              totals: parseInt(data.data.totals),
              params: newParams
            }
          });
        }
      }else{
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
    *downModel({ payload, callback }, { call, put, select }) {
      const { data, code } = yield call(CarEquipManagementService.downModel, payload);
      if (code == 20000) {
        callback && callback(data.down_url);
      }
    },
    *getCarportDel({ payload }, { call, put, select }) {
      const { code } = yield call(CarEquipManagementService.CarportDel, payload);
      const params = yield select(state => state.CarportManagement.params);
      if (code == 20000) {
        message.success('删除成功!');
        yield put({
          type: 'getCarportList', payload: params
        });
      }
    },
    *portSelDel({ payload }, { call, put, select }) {
      const { code } = yield call(CarEquipManagementService.carPortSelDel, payload);
      const params = yield select(state => state.CarportManagement.params);
      if (code == 20000) {
        message.success('删除成功！');
        yield put({
          type: 'getCarportList', payload: params
        });
        yield put({
          type: 'concat',
          payload: {
            selectedRowKeys: []
          }
        });
      }
    },
    *carExport({ payload, callback }, { call, put, select }) {
      const { data, code } = yield call(CarEquipManagementService.carExport, payload);
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: {
            exportUrl: data.down_url
          }
        });
      }
      callback && callback(data.down_url);
    }

  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, search }) => {
        if (pathname === '/carportManagement') {
          dispatch({
            type: 'concat',
            payload: {
              selectedRowKeys: [],
              selectedIds:[]
            }
          })
          dispatch({ type: 'init' });
        }
      });
    }
  }
}