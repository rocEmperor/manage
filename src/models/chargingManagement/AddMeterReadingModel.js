import ChargingManagementService from '../../services/ChargingManagementService';
import { message } from 'antd';
import queryString from 'query-string';
export default {
  namespace: 'AddMeterReadingModel',
  state:{
    community_id: sessionStorage.getItem("communityId"),
    data:[],
    values:'',
    id1:'',
    id:'',
    status:'',
    shared_id:'',
    current_num:'',
    name:'',
    amountMoney:'',
    recordNumber:'',
    ID:"",
    period_id:''
  },
  reducers: {
    concat(state, { payload }) {
      return { ...state, ...payload };
    }
  },
  effects:{
    *init({ payload }, { call, put }) {
      yield put({
        type: 'concat',
        payload: {
          period_id:payload.period_id,
          ID:payload.id?payload.id:""
        }
      })
    },
    *sharedPeriodList({ payload,callBack }, { call, put }){
      const { data, code } = yield call(ChargingManagementService.sharedSearchList, payload);
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: {
            data: data.list,
            status:payload.shared_type,
          }
        });
        callBack&&callBack(data)
      }
    },
    *recordNumber({ payload }, { call, put }){
      const { data, code } = yield call(ChargingManagementService.recordNumber, payload);
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: {
            recordNumber: data.latest_num,
          }
        });
      }
    },
    *getRecordMoney({ payload }, { call, put }){
      const { data, code } = yield call(ChargingManagementService.getRecordMoney, payload);
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: {
            amountMoney: data.amount,
          }
        });
      }
    },
    //详情
    *recordShow({ payload,callBack }, { call, put }){
      const {code,data } = yield call(ChargingManagementService.recordShow, payload);
      if(code == 20000){
        yield put({
          type: 'concat',
          payload: {
            info: data?data:'',
            amountMoney:data?data.amount:'',
            ID:data?data.id:'',
            recordNumber:data?data.latest_num:"",
            status:data?data.shared_type:"",
          }
        });
        callBack&&callBack(data)
      }
    },
    *recordAdd({ payload }, { call, put }){
      const {code } = yield call(ChargingManagementService.recordAdd, payload);
      if(code == 20000){
        message.success("新增成功！");
        setTimeout(() => {
          history.go(-1);
        },2000)
      }
    },
    *recordEdit({ payload }, { call, put }){
      const {code } = yield call(ChargingManagementService.recordEdit, payload);
      if(code == 20000){
        message.success("编辑成功！");
        setTimeout(() => {
          history.go(-1);
        },2000)
      }
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, search }) => {
        if (pathname === '/addMeterReading') {
          const query = queryString.parse(search);
          if(query.id){
            dispatch({ type: 'recordShow' ,payload:{id:query.id},callBack(data){
              let param = {
                community_id:data.community_id,
                shared_type:data.shared_type,
              }
              dispatch({
                type: 'sharedPeriodList',
                payload:param,
                callBack(callBack){
                  let shared_id = data.shared_id;
                  let arr = callBack.list;
                  if(arr){
                    arr.map((item)=>{
                      if(shared_id == item.id){
                        dispatch({type: 'concat', payload: {name:item.name,id:shared_id}});
                      }
                    })
                  }
                }
              })
            }});
            dispatch({ type: 'init' ,payload:{id:query.id}});
          }
          dispatch({ type: 'init' ,payload:{period_id:query.period_id,id:query.id}});
          dispatch({type: 'concat', payload: {info: '',amountMoney:'',recordNumber:'',name:''}});
        }
      });
    }
  },
}