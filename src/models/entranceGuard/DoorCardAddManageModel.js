import { message } from 'antd';
import EntranceGuardService from '../../services/EntranceGuardService';
import queryString from 'query-string';

export default {
  namespace: 'DoorCardAddManage',
  state: {
    arrData:[{
      key:1,
      name:'',
    }],
    key: 1,
    addVisible:true,
    mockData:[],
    targetKeys:[],
    id: '',
    info: "",
    group:"",
    building:"",
    carType:[],
    params: {
      page: 1,
      rows: 10,
      community_id: sessionStorage.getItem("communityId")
    },
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
          params: {
            page: 1,
            rows: 10,
            community_id: sessionStorage.getItem("communityId")
          },
        }
      });
      yield put({ type: 'doorCarType', payload: { community_id: sessionStorage.getItem("communityId") } });
      yield put({ type: 'authList', payload: { community_id: sessionStorage.getItem("communityId") } });
    },
    
    *doorCarDetail({ payload }, { call, put }) {
      const { data, code } = yield call(EntranceGuardService.doorCarDetail, payload);
      let arr = [];
      arr.push({
        name:data.card_num,
        key:1,
      })
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: {
            info: data,
            arrData: arr,
            targetKeys: data.devices_id.map(item => item.id)
          }
        });
      }
    },
    
    // doorCardAdd
    *doorCardAdd({ payload }, { call, put }) {
      const { code } = yield call(EntranceGuardService.doorCardAdd, payload);
      if (code == 20000) {
        message.success("新增成功！");
        setTimeout(() => {
          history.go(-1);
        }, 2000)
      }
    },
    // doorCardEdit
    *doorCardEdit({ payload }, { call, put }) {
      const { code } = yield call(EntranceGuardService.doorCardEdit, payload);
      if (code == 20000) {
        message.success("编辑成功！");
        setTimeout(() => {
          history.go(-1);
        }, 2000)
      }
    },
    // 门卡类型
    *doorCarType({ payload }, { call, put }) {
      const { data } = yield call(EntranceGuardService.doorCarType, payload);
      yield put({
        type: 'concat',
        payload: {
          carType: data,
        }
      })
    },
    // 授权门禁列表
    *authList({ payload }, { call, put }) {
      const { data } = yield call(EntranceGuardService.authList, payload);
      yield put({
        type: 'concat',
        payload: {
          mockData: data,
        }
      })
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, search }) => {
        let query = queryString.parse(search);
        if (pathname === '/doorCardAddManage') {
          if (query.id) {
            dispatch({type: 'init', payload: {id: query.id}});
            dispatch({type: 'doorCarDetail',payload:{id:query.id}});
            dispatch({type: 'concat',payload: {id: query.id,info:''}});
          } else {
            dispatch({type: 'init', payload: {}});
            dispatch({type: 'concat',payload: {id: '',info:'', arrData:[{
              key:1,
              name:'',
            }],addVisible: true,targetKeys:[]}});
          }
        }
      });
    }
  }
}