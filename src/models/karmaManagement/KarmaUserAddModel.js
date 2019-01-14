import { message } from 'antd';
import queryString from 'query-string';
import { getCommunityId } from '../../utils/util';
import KarmaManagementService from '../../services/KarmaManagementService';
export default {
  namespace: 'KarmaUserAddModel',
  state: {
    birthdate: '',
    loading: false,
    info: '',
    communityData: [],
    groupOption: [],
    buildingOption: [],
    unitOption: [],
    roomOption: [],
    karmaDropDow: [],
    karmaUserDropDow: []
  },
  reducers: {
    concat (state, { payload }) {
      return { ...state, ...payload }
    }
  },
  effects: {
    *init ({ payload }, { call, put, select }) {
      yield put({
        type: 'concat',
        payload: {
          info : "",
          buildingOption:[],
          unitOption: [],
          roomOption: [],
          karmaUserDropDow: []
        }
      });
      let id = getCommunityId();
      let query = {
        community_id: id,
        group: '',
        building: '',
        unit: '',
        room:''
      };
      yield put({type: 'communityList', payload: {community_id: id}});
      yield put({type: 'groupList', payload: query});
      yield put({type: 'karmaDropDown', payload: query});
      if (payload.hasOwnProperty('queryId')) {
        yield put({type: 'karmaUserInfo', payload: {id: payload.queryId}})
      }
    },
    *groupList ({ payload }, { call, put, select }) {
      let defaultParam = {};
      payload = Object.assign({}, defaultParam, payload);
      const { data, code } = yield call(KarmaManagementService.getGroupsList, payload);
      if (code === 20000) {
        yield put({
          type: 'concat',
          payload: {
            groupOption: data,
            submitLoading: false
          }
        })
      }
    },
    *buildingList ({ payload }, { call, put, select }) {
      let defaultParam = {};
      payload = Object.assign({}, defaultParam, payload);
      const { data, code } = yield call(KarmaManagementService.getBuildingsList, payload);
      if (code === 20000) {
        yield put({
          type: 'concat',
          payload: {
            buildingOption: data
          }
        })
      }
    },
    *unitList ({ payload }, { call, put, select }) {
      let defaultParam = {};
      payload = Object.assign({}, defaultParam, payload);
      const { data, code } = yield call(KarmaManagementService.getUnitsList, payload);
      if (code === 20000) {
        yield put({
          type: 'concat',
          payload: {
            unitOption: data,
          }
        })
      }
    },
    *roomList ({ payload }, { call, put, select }) {
      let defaultParam = {};
      payload = Object.assign({}, defaultParam, payload);
      const { data, code } = yield call(KarmaManagementService.getRooms, payload);
      if (code === 20000) {
        yield put({
          type: 'concat',
          payload: {
            roomOption: data
          }
        })
      }
    },
    *karmaUserDropDown ({ payload }, { call, put, select }) {
      let defaultParam = {};
      payload = Object.assign({}, defaultParam, payload);
      const { data, code } = yield call(KarmaManagementService.karmaUserDropDownList, payload);
      if (code === 20000) {
        yield put({
          type: 'concat',
          payload: {
            karmaUserDropDow: data.list
          }
        })
      }
    },
    *karmaUserAdd ({ payload, callback, err }, { call, put, select }) {
      let defaultParam = {};
      payload = Object.assign({}, defaultParam, payload);
      yield put({type: 'concat', payload: {loading: true}});
      const { code } = yield call(KarmaManagementService.karmaUserAddReq, payload);
      if (code === 20000) {
        yield put({type: 'concat', payload: { loading: false }});
        message.success("新增成功！");
        callback && callback()
      } else {
        err && err();
      }
    },
    *communityList ({ payload }, { call, put, select }) {
      let defaultParam = {};
      payload = Object.assign({}, defaultParam, payload);
      const { data, code } = yield call(KarmaManagementService.communityChange, payload);
      if (code === 20000) {
        yield put({
          type: 'concat',
          payload: {
            communityData: data.list
          }
        })
      }
    },
    *karmaDropDown ({ payload }, { call, put, select }) {
      let defaultParam = {};
      payload = Object.assign({}, defaultParam, payload);
      const { data, code } = yield call(KarmaManagementService.karmaDropDownList, payload);
      if (code === 20000) {
        yield put({
          type: 'concat',
          payload: {
            karmaDropDow: data.list
          }
        })
      }
    },
    *karmaUserInfo ({ payload }, { call, put, select }) {
      let defaultParam = {};
      payload = Object.assign({}, defaultParam, payload);
      yield put({type: 'concat', payload: {loading: true}});
      const { data, code } = yield call(KarmaManagementService.karmaUserInfoList, payload);
      if (code === 20000) {
        yield put({
          type: 'concat',
          payload: {
            loading: false,
            info: data,
            birthdate: data.birthdate
          }
        });
        let params = {
          community_id: data.community_id,
          group: data.group,
          building: data.building,
          unit: data.unit,
          room: data.room
        };
        yield put({type: 'karmaUserDropDown', payload: params});
        yield put({type: 'buildingList', payload: params});
        yield put({type: 'unitList', payload: params});
        yield put({type: 'roomList', payload: params});
      }
    },
    *karmaUserEdit ( { payload, callback, err }, { call, put, select }) {
      let defaultParam = {};
      payload = Object.assign({}, defaultParam, payload);
      yield put({type: 'concat', payload: { loading: true }});
      const { code } = yield call(KarmaManagementService.karmaUserEditReq, payload);
      if (code === 20000) {
        yield put({type: 'concat', payload: { loading: false }});
        message.success("编辑成功！");
        callback && callback()
      } else {
        err && err()
      }
    }
  },
  subscriptions: {
    setup ({ dispatch, history }) {
      return history.listen(({ pathname, search }) => {
        let query = queryString.parse(search);
        if (pathname === '/karmaUserAdd') {
          if (query.id) {
            dispatch({type: 'init', payload: {queryId: query.id}})
          } else {
            dispatch({type: 'init', payload: {}})
          }
        }
      })
    }
  }
}
