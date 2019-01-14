import queryString from 'query-string';
import VoteService from '../../services/VoteService';

export default {
  namespace: 'DoVoteModel',
  state: {
    current: 1,
    vote_id: '',
    member_id: '',
    room_id: '',
    community_id: '',
    mobile: '',
    visible: false,
    loading: false,
    data: {},
    member_info: {},
    groupData: [],
    buildingData: [],
    unitData: [],
    roomData: [],
    owner: {}
  },
  reducers: {
    concat (state, { payload }) {
      return { ...state, ...payload }
    }
  },
  effects: {
    *init ({ payload }, { call, put, select }) {
      let queryList = {
        community_id: '',
        group: '',
        building: '',
        room: '',
        unit: ''
      };
      let { query } = payload;
      yield put({
        type: 'concat',
        payload: {
          vote_id: query.id,
          member_id: query.m || '',
          room_id: query.r || '',
          community_id: query.c,
        }
      });
      let DoVoteModel = yield select(state => state.DoVoteModel);
      yield put({
        type: 'voteShowDet',
        payload: {
          vote_id: DoVoteModel.vote_id,
          member_id: DoVoteModel.member_id || 0,
          room_id: DoVoteModel.room_id || 0
        }
      });
      if (!DoVoteModel.member_id) {
        queryList.community_id = DoVoteModel.community_id;
        yield put({
          type: 'groupList',
          payload: queryList
        })
      }
    },
    *voteShowDet ({ payload }, { call, put, select }) {
      let defaultParam = {};
      payload = Object.assign({}, defaultParam, payload);
      yield put({
        type: 'concat',
        payload: { loading: true }
      });
      const { data, code } = yield call(VoteService.voteShowDetReq, payload);
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: {
            loading: false,
            data: data,
            member_info: data.member_info || {},
            owner: {}
          }
        })
      }
    },
    *voteDo ({ payload }, { call, put, select }) {
      let defaultParam = {};
      payload = Object.assign({}, defaultParam, payload);
      const { code } = yield call(VoteService.voteDoReq, payload);
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: { visible: true }
        })
      }
    },
    *groupList ({ payload }, { call, put, select }) {
      let defaultParam = {};
      payload = Object.assign({}, defaultParam, payload);
      const { data, code } = yield call(VoteService.getGroupsList, payload);
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: {
            groupData: data,
            owner: {}
          }
        })
      }
    },
    *buildingList ({ payload }, { call, put, select }) {
      let defaultParam = {}
      payload = Object.assign({}, defaultParam, payload);
      const { data, code } = yield call(VoteService.getBuildingsList, payload);
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: {
            buildingData: data,
            owner: {}
          }
        })
      }
    },
    *unitList ({ payload }, { call, put, select }) {
      let defaultParam = {}
      payload = Object.assign({}, defaultParam, payload);
      const { data, code } = yield call(VoteService.getUnitsList, payload);
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: {
            unitData: data,
            owner: {}
          }
        })
      }
    },
    *roomList ({ payload }, { call, put, select }) {
      let defaultParam = {}
      payload = Object.assign({}, defaultParam, payload);
      const { data, code } = yield call(VoteService.getRoomsList, payload);
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: {
            roomData: data,
            owner: {}
          }
        })
      }
    },
    *houseSourceGetOwner ({ payload }, { call, put, select }) {
      let defaultParam = {}
      payload = Object.assign({}, defaultParam, payload);
      yield put({ type: 'concat', payload: { loading: true } });
      const { data, code } = yield call(VoteService.houseSourceGetOwnerReq, payload);
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: {
            loading: false,
            owner: data
          }
        })
      }
    }
  },
  subscriptions: {
    setup ({ dispatch, history }) {
      return history.listen(({ pathname, search }) => {
        let query = queryString.parse(search);
        if (pathname === '/doVote') {
          dispatch({
            type: 'init',
            payload: { query: query }
          })
        }
      })
    }
  }
}
