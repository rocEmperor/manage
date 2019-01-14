import {message} from 'antd';
import queryString from 'query-string';
import CommunityManagementService from './../../services/CommunityManagementService.js';
const { residentType, editResidents, residentView, createResidents, group, building, unit, room,
  residentGetNation, residentCommonOptionInfo, labelType, houseArea} = CommunityManagementService;


export default {
  namespace: 'ResidentsAddModel',
  state: {
    id: "",
    info: "",
    groupOption:[],
    buildingOption:[],
    unitOption:[],
    roomOption:[],
    identityTypeOption:[],
    nation:[],
    change_detail:[],
    face:[],
    household_type:[],
    identity_type:[],
    live_detail:[],
    live_type:[],
    marry_status:[],
    labelType: [],
    curType: '',
    isLong: false,
    curIdentity: ''
    // isRequire:false,
    // change_img:false
  },
  reducers: {
    concat(state, { payload }) {
      return { ...state, ...payload };
    }
  },
  effects: {
    *init({payload}, {call, put}) {
      let query = payload.query;
      let curType = '';
      if (Object.hasOwnProperty.call(query, 'type')) {
        curType = query.type;
      }
      yield put({type: 'getGroup',payload:{community_id: sessionStorage.getItem("communityId")}});
      // yield put({type: 'residentType'});//业主身份固定为业主
      yield put({
        type: 'concat',
        payload:{
          id: "",
          info: "",
          groupOption: [],
          buildingOption: [],
          unitOption: [],
          roomOption: [],
          identityTypeOption: [],
          nation: [],
          change_detail: [],
          face: [],
          household_type: [],
          identity_type: [],
          live_detail: [],
          live_type: [],
          marry_status: [],
          labelType: [],
          curType: curType,
          isLong: false,
          curIdentity: ''
          // isRequire: false,
          // change_img: false,
        }
      });
      yield put({ type: 'residentGetNation'});
      yield put({ type: 'residentCommonOptionInfo' });
      yield put({ type: 'houseArea' });
      yield put({
        type: 'labelType', payload: {
          label_type: 2,
          community_id: sessionStorage.getItem("communityId"),
        }
      });
    },
    //详情
    *getDetail({payload}, {call, put}) {
      const { data } = yield call(residentView, payload);
      // if (data.face_url) {
      //   let obj = {
      //     uid: 1,
      //     name: `img`,
      //     status: 'done',
      //     url: data.face_url,
      //   };
      //   data.face_url = obj;
      // }
      yield put({
        type: 'concat',
        payload : {
          info: data,
          curIdentity: data.identity_type
          // isRequire: data && data.face_url ? true : false,
        }
      });
      if (data.time_end == 0) {
        yield put({
          type: 'concat',
          payload : {
            isLong: true
          }
        });
      }
    },
    //基础下拉信息
    *residentCommonOptionInfo({ payload }, { call, put }) {
      const { data } = yield call(residentCommonOptionInfo, payload);
      yield put({
        type: 'concat',
        payload: {
          change_detail: data ? data.change_detail:[],
          face: data ? data.face : [],
          household_type: data ? data.household_type : [],
          identity_type: data ? data.identity_type : [],
          live_detail: data ? data.live_detail : [],
          live_type: data ? data.live_type : [],
          marry_status: data ? data.marry_status : [],
        }
      })
    },
    //民族下拉信息
    *residentGetNation({ payload }, { call, put }) {
      const { data } = yield call(residentGetNation, payload);
      yield put({
        type: 'concat',
        payload: {
          nation: data?data.list:[],
        }
      })
    },
    //获取标签列表
    *labelType({ payload }, { call, put, select }) {
      const { data, code } = yield call(labelType, payload);
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: {
            labelType: data ? data.list : [],
          }
        });
      }
    },
    //获取标签列表
    *houseArea({ payload }, { call, put, select }) {
      const { data, code } = yield call(houseArea, payload);
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: {
            houseArea: data ? data : [],
          }
        });
      }
    },
    // groups
    *getGroup({payload}, {call, put}) {
      const { data } = yield call(group, payload);
      yield put({
        type: 'concat',
        payload : {
          groupOption: data,
        }
      })
    },
    // building
    *buildingList({payload}, {call, put}) {
      const { data } = yield call(building, payload);
      yield put({
        type: 'concat',
        payload : {
          buildingOption: data,
          unitOption:[],
          roomOption:[],
        }
      })
    },
    // units
    *unitList({payload}, {call, put}) {
      const { data } = yield call(unit, payload);
      yield put({
        type: 'concat',
        payload : {
          unitOption: data,
          roomOption:[],
        }
      })
    },
    // rooms
    *roomList({payload}, {call, put}) {
      const { data } = yield call(room, payload);
      yield put({
        type: 'concat',
        payload : {
          roomOption: data,
        }
      })
    },
    //身份类型
    *residentType({payload}, {call, put}) {
      const {data, code} = yield call(residentType);
      if(code == 20000) {
        yield put({
          type: 'concat',
          payload: {
            identityTypeOption: data ? data : [],
          }
        });
      }
    },
    // 新增住户
    *createResidents({payload, callback, err}, {call, put}) {
      const { code } = yield call(createResidents, payload);
      if(code == 20000){
        message.success("新增成功！");
        callback && callback();
      } else {
        err && err()
      }
    },
    *editResidents({payload, callback, err}, {call, put}) {
      const { code } = yield call(editResidents, payload);
      if(code == 20000){
        message.success("编辑成功！");
        callback && callback();
      } else {
        err && err()
      }
    }
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, search }) => {
        if (pathname === '/residentsAdd') {
          let query = queryString.parse(search);
          if(query.id) { // 编辑
            dispatch({type: 'getDetail', payload: {id: query.id}});
          }
          dispatch({ type: 'init', payload: {query: query}});
          dispatch({type: 'concat', payload: {id:query.id, info: ''}});
        }
      });
    }
  }
};
