import ChargingManagementService from '../../services/ChargingManagementService';
import queryString from 'query-string';
import { message } from 'antd';
import { download } from '../../utils/util';
const { billDetailList, payList, statusList, exportTypeBill, delAllData, delBills, generateBills, generateAllBills, getUnitsList,
  getRoomsList,
  getBuildingsList, getGroupsList } = ChargingManagementService;

export default {
  namespace: 'BillsTypeModel',
  state: {
    type: "",
    costType: [],
    statusType: [],
    selectedRowKeys: [],
    groupData: [],
    buildingData: [],
    unitData: [],
    roomData: [],
    selectedNum: 0,
    selectedIds: [],
    data: [],
    billInfo: {},
    totals: "",
    params: {
      rows: 10,
      page: 1,
      community_id: sessionStorage.getItem("communityId"),
      building: "",
      group: "",
      unit: "",
      room: "",
      year: "",
      costList: [],
      source: ''
    },
  },
  reducers: {
    concat(state, { payload }) {
      return { ...state, ...payload };
    }
  },
  effects: {
    *init({ payload }, { call, put, select }) {
      // let initParams = payload;
      yield put({
        type: 'concat', payload: { params: payload, }
      })
      // yield put({
      //   type: 'getBillDetailList',
      //   payload: initParams
      // });
      yield put({
        type: 'getPayList'
      });
      yield put({
        type: 'getStatusList'
      });
      let query = {
        community_id: sessionStorage.getItem("communityId"),
        group: '',
        building: '',
        unit: ''
      };
      yield put({
        type: 'groupList',
        payload: query
      });
    },
    *getBillDetailList({ payload }, { call, put, select }) {
      const costType = yield select(state => state.BillsTypeModel.costType);
      const params = yield select(state => state.BillsTypeModel.params);
      const newParams = Object.assign(params, payload);
      let arr = [];
      costType.map(item => {
        if (payload.costList != undefined) {
          payload.costList.map(items => {
            if (items == item.key || items == item.label) {
              arr.push(item.key);
            }
          })
        }
      })
      payload.costList = arr;
      const { data, code } = yield call(billDetailList, payload);
      if (code == 20000) {
        let arr = [];
        costType.map(item => {
          if (payload.costList != undefined) {
            payload.costList.map(items => {
              if (items == item.key || items == item.label) {
                arr.push(item.label);
              }
            })
          }
        })
        newParams.costList = arr;
        yield put({
          type: 'concat',
          payload: {
            data: data.list,
            billInfo: {
              bill_entry_amount: data.bill_entry_amount,
              paid_entry_amount: data.paid_entry_amount
            },
            totals: data.totals,
            params: newParams,
          }
        });
      }
    },
    *getStatusList({ payload }, { call, put, select }) {
      const { data, code } = yield call(statusList, payload);
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: {
            statusType: data,
          }
        });
      }
    },
    *getPayList({ payload }, { call, put, select }) {
      const { data, code } = yield call(payList, payload);
      const params = yield select(state => state.BillsTypeModel.params);
      if (code == 20000) {
        // let arr = [];
        // data.map(item => {
        //   params.costList.map(items => {
        //     if (item.key == items) {
        //       arr.push(item.label);
        //     }
        //   })
        // })
        // params.costList = arr;
        yield put({
          type: 'concat',
          payload: {
            costType: data,
          }
        });
        yield put({
          type: 'getBillDetailList',
          payload: params
        });
      }
    },
    *exportBill({ payload }, { call, put, select }) {
      const { data, code } = yield call(exportTypeBill, payload);
      if (code == 20000) {
        download(data.down_url);
        message.success('导出成功！');
      }
    },
    *groupList ({ payload }, { call, put, select }) {
      let defaultParam = {};
      payload = Object.assign({}, defaultParam, payload);
      const { data, code } = yield call(getGroupsList, payload);
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: {
            groupData: data
          }
        })
      }
    },
    *buildingList ( { payload }, { call, put, select }) {
      let defaultParam = {};
      payload = Object.assign({}, defaultParam, payload);
      const { data, code } = yield call(getBuildingsList, payload);
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: {
            buildingData: data,
            unitData: [],
            roomData: [],
          }
        })
      }
    },
    *unitList ( {payload }, { call, put, select }) {
      let defaultParam = {};
      payload = Object.assign({}, defaultParam, payload);
      const { data, code } = yield call(getUnitsList, payload);
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: {
            unitData: data,
            roomData: [],
          }
        })
      }
    },
    *roomList ( {payload }, { call, put, select }) {
      let defaultParam = {};
      payload = Object.assign({}, defaultParam, payload);
      const { data, code } = yield call(getRoomsList, payload);
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: {
            roomData: data
          }
        })
      }
    },
    *removeAllData({ payload }, { call, put, select }) {
      const params = yield select(state => state.BillsTypeModel.params);
      const { code } = yield call(delAllData, payload);
      if (code == 20000) {
        message.success("操作成功");
        yield put({
          type: 'getBillDetailList',
          payload: params
        });
        yield put({
          type: 'concat',
          payload: {
            costType: [],
            statusType: [],
            selectedRowKeys: [],
            selectedNum: 0,
            selectedIds: [],
            data: [],
            billInfo: {},
          }
        })
      }
    },
    *removeBills({ payload }, { call, put, select }) {
      const params = yield select(state => state.BillsTypeModel.params);
      const { code } = yield call(delBills, payload);
      if (code == 20000) {
        message.success("操作成功");
        yield put({
          type: 'getBillDetailList',
          payload: params
        });
        yield put({
          type: 'concat',
          payload: {
            selectedNum: 0,
            selectedRowKeys: [],
            statusType: [],
            selectedIds: [],
            data: [],
            billInfo: {},
          }
        })
      }
    },
    *generateBill({ payload }, { call, put, select }) {
      const params = yield select(state => state.BillsTypeModel.params);
      const { code } = yield call(generateBills, payload);
      if (code == 20000) {
        message.success("操作成功");
        yield put({
          type: 'getBillDetailList',
          payload: params
        });
        yield put({
          type: 'concat',
          payload: {
            statusType: [],
            selectedRowKeys: [],
            selectedNum: 0,
            selectedIds: [],
            data: [],
            billInfo: {},
          }
        })
      }
    },
    *generateAllBill({ payload }, { call, put, select }) {
      const costType = yield select(state => state.BillsTypeModel.costType);
      const params = yield select(state => state.BillsTypeModel.params);
      const newParams = Object.assign(params, payload);
      let arr = [];
      costType.map(item => {
        if (payload.costList != undefined) {
          payload.costList.map(items => {
            if (items == item.key || items == item.label) {
              arr.push(item.key);
            }
          })
        }
      })
      payload.costList = arr;
      
      const { code } = yield call(generateAllBills, payload);
      if (code == 20000) {
        let arr = [];
        costType.map(item => {
          if (payload.costList != undefined) {
            payload.costList.map(items => {
              if (items == item.key || items == item.label) {
                arr.push(item.label);
              }
            })
          }
        })
        newParams.costList = arr;
        message.success("操作成功");
        yield put({
          type: 'getBillDetailList',
          payload: params
        });
        yield put({
          type: 'concat',
          payload: {
            statusType: [],
            selectedRowKeys: [],
            selectedNum: 0,
            selectedIds: [],
            data: [],
            billInfo: {},
            params: newParams,
          }
        })
      }
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, search }) => {
        const query = queryString.parse(search);
        let str = query.costList;
        if (pathname === '/billsType') {
          const initParams = {
            rows: 10,
            page: 1,
            community_id: sessionStorage.getItem("communityId"),
            group: query.group == 'undefined' || query.group == '' ? '' : query.group,
            building: query.building == 'undefined' || query.building == '' ? '' : query.building,
            unit: query.unit == 'undefined' || query.unit == '' ? '' : query.unit,
            room: query.room == 'undefined' || query.room == '' ? '' : query.room,
            costList: str == '' || str == 'undefined' ? [] : str.split(','),
            source: query.type,
            year: query.year == '' || query.year == 'undefined' ? '' : query.year
          };
          dispatch({ type: 'concat', payload: { type: query.type } })
          dispatch({ type: 'init', payload: initParams });
        }
      });
    }
  },
};
