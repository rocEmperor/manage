export default {
  namespace: 'companyManagement',
  state: {
    list:[],
    statusList:[],
    total: '',
    community_id:'',
    park_no:'',
    user_name:'',
    mobile:'',
    status:'',
    page:'',
    rows:'',
    communitys:[],
  },
  reducers: {
    concat(state, { payload }) {
      return { ...state, ...payload };
    }
  },
  effects: {
    *init({ payload }, { call, put }) {
      yield put({ type: 'getStatus' });
    },
    *getStatus({ payload }, { call, put }) {
      
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, search }) => {
        if (pathname === '/companyManagement') {
          dispatch({ type: 'init'});
        }
      });
    }
  },
};
