import { message } from 'antd';
import queryString from 'query-string';
import DeviceInspectService from '../../services/DeviceInspectService';

export default {
  namespace: 'InspectLineAdd',
  state: {
    community_id: sessionStorage.getItem("communityId"),
    id: '',
    detail: {},
    mockData: [],
    targetKeys: [],
  },
  reducers: {
    concat(state, { payload }) {
      return { ...state, ...payload };
    }
  },
  effects: {
    *init({ payload }, { call, put, select }) {
      const community_id = sessionStorage.getItem("communityId");
      yield put({
        type: 'concat',
        payload: {
          community_id: community_id,
        }
      });
      yield put({
        type: 'pointsDropDown',
        payload: { community_id }
      });
    },
    *pointsDropDown({ payload }, { call, put, select }) {
      const { data, code } = yield call(DeviceInspectService.pointsDropDown, payload);
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: {
            mockData: data?data:[]
          }
        });
      }
    },
    *getLineDetail({ payload }, { call, put, select }) {
      const { data, code } = yield call(DeviceInspectService.lineDetail, payload);
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: {
            detail: data,
            targetKeys: data.pointList.map(item => item.key)
          }
        });
      }
    },
    *getLineAdd({ payload }, { call, put, select }) {
      const { code } = yield call(DeviceInspectService.lineAdd, payload);
      if (code == 20000) {
        message.success('新增成功！');
        setTimeout(() => {
          location.href = "#/inspectLineManagement";
        }, 1000)
      }
    },
    *getLineEdit({ payload }, { call, put, select }) {
      const { code } = yield call(DeviceInspectService.lineEdit, payload);
      if (code == 20000) {
        message.success('编辑成功！');
        setTimeout(() => {
          location.href = "#/inspectLineManagement";
        }, 1000)
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
              mockData: [],
              targetKeys: [],
            }
          })
        }
        if (pathname === '/inspectLineAdd') {
          initData();
          if (query.id) {
            dispatch({ type: 'getLineDetail', payload: { id: query.id, community_id:sessionStorage.getItem("communityId")} });
          }
        }
      });
    }
  },
};
