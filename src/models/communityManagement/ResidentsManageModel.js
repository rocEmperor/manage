import { message } from 'antd';
import CommunityManagementService from './../../services/CommunityManagementService';
import { getCommunityId } from '../../utils/util';
import queryString from 'query-string';
const { changerOwner, getAuditList, residentsManageList, residentExportData, residentTemplet, residentExport, deleteResidents,
  residentType, labelType, group, building, unit, room, auditNopasst, moveInHouse, auditDelete, moveOutPerson } = CommunityManagementService;
let initState = {
  totals: '',
  is_reset:false,
  export_url:"",
  identity_type:[],
  visible1:false,
  visibleIn:false,
  visibleFaild:false,
  visible:false,
  labelType: [],
  params:{
    page:1,
    rows:10,
    group:"",
    building:"",
    unit:"",
    room:"",
    name:"",
    status:"",
  },
  curTab: 'AlreadySettleIn',
  curIdentity: '1',
  isLong: false,
  groupData: [],
  buildingData: [],
  unitData: [],
  roomData: [],
  noPassId: '',
  inId: '',
  loading: false,
  settleInList: [],
  checkPendingList: [],
  settleOutList: [],
  failedList: [],
  curGroup: undefined,
  curBuilding: undefined,
  curUnit: undefined,
  curRoom: undefined,
  endTime: null,
  visibleOut: false
};
let state = JSON.parse(JSON.stringify(initState));
export default {
  namespace: 'ResidentsManageModel',
  state: {...state},
  reducers: {
    concat(state, { payload }) {
      return { ...state, ...payload };
    }
  },
  effects: {
    *init({ payload }, { call, put }) {
      let state = JSON.parse(JSON.stringify(initState));
      let queryList = payload.queryList;
      let listType = '1';
      let curTabObj = { curTab: 'AlreadySettleIn' };
      if (Object.hasOwnProperty.call(queryList, 'type')) {
        curTabObj.curTab = queryList.type;
        // 已迁入 listType = 2
        if (queryList.type === 'AlreadySettleOut') {
          listType = '2'
        }
      }
      let query = {
        is_reset:true,
        params:{
          page: 1,
          rows: 10,
          community_id: sessionStorage.getItem("communityId"),
          group: undefined,
          building: undefined,
          unit: undefined,
          room: undefined,
          name: undefined,
          status: undefined,
          identity_type: undefined
        }
      };
      yield put({ type: 'getList', payload: { ...query.params, move_status: listType }, listType: listType});
      yield put({ type: 'concat', payload: {...state, ...query, ...curTabObj} });
      yield put({type: 'residentType',payload: {}});
      yield put({   // 获取苑期区
        type: 'groupList',
        payload: {
          community_id: getCommunityId(),
          group: '',
          building: '',
          unit: '',
          room: ''
        }
      });
      yield put({
        type: 'labelType', payload: {
          label_type: 2,
          community_id: sessionStorage.getItem("communityId"),
        }
      });
    },
    *getList({ payload, listType }, { call, put, select }) {
      const params = yield select(state=>state.ResidentsManageModel.params);
      const newParams = Object.assign(params, payload);
      yield put({type: 'concat', payload: { loading: true }});
      const { data,code } = yield call(residentsManageList, payload);
      if(code == 20000){
        if (listType === '1') {
          yield put({
            type: 'concat',
            payload: {
              settleInList: data ? data.list : [],
              totals: data.totals,
              all_area: data.all_area,
              params: newParams,
              loading: false
            }
          });
        } else if (listType === '2') {
          yield put({
            type: 'concat',
            payload: {
              settleOutList: data ? data.list : [],
              totals: data.totals,
              all_area: data.all_area,
              params: newParams,
              loading: false
            }
          });
        }
      }
    },
    *getListOther ({ payload, listType }, { call, put, select }) {
      const params = yield select(state=>state.ResidentsManageModel.params);
      const newParams = Object.assign(params, payload);
      yield put({type: 'concat', payload: { loading: true }});
      const { data,code } = yield call(getAuditList, payload);
      if(code == 20000){
        if (listType === '2') {
          yield put({
            type: 'concat',
            payload: {
              failedList: data ? data.list : [],
              totals: data.totals,
              params: newParams,
              loading: false
            }
          });
        } else if (listType === '0') {
          yield put({
            type: 'concat',
            payload: {
              checkPendingList: data ? data.list : [],
              totals: data.totals,
              params: newParams,
              loading: false
            }
          });
        }
      }
    },
    *deleteResidents({ payload, listType }, { call, put }) {
      const {params} = payload;
      const { code } = yield call(deleteResidents, payload);
      if(code == 20000){
        message.destroy();
        message.success("操作成功！");
        yield put({ type: 'getList', payload: params, listType: listType });
      }
    },
    *changerOwner({ payload }, { call, put }) {
      const {params} = payload;
      const { code } = yield call(changerOwner, payload);
      if(code == 20000){
        message.destroy();
        message.success("操作成功！");
        yield put({ type: 'getList', payload:params });
      }
    },
    *residentType({ payload }, { call, put, select }) {
      const { data, code } = yield call(residentType, payload);
      if(code == 20000){
        yield put({
          type:'concat',
          payload: {
            identity_type: data
          }
        })
      }
    },
    *labelType({ payload }, { call, put, select }) {
      const params = yield select(state => state.ResidentsManageModel.params);
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
      const params = yield select(state=>state.ResidentsManageModel.params);
      const newParams = Object.assign(params, payload);
      const { data,code } = yield call(residentExport, payload);
      if(code == 20000){
        yield put({
          type: 'concat',
          payload: {
            params: newParams,
            export_url:data?data.down_url:""
          }
        });
      }
    },
    *downFiles ({ payload, callback }, { call, put, select }) {
      const { data, code } = yield call(residentTemplet, payload);
      if (code == 20000) {
        callback && callback(data.down_url)
      }
    },
    *residentsExport ({ payload, callback }, { call, put, select }) {
      const { data, code } = yield call(residentExportData, payload);
      if (code == 20000) {
        callback && callback(data.down_url)
      }
    },
    *groupList ({ payload, init }, { call, put, select }) {
      let defaultParam = {};
      payload = Object.assign({}, defaultParam, payload);
      const { data, code } = yield call(group, payload);
      if (code == 20000) {
        // 在点击迁入操作时，init为true，需要请求苑期区，幢，单元，室下拉数据，这是默认全取值，所有不需要联动效果
        if (init) {
          yield put({
            type: 'concat',
            payload: { groupData: data }
          })
        } else {
          yield put({
            type: 'concat',
            payload: {
              groupData: data,
              buildingData: [],
              unitData:[],
              roomData: []
            }
          })
        }
      }
    },
    *buildingList ({ payload, init }, { call, put, select }) {
      let defaultParam = {};
      payload = Object.assign({}, defaultParam, payload);
      const { data, code } = yield call(building, payload);
      if (code == 20000) {
        // 在点击迁入操作时，init为true，需要请求苑期区，幢，单元，室下拉数据，这是默认全取值，所有不需要联动效果
        if (init) {
          yield put({
            type: 'concat',
            payload: { buildingData: data }
          })
        } else {
          yield put({
            type: 'concat',
            payload: {
              buildingData: data,
              unitData:[],
              roomData: []
            }
          })
        }
      }
    },
    *unitList ({ payload, init }, { call, put, select }) {
      let defaultParam = {};
      payload = Object.assign({}, defaultParam, payload);
      const { data, code } = yield call(unit, payload);
      if (code == 20000) {
        // 在点击迁入操作时，init为true，需要请求苑期区，幢，单元，室下拉数据，这是默认全取值，所有不需要联动效果
        if (init) {
          yield put({
            type: 'concat',
            payload: { unitData: data }
          })
        } else {
          yield put({
            type: 'concat',
            payload: {
              unitData: data,
              roomData: []
            }
          })
        }
      }
    },
    *roomList ({ payload, init }, { call, put, select }) {
      let defaultParam = {};
      payload = Object.assign({}, defaultParam, payload);
      const { data, code } = yield call(room, payload);
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: {
            roomData: data
          }
        })
      }
    },
    *hasNoPass ({ payload, callback }, { call, put, select }) {
      let defaultParam = {};
      payload = Object.assign({}, defaultParam, payload);
      const { code } = yield call(auditNopasst, payload);
      if (code == 20000) {
        callback && callback()
      }
    },
    *moveInHouse ({ payload, callback }, { call, put, select }) {
      let defaultParam = {};
      payload = Object.assign({}, defaultParam, payload);
      const { code } = yield call(moveInHouse, payload);
      if (code == 20000) {
        callback && callback()
      }
    },
    *auditDelete ({ payload, callback }, { call, put, select }) {
      let defaultParam = {};
      payload = Object.assign({}, defaultParam, payload);
      const { code } = yield call(auditDelete, payload);
      if (code == 20000) {
        callback && callback()
      }
    },
    *moveOutPerson ({ payload, callback }, { call, put, select }) {
      let defaultParam = {};
      payload = Object.assign({}, defaultParam, payload);
      const { code } = yield call(moveOutPerson, payload);
      if (code == 20000) {
        callback && callback()
      }
    },
    *requireAll ({ payload, callback }, { call, put, select }) {
      let ID = { community_id: getCommunityId() };
      let group = yield put({type: 'groupList', payload: {...ID, group: '', building: '', unit: '', room: ''}, init: true});
      // 幢列表
      let building = yield put({type: 'buildingList', payload: {...ID, group: payload.group}, init: true});
      // 单元列表
      let unit = yield put({type: 'unitList', payload: {...ID, group: payload.group, building: payload.building}, init: true});
      // 室列表
      let room = yield put({type: 'roomList', payload: {...ID, group: payload.group, building: payload.building, unit: payload.unit}, init: true});
      let promisesArr = [group, building, unit, room];
      Promise.all(promisesArr).then(() => {
        callback && callback();
      });
    }
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, search }) => {
        let queryList = queryString.parse(search);
        if (pathname === '/residentsManage') {
          dispatch({ type: 'init', payload: { queryList: queryList }});
        }
      });
    }
  },
};
