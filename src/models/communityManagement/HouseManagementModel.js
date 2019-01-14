import { message } from 'antd';
import CommunityManagementService from './../../services/CommunityManagementService';
const { houseManagementList, dataExport, houseExport, removeInfo, floorLiftList, houseImport, dataRepairImport, downFiles, labelType } = CommunityManagementService;


export default {
  namespace: 'HouseManagementModel',
  state: {
    list:[],
    floorList: [],
    liftList: [],
    totals: '',
    is_reset:false,
    selectedRowKeys:[],
    selectArr:[],
    selectedNum:0,
    all_area:0,
    export_url:"",
    exportUrl: '',
    labelType: [],
    params:{
      page:1,
      rows:10,
      community_id: sessionStorage.getItem("communityId"),
      group:"",
      building:"",
      unit:"",
      room:"",
      property_type:"",
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
        group:"",
        building:"",
        unit:"",
        room:"",
        property_type:"",
        status:""
      }});
      yield put({
        type: 'concat',
        payload: {
          is_reset:true,
          params: {
            page: 1,
            rows: 10,
            community_id: sessionStorage.getItem("communityId"),
            group: "",
            building: "",
            unit: "",
            room: "",
            property_type: "",
            status: ""
          }
        }
      });
      yield put({
        type: 'floorLiftList',
        payload: {
          shared_type: 1,
          community_id: sessionStorage.getItem("communityId"),
        }
      });
      yield put({
        type: 'floorLiftList',
        payload: {
          shared_type: 2,
          community_id: sessionStorage.getItem("communityId"),
        }
      });
      yield put({
        type: 'labelType', payload: {
          label_type: 1,
          community_id: sessionStorage.getItem("communityId"),
        }
      }); 
    },
    *getList({ payload }, { call, put, select }) {
      const params = yield select(state=>state.HouseManagementModel.params);
      const newParams = Object.assign(params, payload);
      const { data,code } = yield call(houseManagementList, payload);
      if(code == 20000){
        yield put({
          type: 'concat',
          payload: {
            list: data?data.list:[],
            totals: data.totals,
            all_area: data.all_area,
            params: newParams,
            export_url: data.export_url
          }
        });
      }
    },
    *floorLiftList({ payload }, { call, put, select }) {
      const params = yield select(state=>state.HouseManagementModel.params);
      const newParams = Object.assign(params, payload);
      const { data,code } = yield call(floorLiftList, payload);
      if(code == 20000){
        if(payload.shared_type==2){
          yield put({
            type: 'concat',
            payload: {
              floorList: data?data.list:[],
              params: newParams
            }
          });
        }else if(payload.shared_type==1){
          yield put({
            type: 'concat',
            payload: {
              liftList: data?data.list:[],
              params: newParams
            }
          });
        }

      }
    },
    *houseImport({ payload }, { call, put, select }) {
      const { code } = yield call(houseImport, payload);
      if(code == 20000){
        message.success('导出成功');
      }
    },
    *houseExport({ payload, callback }, { call, put, select }) {
      const { data, code } = yield call(houseExport, payload);
      if(code == 20000){
        yield put({
          type: 'concat',
          payload: {
            exportUrl: data.down_url
          }
        })
      }
      callback&&callback(data.down_url);
    },
    *downFiles({ payload, callback }, { call, put, select }) {
      const { data, code } = yield call(downFiles, payload);
      if(code == 20000){
        yield put({
          type: 'concat',
          payload: {

          }
        })
      }
      callback&&callback(data.down_url);
    },
    *dataRepairImport({ payload }, { call, put, select }) {
      const { code } = yield call(dataRepairImport, payload);
      if(code == 20000){
        message.success('导出成功');
      }
    },
    *removeInfo({ payload, callback }, { call, put, select }) {
      const { code } = yield call(removeInfo, payload);
      if(code == 20000){
        message.success('删除成功');
        callback && callback();
        // yield put({ type: 'getList' ,payload:{
        //   page:1,
        //   rows:10,
        //   community_id: sessionStorage.getItem("communityId"),
        //   group:"",
        //   building:"",
        //   unit:"",
        //   room:"",
        //   property_type:"",
        //   status:""
        // }});
      }
    },
    *labelType({ payload }, { call, put, select }) {
      const params = yield select(state => state.HouseManagementModel.params);
      const newParams = Object.assign(params, payload);
      const { data, code } = yield call(labelType, payload);
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: {
            labelType: data ? data.list : [],
            params: newParams,
          }
        });
      }
    },
    *dataExport({ payload }, { call, put, select }) {
      const params = yield select(state=>state.HouseManagementModel.params);
      const newParams = Object.assign(params, payload);
      const { data,code } = yield call(dataExport, payload);
      if(code == 20000){
        yield put({
          type: 'concat',
          payload: {
            params: newParams,
            export_url:data?data.export_url:""
          }
        });
      }
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, search }) => {
        if (pathname === '/houseManagement') {
          dispatch({ type: 'init'});
        }
      });
    }
  },
};
