import { message } from 'antd';
import queryString from 'query-string';
import SystemSettingsService from '../../../services/SystemSettingsService';
const initialState = {
  id: '',
  section_checked:'',
  infoSendType:[],
  info: {},
  menus: [],
  menuChecked: {},
  disabled:false,
  groupList:[],
}
export default {
  namespace: 'GroupManagementAddEdit',
  state: {...initialState},
  reducers: {
    concat(state, { payload }) {
      return { ...state, ...payload };
    }
  },
  effects: {
    *init({ payload }, { call, put, select }) {
      yield put({type: 'concat', payload: {...initialState}});
      yield put({
        type: 'getMenus',
        payload: {}
      });
      yield put({
        type: 'getGroups',
        payload:{}
      });
    },
    *getMenus({ payload }, { call, put, select }) {
      const { data, code } = yield call(SystemSettingsService.getMenus, payload);
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: {
            menus: data
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
        let str3 = str2.replace(/select/g,'disabled')
        let arr = JSON.parse(str3);
        yield put({
          type: 'concat',
          payload: {
            groupList: arr,
            unfoldList:arr?[arr[0].value]:[]
          }
        })
      }
    },
    *getShowManage({ payload }, { call, put, select }) {
      const { data, code } = yield call(SystemSettingsService.showManage, payload);
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: {
            info: data,
            disabled:data.see_limit==0?false:true,
            section_checked:data.see_limit,
            infoSendType:data.see_group_id,
          }
        });
      }
    },
    *getAddManage({ payload, callback, err }, { call, put, select }) {
      const { code } = yield call(SystemSettingsService.addManage, payload);
      if (code == 20000) {
        message.success('新增成功！');
        callback && callback()
      } else {
        err && err()
      }
    },
    *getEditManage({ payload, callback, err }, { call, put, select }) {
      const { code } = yield call(SystemSettingsService.editManage, payload);
      if (code == 20000) {
        message.success('编辑成功！');
        callback && callback()
      } else {
        err && err()
      }
    }
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, search }) => {
        const query = queryString.parse(search);
        function initData() {
          dispatch({ type:'init'});
          dispatch({
            type: 'concat', payload: {
              id: query.id,
              info: {},
              menus: [],
              section_checked:'',
              infoSendType:[],
            }
          })
        }
        if (pathname === '/groupManagementAdd') {
          initData();
        } else if (pathname === '/groupManagementEdit') {
          initData();
          if (query.id) {
            dispatch({ type: 'getShowManage', payload: { group_id: query.id } });
          }

        }
      });
    }
  },
};
