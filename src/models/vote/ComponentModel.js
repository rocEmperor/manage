import VoteService from '../../services/VoteService';
export default {
  namespace: 'ComponentModel',
  state: {
    community_id: sessionStorage.getItem("communityId"),
    totals: 0,
    data: [],
    groupData: [],
    buildingData: [],
    unitData: [],
    roomData: [],
    loading: false,
    identityType:[]
  },
  reducers: {
    concat (state, { payload }) {
      return { ...state, ...payload }
    }
  },
  effects: {
    *init (payload, { call, put, select }) {
      const community_id = sessionStorage.getItem("communityId");
      yield put({
        type: 'getList2',payload:{community_id:community_id}
      })
      yield put({
        type: 'concat', payload: { community_id: community_id }
      })
    },
    *getList2 ({ payload }, { call, put, select }) {
      let defaultParam = { page: 1, rows: 10 }
      payload = Object.assign({}, defaultParam, payload);
      yield put({
        type: 'concat',
        payload: {
          loading: true
        }
      });
      const { data, code } = yield call(VoteService.voteGetResidentList, payload);
      if (code === 20000) {
        yield put({
          type: 'concat',
          payload: {
            loading: false,
            totals: data.totals ? data.totals - 0 : 0,
            data: data.list
          }
        })
      }
    },
    *residentList ({ payload }, { call, put, select }) {
      const { data, code } = yield call(VoteService.residentTypeListReq, payload)
      if (code == 20000) {
        yield put({type: 'concat', payload: { identityType: data }})
      }
    },
    *groupList ({ payload }, { call, put, select }) {
      let defaultParam = {}
      payload = Object.assign({}, defaultParam, payload);
      const { data, code } = yield call(VoteService.getGroupsList, payload)
      if (code == 20000) {
        yield put({type: 'concat', payload: {groupData: data}})
      }
    },
    *buildingList ({ payload }, { call, put, select }) {
      let defaultParam = {}
      payload = Object.assign({}, defaultParam, payload);
      const { data, code } = yield call(VoteService.getBuildingsList, payload);
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: {buildingData: data}
        })
      }
    },
    *unitList ({ payload }, { call, put, select }) {
      let defaultParam = {}
      payload = Object.assign({}, defaultParam, payload);
      const { data, code } = yield call(VoteService.getUnitsList, payload);
      if (code == 20000) {
        yield put({type: 'concat', payload: {unitData: data}})
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
            roomData: data
          }
        })
      }
    }
  },
  subscriptions: {
    setup ({ dispatch, history }) {
      return history.listen(({ pathname }) => {
        if (pathname === '/addVote') {
          dispatch({
            type: 'init'
          })
        }
      })
    }
  }
}
