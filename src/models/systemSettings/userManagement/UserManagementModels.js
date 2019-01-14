import SystemSettingsService from '../../../services/SystemSettingsService';
import { message } from 'antd';
const initialState = {
  is_reset:false,
  loading: false,
  params: {
    page: 1,
    rows: 10,
    name:'',
    group_id:'',
    community_id: sessionStorage.getItem("communityId")
  },
  list: [],
  groupList:[],
  paginationTotal: '',
  managerId: ''
};
export default {
  namespace: 'UserManagement',
  state: {...initialState},
  reducers: {
    concat(state, { payload }) {
      return { ...state, ...payload };
    }
  },
  effects: {
    *init({ payload }, { call, put, select }) {
      yield put({type: 'concat', payload: {...initialState}});
      let UserManagement = yield select(state => state.UserManagement);
      let { params } = UserManagement;
      params.community_id = sessionStorage.getItem("communityId");
      yield put({type: 'getManageManages', payload: {
        page: 1,
        rows: 10,
        name:'',
        group_id:'',
        community_id: sessionStorage.getItem("communityId")
      }});
      yield put({
        type: 'getGroups',
        payload:{}
      });
      yield put({ type: 'concat', payload: {
        is_reset:true,
        params: params
      } });
    },
    *getManageManages({ payload }, { call, put, select }) {
      const params = yield select(state => state.UserManagement.params);
      const newParams = Object.assign(params, payload);
      const { data, code } = yield call(SystemSettingsService.manageManages, params);
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: {
            list: data.list,
            paginationTotal: data.totals,
            managerId: data.manager_id,
            params: newParams,
            loading: false,
          }
        });
      }
    },
    *getGroups({ payload },{ call, put, select }){
      const { data, code } = yield call(SystemSettingsService.getGroups,payload);
      if(code == 20000){
        let str = JSON.stringify(data.list);
        let str1 = str.replace(/value/g, 'label');
        let str2 = str1.replace(/id/g, 'value');
        let arr = JSON.parse(str2);
        yield put({
          type: 'concat',
          payload: {
            groupList: arr,
            unfoldList:arr?[arr[0].value]:[]
          }
        })
      }
    },
    *getChangeManage({ payload }, { call, put, select }) {
      const { code } = yield call(SystemSettingsService.changeManage, payload);
      if (code == 20000) {
        yield put({
          type: 'getManageManages', payload: {
            page: 1,
            rows: 10,
            name: '',
            group_id:'',
          }
        });
      }
    },
    *getDeleteManage({ payload },{ call, put }){
      const { code } = yield call(SystemSettingsService.getDeleteManage,payload);
      if(code == 20000){
        message.success('删除成功！');
        yield put({
          type: 'getManageManages',
          payload: { page: 1, rows: 10 }
        });
      }
    }
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, search }) => {
        if (pathname === '/userManagement') {
          dispatch({ type: 'init' });
        }
      });
    }
  },
};
