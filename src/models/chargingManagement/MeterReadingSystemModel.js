import ChargingManagementService from '../../services/ChargingManagementService';
import { getCommunityId } from '../../utils/util';
import {message} from 'antd';
import queryString from 'query-string';
export default {
  namespace: 'MeterReadingSystemModel',
  state:{
    ID:'',
    status:'',
    is_reset:false,
    default_count:'',
    success_count:'',
    error_count:'',
    error_list: [],
    visible:false,
    list: [],
    totals:'',
    latest_ton:'',
    current_ton:'',
    params:{
      community_id:getCommunityId(),
      page:1,
      rows:10,
      cycle_id:'',
      meter_no:'',
      bill_type:'',
      group:'',
      building:'',
      unit:'',
      room:''
    }
  },
  reducers: {
    concat(state, { payload }) {
      return { ...state, ...payload, };
    }
  },
  effects:{
    *init({ payload }, { call, put, select }) {
      yield put({
        type:'getMeterReadingList',
        payload:{
          page:1,
          rows:10,
          community_id:getCommunityId(),
          bill_type:payload.type,
          cycle_id:payload.ID,
          meter_no:'',
          group:'',
          building:'',
          unit:'',
          room:''
        }
      })
      yield put({
        type:'concat',
        payload:{
          is_reset:true,
          ID:payload.ID,
          type:payload.type,
          status:payload.status,
          params:{
            //community_id:getCommunityId(),
            page:1,
            rows:10,
            cycle_id:'',
            meter_no:'',
            bill_type:'',
            group:'',
            building:'',
            unit:'',
            room:''
          }
        }
      })
    },
    *getMeterReadingList({payload},{call,put,select}){
      const params = yield select(state => state.MeterReadingSystemModel.params);
      const newParams = Object.assign(params, payload);
      const { data,code } = yield call(ChargingManagementService.MeterReadingRecord, payload)
      if(code == 20000){
        yield put({
          type: 'concat',
          payload: {
            list: data&&data.list?data.list:[],
            totals:data&&data.totals?data.totals:null,
            params: newParams,
          }
        });
      }
    },
    //editMeterNum
    *editMeterNum({ payload,callback },{ call,put,select }){
      const { data,code } = yield call(ChargingManagementService.editMeterNum, payload)
      if(code == 20000){
        yield put({
          type: 'concat',
          payload:{
            exportUrl: data.down_url
          }
        })
      }
      callback&&callback();
    },
    //generateBill
    *generateBill({ payload,callBack }, { call, put,select }){
      const {code,data } = yield call(ChargingManagementService.generateBill, payload);
      let ViewData  = yield select(state => state.MeterReadingSystemModel);
      const params = yield select(state => state.MeterReadingSystemModel.params);
      if (code == 20000) {
        if(data&&Number(data.error_count)<=Number(0)){
          message.success("生成账单成功!");
          params.bill_type=ViewData.type;
          params.cycle_id = ViewData.ID;
          params.community_id = getCommunityId();
          yield put({
            type:'getMeterReadingList',
            payload:params,
          })
        }
        yield put({
          type: 'concat',
          payload: {
            success_count:data?data.success_count:'',
            default_count:data?data.default_count:'',
            error_count:data?data.error_count:'',
            error_list:data?data.error_list:[],
            visible:Number(data.error_count)>Number(0)?true:false,
          }
        });
      }
      callBack&&callBack()
    },
    *reportExport({ payload,callback },{ call,put,select }){
      const { data,code } = yield call(ChargingManagementService.reportExport, payload)
      if(code == 20000){
        yield put({
          type: 'concat',
          payload:{
            exportUrl: data
          }
        })
      }
      callback&&callback(data);
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, search }) => {
        if (pathname === '/meterReadingSystem') {
          const query = queryString.parse(search);
          dispatch({ type: 'init',payload: {ID:query.id,type:query.type,status:query.status}});
          //dispatch({type: 'concat', payload: {ID:query.id,type:query.type}});
        }
      });
    }
  },
}
