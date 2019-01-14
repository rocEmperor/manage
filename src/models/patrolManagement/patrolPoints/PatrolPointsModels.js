import { message } from 'antd';
import PatrolManagementService from '../../../services/PatrolManagementService';
const initialState = {
  community_id: sessionStorage.getItem("communityId"),
  is_reset:false,
  params: {
    page: 1,
    rows: 10,
    community_id: sessionStorage.getItem("communityId"),
    name: '',
    need_location: '',
    need_photo: '',
  },
  list: [],
  paginationTotal: '',
  positionType: [],
  photoType: []
};
export default {
  namespace: 'PatrolPoints',
  state: {...initialState},
  reducers: {
    concat(state, { payload }) {
      return { ...state, ...payload };
    }
  },
  effects: {
    *init({ payload }, { call, put, select }) {
      yield put({type: 'concat', payload: {...initialState}});
      let PatrolPoints = yield select(state => state.PatrolPoints);
      let { params } = PatrolPoints;
      params.community_id = sessionStorage.getItem("communityId");
      yield put({
        type: 'concat',
        payload: {
          is_reset:true,
          params: params
        }
      });
      yield put({
        type: 'getPointsList', payload: {
          community_id:sessionStorage.getItem("communityId"),
          page: 1,
          rows: 10,
          name: '',
          need_location: '',
          need_photo: '',
        }
      });
      yield put({
        type: 'getLocation',
        payload: {}
      });
      yield put({
        type: 'getPhoto',
        payload: {}
      });
    },
    *getPointsList({ payload }, { call, put, select }) {
      const params = yield select(state => state.PatrolPoints.params);
      const newParams = Object.assign(params, payload);
      const { data, code } = yield call(PatrolManagementService.pointsList, params);
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: {
            list: data.list,
            paginationTotal: data.totals,
            params: newParams
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
    *getPointsDelete({ payload }, { call, put, select }) {
      const { code } = yield call(PatrolManagementService.pointsDelete, payload);
      if (code == 20000) {
        message.success('删除成功！');
        yield put({
          type: 'getPointsList', payload: {
            page: 1,
            rows: 10,
            name: '',
            need_location: '',
            need_photo: '',
          }
        });
      }
    },
    *downFiles({ payload, callback }, { call, put, select }) {
      const { data, code } = yield call(PatrolManagementService.pointsDownload, payload);
      if(code == 20000){
        yield put({
          type: 'concat',
          payload: {
            
          }
        })
      }
      callback&&callback(data.down_url);
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, search }) => {
        if (pathname === '/patrolPoints') {
          dispatch({ type: 'init' });
        }
      });
    }
  },
};
