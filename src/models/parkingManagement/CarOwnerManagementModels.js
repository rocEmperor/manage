import { message } from 'antd';
import CarEquipManagementService from '../../services/CarEquipManagementService';
import { getCommunityId } from '../../utils/util';
const initialState = {
  params: {
    page: 1,
    rows: 10,
    community_id: getCommunityId(),
    lot_id: '',
    lot_area_id: '',
    car_num: '',
    park_card_no: '',
    car_port_num: '',
    status: '',
    user_name: '',
    user_mobile: '',
    carport_rent_start: '',
    carport_rent_end: ''
  },
  list: [],
  selectedRowKeys: [],
  selectedIds: [],
  lists: [],
  total: '',
  totals: '',
  lotOption: [],
  lotAreaOption: [],
  statusOption: [],
  is_reset: false,
  car_num: '',
  car_port_num: '',
  show: false
};
export default {
  namespace: 'CarOwnerManagementModels',
  state: { ...initialState },
  reducers: {
    concat(state, { payload }) {
      return { ...state, ...payload };
    }
  },
  effects: {
    *init({ payload }, { call, put, select }) {
      const community_id = getCommunityId();
      const { params } = yield select(state => state.CarOwnerManagementModels);
      yield put({
        type: 'concat',
        payload: {
          is_reset: true,
          params: { ...params, community_id }
        }
      });
      yield put({
        type: 'getOwnerList', payload: {
          page: 1,
          rows: 10,
          community_id,
          lot_id: '',
          lot_area_id: '',
          car_num: '',
          park_card_no: '',
          car_port_num: '',
          status: '',
          user_name: '',
          user_mobile: '',
          carport_rent_start: '',
          carport_rent_end: ''
        }
      });
      yield put({ type: 'getLotListAll', payload: { community_id } });
      yield put({ type: 'concat', payload: { ...initialState } });

      let query = {
        is_reset: true,
        params: {
          page: 1,
          rows: 10,
          community_id: sessionStorage.getItem("communityId"),
          lot_id: '',
          lot_area_id: '',
          car_num: '',
          park_card_no: '',
          car_port_num: '',
          status: '',
          user_name: '',
          user_mobile: '',
          carport_rent_start: '',
          carport_rent_end: ''
        },
      }
      yield put({ type: 'getOwnerList', payload: query.params });
      yield put({
        type: 'concat', payload: {
          is_reset: true,
          params: params
        }
      });
    },
    *getOwnerList({ payload }, { call, put, select }) {
      const params = yield select(state => state.CarOwnerManagementModels.params);
      const newParams = Object.assign(params, payload);
      let { data, code } = yield call(CarEquipManagementService.ownerList, newParams);
      if(data.list && data.list.length ==0 && newParams.page > 1){
        newParams.page--;
        data = yield call(CarEquipManagementService.ownerList, newParams);
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
    *renewList({ payload }, { call, put, select }) {
      const params = yield select(state => state.CarOwnerManagementModels.params);
      const newParams = Object.assign(params, payload);
      const { data, code } = yield call(CarEquipManagementService.renewList, newParams);
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: {
            lists: data ? data.list : [],
            total: parseInt(data.totals),
            params: newParams
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
    *getOwneDelete({ payload }, { call, put, select }) {
      const { code } = yield call(CarEquipManagementService.OwneDelete, payload);
      const params = yield select(state => state.CarOwnerManagementModels.params);
      if (code == 20000) {
        message.success('删除成功!');
        yield put({
          type: 'concat',
          payload: {
            show: false
          }
        });
        yield put({
          type: 'getOwnerList', payload: params
        });
      }
    },
    *getOwneRenew({ payload, callback }, { call, put }) {
      const { code } = yield call(CarEquipManagementService.carRenew, payload);
      if (code == 20000) {
        message.success('续费成功!');
        yield put({
          type: 'concat',
          payload: {
            showrRenewal: false
          }
        });
        yield put({
          type: 'getOwnerList', payload: {
            page: 1,
            rows: 10,
            community_id: getCommunityId()
          }
        });
        callback && callback();
      }
    },
    *carSelDel({ payload }, { call, put, select }) {
      const { code } = yield call(CarEquipManagementService.carSelDel, payload);
      const params = yield select(state => state.CarOwnerManagementModels.params);
      if (code == 20000) {
        message.success('删除成功！');
        yield put({
          type: 'getOwnerList', payload: params
        });
        yield put({
          type: 'concat',
          payload: {
            selectedRowKeys: []
          }
        });
      }
    },
    *getTradingType({ payload }, { call, put }) {
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
    *getStatusType({ payload }, { call, put }) {
      const { data, code } = yield call(CarEquipManagementService.StatusType, payload);
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: {
            statusOption: data.types
          }
        });
      }
    },
    *downFiles({ payload, callback }, { call, put, select }) {
      const { data, code } = yield call(CarEquipManagementService.downCarOwnerModel, payload);
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: {

          }
        })
      }
      callback && callback(data.down_url);
    },
    *getOwnerType({ payload }, { call, put }) {
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
    *carOwnerExportData({ payload, callback }, { call, put, select }) {
      const { data, code } = yield call(CarEquipManagementService.carOwnerExportData, payload);
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: {
            exportUrl: data.down_url
          }
        });
      }
      callback && callback(data.down_url);
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, search }) => {
        if (pathname === '/carOwnerManagement') {
          dispatch({
            type: 'concat',
            payload: {
              selectedIds: [],
              selectedRowKeys: []
            }
          })
          dispatch({ type: 'init' });
        }
      });
    }
  }
}