import queryString from 'query-string';
import VoteService from '../../services/VoteService';

export default {
  namespace: 'VoteInfoModel',
  state: {
    current: 1,
    loading: false,
    data: {},
    total: {},
    groupData: [],
    buildingData: [],
    unitData: [],
    roomData: [],
    vote_channel: [],
    down_url: ''
  },
  reducers: {
    concat (state, { payload }) {
      return { ...state, ...payload }
    }
  },
  effects: {
    *init ({ payload }, { call, put, select }) {
      let { query } = payload;
      let id = query.id;
      let type = query.type;
      let community_id = query.c;
      let queryList = {
        community_id: '',
        group: '',
        building: '',
        room: '',
        unit: ''
      };
      queryList.community_id = community_id;
      yield put({
        type: 'concat',
        payload: {
          vote_id: id,
          vote_type: type,
          community_id: community_id
        }
      });
      yield put({type: 'voteShowMember', payload: { vote_id: id }});
      yield put({type: 'groupList', payload: queryList});
      yield put({type: 'voteGetComm'});
    },
    *voteShowMember ({ payload }, { call, put, select }) {
      let defaultParam = { page:1, rows:10 };
      payload = Object.assign({}, defaultParam, payload);
      yield put({type: 'concat', payload: { loading: true }});
      const { data, code } = yield call(VoteService.voteShowMemberReq, payload);
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: {
            loading: false,
            data: data,
            total: data.all_total
          }
        })
      }
    },
    *groupList ({ payload }, { call, put, select }) {
      let defaultParam = {}
      payload = Object.assign({}, defaultParam, payload);
      const { data, code } = yield call(VoteService.getGroupsList, payload);
      if (code == 20000) {
        yield put({type: 'concat', payload: { groupData: data }})
      }
    },
    *voteGetComm ({ payload }, { call, put, select }) {
      let defaultParam = {};
      payload = Object.assign({}, defaultParam, payload);
      yield put({type: 'concat', payload: { loading: true }});
      const { data, code } = yield call(VoteService.voteGetCommList, payload);
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: {
            loading: false,
            vote_channel: data.vote_channel
          }
        })
      }
    },
    *downLoadData ({ payload,callback }, { call, put, select }) {
      const { data, code } = yield call(VoteService.downLoadDataReq, payload);
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: { 

          }
        })
        callback&&callback(data.down_url);
      }
    },
    *buildingList ({ payload }, { call, put, select }) {
      let defaultParam = {};
      payload = Object.assign({}, defaultParam, payload);
      const { data, code } = yield call(VoteService.getBuildingsList, payload);
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: { buildingData: data }
        })
      }
    },
    *unitList ({ payload }, { call, put, select }) {
      let defaultParam = {};
      payload = Object.assign({}, defaultParam, payload);
      const { data, code } = yield call(VoteService.getUnitsList, payload);
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: { unitData: data }
        })
      }
    },
    *roomList ({ payload }, { call, put, select }) {
      let defaultParam = {};
      payload = Object.assign({}, defaultParam, payload);
      const { data, code } = yield call(VoteService.getRoomsList, payload);
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: { roomData: data }
        })
      }
    },
    *downFiles({ payload, callback }, { call, put, select }) {
      const { data, code } = yield call(VoteService.voteDataExportVote, payload);
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
    setup ({ dispatch, history }) {
      return history.listen(({ pathname, search }) => {
        let query = queryString.parse(search);
        if (pathname === '/voteInfo') {
          dispatch({
            type: 'init',
            payload: { query: query }
          })
        }
      })
    }
  }
}
