import ChargingManagementService from '../../services/ChargingManagementService';
import { message } from 'antd';
import { routerRedux } from 'dva/router';
export default {
  namespace: 'GenerateBillModel',
  state: {
    community_id: sessionStorage.getItem("communityId"),
    plainOptions: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
    buildings: [],
    current: 0,
    calcList: [],
    costList: [],
    cycle_days: [],
    half_year: [],
    month: [],
    push_type: [],
    quarter: [],
    year: [],
    formFormulas: [],
    formProjects: [],
    cycle_Type: 4,
    pushType: 2,
    buildings2: [],
    selectorsLoading: false,
    getMonthList:[],
    tableData:[],
    timeArrList:[],
    tableTotals:'',
    tableAmount:'',
    taSkId:"",
  },
  reducers: {
    concat(state, { payload }) {
      return { ...state, ...payload };
    }
  },
  effects: {
    *init({ payload }, { call, put, select }) {
      yield put({
        type: 'getBuildings', payload: { community_id: sessionStorage.getItem("communityId") }
      });
      yield put({
        type: 'formulaList', payload: { community_id: sessionStorage.getItem("communityId") }
      });
      yield put({
        type: 'communityService', payload: { community_id: sessionStorage.getItem("communityId") }
      });
      yield put({
        type: 'getBillCalc',  payload: { community_id: sessionStorage.getItem("communityId") }
      });
    },
    *getBuildings({ payload }, { call, put }) {
      yield put({
        type: 'concat',
        payload: {
          selectorsLoading: true,
        }
      });
      const { data, code } = yield call(ChargingManagementService.getBuildings, payload);
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: {
            buildings: data?data:[],
            selectorsLoading: false,
          }
        });
      } else {
        yield put({
          type: 'concat',
          payload: {
            buildings:[],
            selectorsLoading: false,
          }
        });
      }
    },
    *formulaList({ payload }, { call, put }) {
      const { data, code } = yield call(ChargingManagementService.formulaList, payload);
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: {
            formFormulas: data.list,
          }
        });
      }
    },
    *communityService({ payload }, { call, put }) {
      const { data, code } = yield call(ChargingManagementService.communityService, payload);
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: {
            formProjects: data,
          }
        });
      }
    },
    *getBillCalc({ payload }, { call, put }) {
      const { data, code } = yield call(ChargingManagementService.getBillCalc, payload);
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: {
            calcList: data.calcList,
            costList: data.costList,
            cycle_days: data.cycle_days,
            half_year: data.half_year,
            month: data.month,
            push_type: data.push_type,
            quarter: data.quarter,
            year: data.year,
          }
        });
      }
    },
    *createBatchBill({ payload,callBack }, { call, put }){
      const { code,data } = yield call(ChargingManagementService.createBatchBill, payload);
      if(code == 20000){
        yield put({
          type: 'concat',
          payload: {
            current:2,
            taSkId:data.task_id
          }
        });
        callBack&&callBack(data)
      }
    },
    *billdetailList({ payload }, { call, put }){
      const { data,code } = yield call(ChargingManagementService.billdetailList, payload);
      if(code == 20000){
        yield put({
          type: 'concat',
          payload: {
            tableData: data.list,
            tableTotals: Number(data.totals),
            tableAmount: data.bill_entry_amount ? data.bill_entry_amount : 0
          }
        });
      }
    },
    //取消推送
    *recallBill({ payload,callBack }, { call, put }){
      const { code } = yield call(ChargingManagementService.recallBill, payload);
      if(code == 20000){
        yield put({
          type: 'concat',
          payload: {
            current:0,
          }
        });
        callBack&&callBack()
      }
    },
    //账单发布
    *pushBill({ payload,callBack }, { call, put }){
      const { code } = yield call(ChargingManagementService.pushBill, payload);
      if(code == 20000){
        message.success("账单发布成功！");
        yield put(routerRedux.push(`/billManage`));
        yield put({
          type: 'concat',
          payload: {
            current:0,
          }
        });
        callBack&&callBack()
      }
    },  
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, search }) => {
        if (pathname === '/generateBill') {
          dispatch({ type: 'init' });
          dispatch({type: 'concat', payload: {current: 0}})
        }
      });
    }
  },
};
