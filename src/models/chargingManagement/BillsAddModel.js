import ChargingManagementService from '../../services/ChargingManagementService';
import queryString from 'query-string';
import { message } from 'antd';
export default {
  namespace: 'BillsAddModel',
  state: {
    community_id: sessionStorage.getItem("communityId"),
    index:0,
    roomInfo:'',
    address:'',
    group:'',
    property_type:'',
    charge_area:'',
    serverList:[],
    elec_price:'',
    end_value:'',
    id:'',
    cardItem:[
      {
        type:"",
        time:"",
        // start:"",
        // end:"",
        // water:"",
        amount:"",
        index:0,
        costType:"",
      }
    ],
  },
  reducers: {
    concat(state, { payload }) {
      return { ...state, ...payload };
    }
  },
  effects: {
    *init({payload}, { call, put, select }) {
      const community_id = sessionStorage.getItem("communityId"); 
      yield put({
        type: 'concat',
        payload: {
          community_id: community_id,
          index: 0,
          roomInfo: '',
          address: '',
          group: '',
          property_type: '',
          charge_area: '',
          serverList: [],
          elec_price: '',
          end_value: '',
          id: '',
          cardItem: [
            {
              type: "",
              time: "",
              // start: "",
              // end: "",
              // water: "",
              amount: "",
              index: 0,
              costType: "",
            }
          ],
        }
      }); 
      yield put({
        type: 'showRoom',payload:{community_id:community_id,room_id:payload.room_id}
      });
      yield put({
        type: 'serverList'
      });
      yield put({
        type: 'formulaShow',
        payload:{community_id:community_id,}
      });
      yield put({
        type: 'formulaWaterShow',
        payload:{community_id:community_id,}
      });
    },
    *showRoom({ payload }, { call, put }) {
      const { data, code } = yield call(ChargingManagementService.showRoom, payload);
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: {
            address: data.list.address,
            group: data.list.group,
            property_type: data.list.property_type,
            charge_area: data.list.charge_area,
            roomInfo: data?data.list:'',
            id:data.list.id,
          }
        });
      }
    },
    *serverList({ payload }, { call, put }){
      const { data, code } = yield call(ChargingManagementService.costType, payload);
      if(code == 20000){
        yield put({
          type:'concat',
          payload:{
            serverList: data?data:[],
          }
        })
      }
    },
    *formulaShow({ payload }, { call, put }){
      const { data, code } = yield call(ChargingManagementService.formulaShow, payload);
      if(code == 20000){
        yield put({
          type:'concat',
          payload:{
            elec_price:data.price,
          }
        })
      }
    },
    *formulaWaterShow({ payload }, { call, put }){
      const { data, code } = yield call(ChargingManagementService.formulaWaterShow, payload);
      if(code == 20000){
        yield put({
          type:'concat',
          payload:{
            water_price: data.price,
          }
        })
      }
    },
    *getAmount({ payload,callback }, { call, put }){
      const { data, code } = yield call(ChargingManagementService.getAmount, payload);
      if(code == 20000){
        yield put({
          type:'concat',
          payload:{
            amount: data,
          }
        })
      }
      callback&&callback(data)
    },
    *billAdd({ payload,callback }, { call, put }){
      const { data } = yield call(ChargingManagementService.billAdd, payload);
      if(data.defeat_totals == data.success_totals){
        message.success("添加成功！");
        callback&&callback();
        setTimeout(() => {
          location.href = "#/billManage";
        },2000)
      }else{
        message.error(data.error_msg);
      }
    },
  },  
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, search }) => {
        if (pathname === '/billsAdd') {
          const query = queryString.parse(search);
          if(query.id) {
            dispatch({ type: 'init',payload:{room_id:query.id}});
          }
        }
      });
    }
  },
};
