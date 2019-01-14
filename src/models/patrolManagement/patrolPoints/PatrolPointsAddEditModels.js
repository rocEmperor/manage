import { message } from 'antd';
import queryString from 'query-string';
import PatrolManagementService from '../../../services/PatrolManagementService';

export default {
  namespace: 'PatrolPointsAddEdit',
  state: {
    id: '',
    pointsdetail: {},
    show: '',
    cityName: '杭州市',
    modalType: "2",
    location_name: '',
    map: '',
    community_id: sessionStorage.getItem("communityId"),
    positionType: [],
    photoType: []
  },
  reducers: {
    concat(state, { payload }) {
      return { ...state, ...payload };
    }
  },
  effects: {
    *init({ payload }, { call, put, select }) {
      yield put({
        type: 'getLocation',
        payload: {}
      });
      yield put({
        type: 'getPhoto',
        payload: {}
      });
    },
    *getPointsDetail({ payload }, { call, put, select }) {
      const { data, code } = yield call(PatrolManagementService.pointsDetail, payload);
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: {
            pointsdetail: data,
            modalType: data.need_location,
            map: data.lon + ',' + data.lat,
            location_name: data.location_name
          }
        });
      }
    },
    *getLocation({ payload }, { call, put, select }) {
      const { data, code } = yield call(PatrolManagementService.getLocation, payload);
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: {
            positionType: data
          }
        });
      }
    },
    *getPhoto({ payload }, { call, put, select }) {
      const { data, code } = yield call(PatrolManagementService.getPhoto, payload);
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: {
            photoType: data
          }
        });
      }
    },
    *getPointsAdd({ payload }, { call, put, select }) {
      const { code } = yield call(PatrolManagementService.pointsAdd, payload);
      if (code == 20000) {
        message.success('新增成功！');
        setTimeout(() => {
          location.href = "#/patrolPoints";
        }, 1000)
      }
    },
    *getPointsEdit({ payload }, { call, put, select }) {
      const { code } = yield call(PatrolManagementService.pointsEdit, payload);
      if (code == 20000) {
        message.success('编辑成功！');
        setTimeout(() => {
          location.href = "#/patrolPoints";
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
              id: query.id, pointsdetail: {}, modalType: "", map: "", location_name: ""
            }
          })
        }
        if (pathname === '/patrolPointsAdd') {
          initData();
        } else if (pathname === '/patrolPointsEdit') {
          initData();
          if (query.id) {
            dispatch({ type: 'getPointsDetail', payload: { id: query.id } });
          }
        }
      });
    }
  },
};
