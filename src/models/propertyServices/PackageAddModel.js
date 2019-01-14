import {message} from 'antd';
import queryString from 'query-string';
import PropertyServices from './../../services/PropertyServices.js';
export default {
  namespace : 'PackageAddModel',
  state : {
    id: '',
    info: "",
    expressCompany: [],
    groupOption: [],
    buildingOption: [],
    unitOption: [],
    roomOption: [],
    noteList:[]
  },
  reducers : {
    concat(state, {payload}) {
      return {
        ...state,
        ...payload
      }
    }
  },
  effects : {
    *init({
      payload
    }, {call, put}) {
      yield put({type: 'packageDelivery'});
      yield put({type: 'packageNoteList'});
      yield put({
        type: 'getGroup',
        payload: {
          community_id: sessionStorage.getItem("communityId")
        }
      });
    },
    //详情
    *guideDeteil({payload}, {call, put}){
      const { data } = yield call(PropertyServices.packageDetail, payload);
      yield put({
        type: 'concat',
        payload : {
          info: data.detail,
        }
      })
    },
    
    *packageDelivery({
      payload
    }, {call, put}) {
      const {data, code} = yield call(PropertyServices.packageDelivery, payload);
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: {
            expressCompany: data.delivery
          }
        })
      }
    },
    *getGroup({
      payload
    }, {call, put}) {
      const { data } = yield call(PropertyServices.group, payload);
      yield put({
        type: 'concat',
        payload: {
          groupOption: data,
        }
      })
    },
    *buildingList({
      payload
    }, {call, put}) {
      const {data} = yield call(PropertyServices.building, payload);
      yield put({
        type: 'concat',
        payload: {
          buildingOption: data
        }
      })
    },
    *unitList({
      payload
    }, {call, put}) {
      const {data} = yield call(PropertyServices.unit, payload);
      yield put({
        type: 'concat',
        payload: {
          unitOption: data
        }
      })
    },
    *roomList({
      payload
    }, {call, put}) {
      const {data} = yield call(PropertyServices.room, payload);
      yield put({
        type: 'concat',
        payload: {
          roomOption: data
        }
      })
      //console.log(data)
    },
    //快递备注
    *packageNoteList({payload}, {call, put}){
      const {data,code} = yield call(PropertyServices.packageNote, payload);
      if(code==20000){
        yield put({
          type: 'concat',
          payload: {
            noteList:data.note
          }
        })
      }
    },
    //包裹新增
    *packageCreate({payload},{call, put}){
      const { code } = yield call(PropertyServices.packageCreate, payload);
      if(code == 20000){
        message.success("新增成功！");
        setTimeout(() => {
          history.go(-1);
        },2000)
      }
    },
    //编辑
    *packageEdit({payload}, {call, put}){
      const { code } = yield call(PropertyServices.packageEdit, payload);
      if(code == 20000){
        message.success("编辑成功！");
        setTimeout(() => {
          history.go(-1);
        },2000)
      }
    }
  },
  subscriptions : {
    setup({dispatch, history}) {
      return history.listen(({pathname, search}) => {
        if (pathname === '/packageAdd') {
          let query = queryString.parse(search);
          if (query.id) { //编辑
            dispatch({
              type: 'guideDeteil',
              payload: {
                id: query.id,
                community_id: sessionStorage.getItem("communityId")
              }
            });
          }
          dispatch({type: 'init'});
          dispatch({
            type: 'concat',
            payload: {
              id: query.id,
              info: '',
              community_id:sessionStorage.getItem("communityId")
            }
          });
        }
      })
    }
  }
}
