import { message } from 'antd';
import queryString from 'query-string';
import SystemSettingsService from '../../../services/SystemSettingsService';
let initialState = {
  id: "",
  group_id: "",
  detail: {},
  groupList: [],
  menuChecked: {},
  userMenus: [],
  groupMenuList: [],
  userCommunities: [],
  checkedKeys: [],
}
export default {
  namespace: 'UserManagementAddEdit',
  state: { ...initialState },
  reducers: {
    concat(state, { payload }) {
      return { ...state, ...payload };
    }
  },
  effects: {
    *init({ payload }, { call, put, select }) {
      yield put({type: 'concat', payload: { ...initialState }})
      yield put({ type: 'getCommunitys', payload: {} });
      yield put({ type: 'getMenus', payload: {} });
      yield put({ type: 'getGroups', payload: {} });
    },
    *getMenus({ payload }, { call, put, select }) {
      const { data, code } = yield call(SystemSettingsService.getMenus, payload);
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: {
            userMenus: data
          }
        });
      }
    },
    *getGroups({ payload }, { call, put, select }) {
      const { data, code } = yield call(SystemSettingsService.getGroups, payload);
      if (code == 20000) {
        let str = JSON.stringify(data.list);
        let str1 = str.replace(/value/g, 'label');
        let str2 = str1.replace(/id/g, 'value');
        let str3 = str2.replace(/select/g,'disabled')
        let arr = JSON.parse(str3);
        yield put({
          type: 'concat',
          payload: {
            groupList: arr,
            unfoldList:arr?[arr[0].value]:[]
          }
        });
      }
    },
    *getCommunitys({ payload }, { call, put, select }) {
      const { data, code } = yield call(SystemSettingsService.getCommunitys, payload);
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: {
            userCommunities: data
          }
        });
      }
    },
    *getShowManage({ payload }, { call, put, select }) {
      const { data, code } = yield call(SystemSettingsService.showManage, payload);
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: {
            groupMenuList: data.menu_list
          }
        });
      }
    },
    *getManageShowManage({ payload }, { call, put, select }) {
      const { data, code } = yield call(SystemSettingsService.manageShowManage, payload);
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: {
            detail: data,
            checkedKeys: data.communitys ? data.communitys.map((val, index) => val.id) : []
          }
        });
      }
    },
    *getManageEditManage({ payload, callback, err }, { call, put, select }) {
      const { code } = yield call(SystemSettingsService.manageEditManage, payload);
      if (code == 20000) {
        message.success('编辑成功！');
        callback && callback ();
      } else {
        err && err()
      }
    },
    *getManageAddManage({ payload, callback, err }, { call, put, select }) {
      const { code } = yield call(SystemSettingsService.manageAddManage, payload);
      if (code == 20000) {
        message.success('新增成功！');
        callback && callback();
      } else {
        err && err();
      }
    }
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, search }) => {
        const query = queryString.parse(search);
        function initData() {
          dispatch({ type: 'init' });
          dispatch({
            type: 'concat', payload: {
              id: query.id,
              group_id: query.group_id,
              detail: {},
              checkedKeys: []
            }
          })
        }
        if (pathname === '/userManagementAdd') {
          initData();
        } else if (pathname === '/userManagementEdit') {
          initData();
          if (query.id && query.group_id) {
            dispatch({ type: 'getShowManage', payload: { group_id: query.group_id } });
            dispatch({ type: 'getManageShowManage', payload: { user_id: query.id } });
          }
        }
      });
    }
  },
};
