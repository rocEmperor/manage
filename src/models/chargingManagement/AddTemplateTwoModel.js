import ChargingManagementService from './../../services/ChargingManagementService';
import { message } from 'antd';
const { templateConfigShow, templateTypeDropDown, templateConfigAdd, templateConfigDelete } = ChargingManagementService;
import queryString from 'query-string';

export default {
  namespace: 'AddTemplateTwoModel',
  state: {
    visiableAdd:false,
    type:'',
    down:[],
    table:[],
    top:[],
    downType:[],
    tableType:[],
    topType:[],
    addWidth:true,
    addNotes:false,
    showTitle:false,
    showLogo:false,
    showNumber:false,
    showNote:false,
    id:'',
    detail:false,
    imgsrc:'',
    note:'',
  },
  reducers: {
    concat(state, { payload }) {
      return { ...state, ...payload };
    }
  },
  effects: {
    *init({ payload }, { call, put }) {
      yield put({
        type: 'concat',
        payload: {
          visiableAdd: false,
          type:'',
          down:[],
          table:[],
          top:[],
          downType:[],
          tableType:[],
          topType:[],
          addNotes:false,
          addWidth:true,
          showTitle:false,
          showLogo:false,
          showNumber:false,
          showNote:false,
          id: payload.id,  
        }
      });
      yield put({
        type: 'templateTypeDropDown',
        payload: {
          template_type: payload.template_type,
          type:1
        }
      });
      yield put({
        type: 'templateTypeDropDown',
        payload: {
          template_type: payload.template_type,
          type:2
        }
      });
      yield put({
        type: 'templateTypeDropDown',
        payload: {
          template_type: payload.template_type,
          type:3
        }
      });
    },
    *info({ payload }, { call, put }) {
      const { data, code } = yield call(templateConfigShow, payload);
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: {
            down:data.down?data.down:[],
            table:data.table?data.table:[],
            top:data.top?data.top:[],
            showTitle: false,
            showLogo: false,
            showNumber: false,
            showNote: false,
            imgsrc: '',
            note: '',
          }
        });
      }
    },
    *templateConfigDelete({ payload }, { call, put, select }) {
      let id = yield select(state => state.AddTemplateTwoModel.id);
      const { code } = yield call(templateConfigDelete, payload);
      if (code == 20000) {
        yield put({
          type: 'info',
          payload: {
            id: id,
          }
        });
        message.success("删除成功！")
      }
    },
    *templateTypeDropDown({ payload }, { call, put }) {
      const { data, code } = yield call(templateTypeDropDown, payload);
      if (code == 20000) {
        if(payload.type==1){
          yield put({
            type: 'concat',
            payload: {
              topType:data.list?data.list:[],
            }
          });
        }else if(payload.type ==2){
          yield put({
            type: 'concat',
            payload: {
              tableType:data.list?data.list:[],
            }
          });
        }else{
          yield put({
            type: 'concat',
            payload: {
              downType:data.list?data.list:[],
            }
          });
        }
      }
    },
    *templateConfigAdd({ payload, callback }, { call, put, select }) {
      let id = yield select(state => state.AddTemplateTwoModel.id);
      const { code } = yield call(templateConfigAdd, payload);
      if (code == 20000) {
        message.success("新增成功！");
        yield put({
          type: 'info',
          payload: {
            id: id,
          }
        });
        yield put({
          type: 'concat',
          payload: {
            visiableAdd: false,
            addWidth: true,
            addNotes: false,
          }
        });
        callback && callback()
      }
    },

  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, search }) => {
        if (pathname === '/addTemplateTwo') {
          let query = queryString.parse(search);
          dispatch({ type: 'init', payload: { id: query.id, template_type: query.template_type}});
          if (query.id) {
            dispatch({ type: 'info', payload: { id: query.id } });
          }
          if(query.detail){
            dispatch({ type: 'concat', payload: { detail: true} });
          }else{
            dispatch({ type: 'concat', payload: { detail: false } });
          }
        }
      });
    }
  },
};
