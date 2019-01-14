import { message } from 'antd';
import queryString from 'query-string';
import EntranceGuardService from '../../services/EntranceGuardService';
let initialState = {
  id: "",
  group_id: "",
  detail: {},
  groupList: [],
  menuChecked: {},
  deviceType:'',
  userMenus: [],
  groupMenuList: [],
  supplierOption:[],
  typeOption:[],
  userCommunities: [],
  checkedKeys: [],
}
export default {
  namespace: 'DoorAdd',
  state: { ...initialState },
  reducers: {
    concat(state, { payload }) {
      return { ...state, ...payload };
    }
  },
  effects: {
    *init({ payload }, { call, put, select }) {
      yield put({type: 'concat', payload: { ...initialState }})
      // 供应商列表
      yield put({
        type: 'getSupplierOption', payload: {
          community_id: sessionStorage.getItem("communityId")
        }
      });

      // 门禁权限
      yield put({
        type: 'getPermissionsOption', payload: {
          community_id: sessionStorage.getItem("communityId")
        }
      });
    },
    *getSupplierOption({ payload }, { call, put, select }) {
      const { data, code } = yield call(EntranceGuardService.getSupplierOption, payload);
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: {
            supplierOption: data.supplier,
            typeOption: data.device
          }
        })
      }
    },
    *getPermissionsOption({ payload }, { call, put, select }) {
      const { data, code } = yield call(EntranceGuardService.getPermissionsOption, payload);
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: {
            userMenus: data
          }
        });
      }
    },
    
    *doorDetail({ payload }, { call, put, select }) {
      const { data, code } = yield call(EntranceGuardService.doorDetail, payload);
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: {
            detail: data,
            groupMenuList: data.permission,
            checkedKeys: data.permission ? data.permission.map((val, index) => val.key) : [],
            deviceType: data.type
          }
        });
      }
    },
    *doorEdit({ payload, callback, err }, { call, put, select }) {
      const { code } = yield call(EntranceGuardService.doorEdit, payload);
      if (code == 20000) {
        message.success('编辑成功！');
        callback && callback ();
      } else {
        err && err()
      }
    },
    *doorAdd({ payload, callback, err }, { call, put, select }) {
      const { code } = yield call(EntranceGuardService.doorAdd, payload);
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
              detail: {},
              checkedKeys: []
            }
          })
        }
        if (pathname === '/doorAdd') {
          initData();
          if (query.id) {
            dispatch({ type: 'doorDetail', payload: { id: query.id } });
          }
        }
      });
    }
  },
};
