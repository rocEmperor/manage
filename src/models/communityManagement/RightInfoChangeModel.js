import { message } from 'antd';
import CommunityManagementService from './../../services/CommunityManagementService';
const { rightList,changerAccept,changerSendMsg,changerStatus } = CommunityManagementService;
import { getCommunityId } from '../../utils/util';

export default {
  namespace: 'RightInfoChangeModel',
  state: {
    list:[],
    statusOption:[],
    is_reset:false,
    totals: '',
    id:"",
    params:{
      page:1,
      rows:10,
      name:"",
      group:"",
      building:"",
      unit:"",
      room:"",
      status:""
    }
  },
  reducers: {
    concat(state, { payload }) {
      return { ...state, ...payload };
    }
  },
  effects: {
    *init({ payload }, { call, put }) {
      yield put({ type: 'getList' ,payload:{
        page:1,
        rows:10,
        community_id: sessionStorage.getItem("communityId"),
        name:"",
        group:"",
        building:"",
        unit:"",
        room:"",
        status:""
      }});
      yield put({
        type: 'concat',
        payload: {
          is_reset:true,
          params: {
            page:1,
            rows:10,
            community_id: sessionStorage.getItem("communityId"),
            name:"",
            group:"",
            building:"",
            unit:"",
            room:"",
            status:""
          }
        }
      });
      yield put({ type:'changerStatus'});
    },
    *getList({ payload }, { call, put, select }) {
      const params = yield select(state=>state.RightInfoChangeModel.params);
      const newParams = Object.assign(params, payload);
      const { data,code } = yield call(rightList, payload);
      if(code == 20000){
        yield put({
          type: 'concat',
          payload: {
            list: data?data.list:[],
            totals: data.totals,
            params: newParams
          }
        });
      }
    },

    *changerStatus({ payload }, { call, put, select }) {
      const params = yield select(state=>state.RightInfoChangeModel.params);
      const newParams = Object.assign(params, payload);
      const { data,code } = yield call(changerStatus, payload);
      if(code == 20000){
        yield put({
          type: 'concat',
          payload: {
            statusOption: data?data.changer_status:[],
            params: newParams
          }
        });
      }
    },
    *changerAccept({ payload }, { call, put, select }) {
      const { code } = yield call(changerAccept, payload);
      if(code == 20000){
        message.success('操作成功');
        yield put({
          type: 'getList',
          payload:{
            community_id:getCommunityId(),
            page:1,
            row:10
          }
        })
      }
    },
    *changerSendMsg({ payload }, { call, put, select }) {
      const { code } = yield call(changerSendMsg, payload);
      if(code == 20000){
        message.success('发送成功');
      }
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, search }) => {
        if (pathname === '/rightInfoChange') {
          dispatch({ type: 'init'});
        }
      });
    }
  },
};
