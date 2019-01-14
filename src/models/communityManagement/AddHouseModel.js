import CommunityManagementService from './../../services/CommunityManagementService';
import { message } from 'antd';
const { houseCreate, floorLiftList, houseView, labelType,groupList,buildingList,unitList } = CommunityManagementService;
import queryString from 'query-string';

export default {
  namespace: 'AddHouseModel',
  state: {
    loading:false,
    floorList: [],
    liftList: [],
    groupId:'',
    type: '',
    id: '',
    info:'',
    labelType:[],
    groupData:[],
    buildingData:[],
    unitData:[],
    building:'',
    unit:'',
    options:[],
  },
  reducers: {
    concat(state, { payload }) {
      return { ...state, ...payload };
    }
  },
  effects: {
    *init({ payload }, { call, put }) {
      yield put({
        type: 'concat',
        payload: {
          info: ''
        }
      });
      yield put({
        type:"getGroupList",
        payload:{
          //community_id: sessionStorage.getItem("communityId"),  
        }
      })
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
    *getGroupList({ payload },{ call,put }){
      const { code,data } = yield call(groupList, payload);
      if(code == 20000){
        yield put({
          type: 'concat',
          payload: {
            groupData: data&&Array.isArray(data)?data:[],
          }
        });
      }
    },
    *getBuildingList({ payload },{ call,put }){
      const { code,data } = yield call(buildingList, payload);
      //console.log(data,'data')
      let group = JSON.stringify(data&&Array.isArray(data)?data:[]);
      let group1 = group.replace(/building_name/g, 'label');
      let group2 = group1.replace(/building_id/g, 'value');
      let groupArr = JSON.parse(group2);
      groupArr.map((value,index)=>{
        return Object.assign(value,{'isLeaf':false},)
      })
      if(code == 20000){
        yield put({
          type: 'concat',
          payload: {
            buildingData: groupArr&&Array.isArray(groupArr)?groupArr:[],
          }
        });
      }
    },
    *getUnitList({ payload,callBack },{ call,put }){
      const { code,data } = yield call(unitList, payload);
      let unit = JSON.stringify(data&&Array.isArray(data)?data:[]);
      let unit1 = unit.replace(/unit_name/g, 'label');
      let unit2 = unit1.replace(/unit_id/g, 'value');
      let unitArr = JSON.parse(unit2);
      //console.log(unitArr,'unitArr')
      if(code == 20000){
        yield put({
          type: 'concat',
          payload: {
            unitData: unitArr&&Array.isArray(unitArr)?unitArr:[],
          }
        });
        callBack&&callBack(unitArr&&Array.isArray(unitArr)?unitArr:[])
      }
    },
    *info({ payload }, { call, put }) {
      const { data,code } = yield call(houseView, payload);
      let dataInfo=[]
      dataInfo.push({
        value: data.list?data.list.building_id:'',
        label: data.list?data.list.building:'',
        children: [{
          value: data.list?data.list.unit_id:'',
          label: data.list?data.list.unit:'',
        }],
      })
      if(code == 20000){
        yield put({
          type: 'concat',
          payload: {
            info: data.list,
            buildingData:dataInfo,
            options:[data.list?data.list.building_id:'',data.list?data.list.unit_id:'']
          }
        });
      }
    },
    *houseCreate({ payload, callback, err }, { call, put }) {
      const { code } = yield call(houseCreate, payload);
      if(code == 20000){
        if(payload.id == undefined){
          message.success("新增成功！");
        }else{
          message.success("编辑成功！");
        }
        callback && callback();
      } else {
        err && err()
      }
    },
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
    *floorLiftList({ payload }, { call, put, select }) {
      const { data,code } = yield call(floorLiftList, payload);
      if(code == 20000){
        if(payload.shared_type==2){
          yield put({
            type: 'concat',
            payload: {
              floorList: data?data.list:[],
            }
          });
        }else if(payload.shared_type==1){
          yield put({
            type: 'concat',
            payload: {
              liftList: data?data.list:[],
            }
          });
        }

      }
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, search }) => {
        if (pathname === '/addHouse') {
          let query = queryString.parse(search);
          dispatch({ type: 'init'});
          if(query.id){
            dispatch({type: 'concat', payload: {id:query.id}});
            dispatch({ type: 'info', payload:{out_room_id:query.id}});
          }else{
            dispatch({type: 'concat', payload: {buildingData:[],options:[],id:'', info: ''}});
          }
        }
      });
    }
  },
};
