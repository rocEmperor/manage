import HomePageService from './../../services/HomePageService';
// const {dashboardIndex,confirmPwd,verifyPwd,versionRead} = HomePageService;

export default {
  namespace:'HomePageModel',
  state: {
    // complaint:'',
    // repair:'',
    // version:'',
    // house:'',
    // packAge:'',
    // permission:'',
    is_set:'no',
    news: true,
    passwords: false,
    is_verify:'no',
    error_num:''
  },
  reducers: {
    concat(state,{ payload }){
      return {...state,...payload}
    }
  },
  effects:{
    *init({payload},{ call,put,select }){
      // const community_id = yield select(state => state.HomePageModel.community_id);
      // yield put({ type:'dashboardIndex',payload:{
      //   community_id:sessionStorage.getItem("communityId")
      // }})
    },
    *dashboardIndex({ payload },{ call,put,select }){
      // const community_id = yield select(state => state.HomePageModel.community_id);
      const { data, code } = yield call(HomePageService.dashboardIndex, payload,{community_id:sessionStorage.getItem("communityId")});
      if(code == 20000){
        yield put({
          type:'concat',
          payload: {
            complaint:data?data.complaint:'',
            repair:data?data.repair:'',
            version:data?data.version:'',
            house:data?data.house:'',
            packAge:data?data.package:'',
            permission:data?data.permission:'',
          }
        })
      }
    },
    *confirmPwd({payload,callback}, {call, put}){
      const { data,code } = yield call(HomePageService.confirmPwd, payload);
      if(code == 20000){
        yield put({
          type:'concat',
          payload: {
            is_set:data?data.is_set:'',
          }
        })
        callback&&callback(data.is_set);
      }
    },
    *verifyPwd({payload,callback}, {call, put}){
      const { data,code } = yield call(HomePageService.verifyPwd, payload);
      if(code == 20000){
        window.sessionStorage.setItem('password_time_stamp', new Date().getTime());
        yield put({
          type:'concat',
          payload: {
            is_verify:data?data.is_verify:'',
            error_num:data?data.error_num:'',
          }
        })
        callback&&callback(data);
      }
    },
    *versionRead({payload,callback}, {call, put}){
      const { code,data } = yield call(HomePageService.versionRead, payload);
      if(code == 20000){
        callback&&callback(data);
      }
    }
  },
  subscriptions: {
    setup({dispatch,history}){
      return history.listen(({ pathname, search })=>{
        if(pathname === '/homePage'){
          dispatch({type: 'init'})
        }
      })
    }
  }
}
