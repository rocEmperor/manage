import chargingManagement from '../../services/ChargingManagementService';
import queryString from 'query-string';
let initialState = {
  totals: 0,
  page: 1,
  export_url: '',
  data: [],
  groupData: [],
  buildingData: [],
  unitData: [],
  roomData: [],
  infoData: {},
  loading: false,
  submitLoading: false,
  confirmLoading: false,
  selected: false,
  selectedRows: [],
  progressPercent: 0,
  textShow: 0,
  progressState: 'active',
  stepNum: 3,
  success_totals: '',
  totalsNum: '',
  errorFile: '',
  info: '',
  typeOption: [],
  visible: false,
  visible2: false,
  visible1: false,
  payType: [],
  roomsData: [],
  reportData: [],
  info2: [],
  bill_list: [],
  selectedNum: 0,
  selectedRowKeys: [],
  selectDataSource: [],
  flag: false,
  lockArr: [],
  success_count: 0,
  defeat_count: 0,
  id:'',
};
export default {
  namespace: 'CollectionsModel',
  state: { ...initialState },
  reducers: {
    concat(state, { payload }) {
      return { ...state, ...payload }
    }
  },
  effects: {
    *init({ payload }, { call, put, select }) {
      let layout = yield select(state => state.MainLayout);
      yield put({ type: 'concat', payload: initialState });
      let { query } = payload;
      let queryList = {
        community_id: layout.communityId,
        group: '',
        building: '',
        unit: '',
        room_id: query.id
      };
      if (layout.communityId) {
        yield put({ type: 'groupList', payload: queryList });
        yield put({ type: 'payChannel', payload: {} });
        yield put({                       // 重置页面，恢复初始状态
          type: 'concat',
          payload: {
            page: 1,
            loading: false,
            submitLoading: false,
            totals: 0,
            data: [],
            info: [],
            visible: false,
            visible2: false,
            visible1: false,
            id:query.id,
          }
        });
        yield put({ type: 'payType', payload: {}});  // 获取缴费方式

      }
    },
    *groupList({ payload }, { call, put, select }) {
      let defaultParam = {};
      payload = Object.assign({}, defaultParam, payload);
      const { data, code } = yield call(chargingManagement.getGroupsList, payload);
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: { groupData: data?data:[] }
        })
      }
    },
    *payChannel({ payload }, { call, put, select }) {
      let defaultParam = {};
      payload = Object.assign({}, defaultParam, payload);
      const { data, code } = yield call(chargingManagement.payChannelReq, payload);
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: { typeOption: data?data:[] }
        })
      }
    },
    *payType({ payload,callback }, { call, put, select }) {
      const { data, code } = yield call(chargingManagement.payTypeList, payload);
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: { payType: data?data:[] }
        })
        let info  = yield select(state => state.CollectionsModel);
        let layout = yield select(state => state.MainLayout);
        let queryList = {
          community_id: layout.communityId,
          group: '',
          building: '',
          unit: '',
          room_id: info.id,
        };
        if (info.id) {   //放回调内是因为会出现列表getList，比类型payType接口执行得快，payType[0].key为undefined
          yield put({
            type: 'getList',
            payload: queryList
          })
        }
      }
    },
    *getList({ payload, callback }, { call, put, select }) {
      let defaultParam = { page: 1, rows: 10 };
      payload = Object.assign({}, defaultParam, payload);
      yield put({
        type: 'concat',
        payload: {
          loading: true,
          submitLoading: true
        }
      });
      const { data, code } = yield call(chargingManagement.collectionsListReq, payload);
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: {
            page: 1,
            loading: false,
            submitLoading: false,
            totals: data.totals ? data.totals - 0 : 0,
            data: data.dataList,
            roomsData: data.roomData,
            reportData: data.reportData
          }
        });
        if (callback) {
          yield put({
            type: 'concat',
            payload: {
              searchLoading: false
            }
          })
        }
      }
    },
    *visibleChange({ payload }, { call, put, select }) {
      let { name, type } = payload;
      if (name === 'show') {
        if (type === 1) {
          yield put({ type: 'concat', payload: { visible: true } })
        } else if (type == 3) {
          yield put({ type: 'concat', payload: { visible1: true, visible: false, visible2: false } })
        } else {
          yield put({ type: 'concat', payload: { visible2: true } })
        }
      } else if (name === 'hide') {
        if (type === 1) {
          yield put({ type: 'concat', payload: { visible: false } })
        } else if (type == 3) {
          yield put({ type: 'concat', payload: { visible1: false } })
        } else {
          yield put({ type: 'concat', payload: { visible2: false } })
        }
      }
    },
    *numberPlus({ payload }, { call, put, select }) {
      yield call(chargingManagement.chargeNumberReq, payload);
    },
    *complete({ payload, types, callback, callback1 }, { call, put, select }) {
      let defaultParam = {};
      payload = Object.assign({}, defaultParam, payload);
      if (types === 0) {
        const { data, code } = yield call(chargingManagement.submitCharge, payload);
        if (code == 20000) {
          if (data.defeat_count == data.success_count) {
            callback && callback();
            yield put({
              type: 'concat',
              payload: {
                bill_list: data.bill_list || [],
                info2: data.print_room_data || {},
              }
            })
          } else {
            callback1 && callback1();
            yield put({
              type: 'concat',
              payload: {
                lockArr: data.lockArr,
                success_count: data.success_count,
                defeat_count: data.defeat_count
              }
            })
          }
        }
      } else if (types === 1) {
        const { data, code } = yield call(chargingManagement.billCollectPrint, payload);
        if (code == 20000) {
          if (data.defeat_count == data.success_count) {
            callback && callback();
            yield put({
              type: 'concat',
              payload: {
                bill_list: data.bill_list || [],
                info2: data.print_room_data || {},
              }
            })
          }else{
            callback1 && callback1();
            yield put({
              type: 'concat',
              payload: {
                lockArr: data.lockArr,
                success_count: data.success_count,
                defeat_count: data.defeat_count
              }
            })
          }
        }
      }
    }
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, search }) => {
        let query = queryString.parse(search);
        if (pathname === '/collections') {
          dispatch({
            type: 'init',
            payload: { query: query }
          })
        }
      })
    }
  }
}
