import { message } from 'antd';
import queryString from 'query-string';
import rentalHouseManagementService from "../../services/rentalHouseManagementService";

const defaultState = {
  rent_ref: [],
  status: [],
  rent_way: [],
  pay_way: [],
  decorate_degree: [],
  groupData: [],
  buildingData: [],
  unitData: [],
  roomData: [],
  ownerInfo: [],
  labels: [],
  roomId: '',
  uploadToken: '',
  space: '',
  detailInfo: '',
  group: '',
  building: '',
  unit: '',
  room: '',
  member_id: '',
  member_mobile: '',
  phoneNum: '',
  showRoom: false,
  name: '',
  files: '',
  isUpload: true,
  previewImage: '',
  previewVisible: false,
  params:{
    group: '',
    building: '',
    unit: '',
    room: '',
    community_id: ''
  },
  hasSubmit: false
}
export default {
  namespace: 'AddRentalHouseModel',
  state: { ...defaultState },
  reducers: {
    concat (state, {payload}) {
      return { ...state, ...payload }
    }
  },
  effects: {
    *init ({ payload }, { call, put, select }) {
      const AddRentalHouseModel = yield select(state => state.AddRentalHouseModel);
      const layout = yield select(state => state.MainLayout);
      let params = AddRentalHouseModel.params;
      params.community_id = layout.communityId;
      yield put({type: 'concat', payload: { ...defaultState }})
      yield put({type: 'getComm', payload: {}});
      yield put({type: 'getHouseSourceGetRentLabel', payload: {}})
      // yield put({type: 'getUploadToken', payload: {username: 'yaoping', password: '123456'}});
      if (layout.communityId) {
        yield put({
          type: 'concat',
          payload: {
            params: { ...params }
          }})
        yield put({type: 'groupList', payload: {community_id: layout.communityId}});
      }
    },
    *groupList ({ payload }, { call, put, select }) {
      let defaultParam = { has_member_info: 1 };
      payload = Object.assign({}, defaultParam, payload);
      const { data, code } = yield call(rentalHouseManagementService.groupsList, payload);
      if (code === 20000) {
        yield put({type: 'concat', payload: {groupData: data}})
      }
    },
    *getComm ({ payload }, { call, put, select }) {
      const { data, code } = yield call(rentalHouseManagementService.commList, payload);
      if (code === 20000) {
        yield put({
          type: 'concat',
          payload: {
            rent_ref: data.rent_ref ? data.rent_ref : [],
            status: data.status ? data.status : [],
            rent_way: data.rent_way ? data.rent_way : [],
            pay_way: data.pay_way ? data.pay_way : [],
            decorate_degree: data.decorate_degree ? data.decorate_degree : []
          }
        })
      }
    },
    *getHouseSourceGetRentLabel ({ payload }, { call, put, select }) {
      const { data, code } = yield call(rentalHouseManagementService.houseSourceGetRentLabel, payload);
      if (code === 20000) {
        yield put({type: 'concat', payload: {labels: data}});
      }
    },
    *getHouseSourceEditRent ({ payload, callback, err }, { call, put, select }) {
      yield put({ type: 'concat', payload: { hasSubmit: true } });
      const { code } = yield call(rentalHouseManagementService.houseSourceEditRent, payload);
      if (code === 20000) {
        message.success('编辑成功');
        yield put({ type: 'concat', payload: { hasSubmit: false }});
        callback && callback();
      } else {
        yield put({ type: 'concat', payload: { hasSubmit: false } });
        err && err()
      }
    },
    *getHouseSourceAddRent ({ payload, callback, err }, { call, put, select }) {
      const { code } = yield call(rentalHouseManagementService.houseSourceAddRent, payload);
      if (code === 20000) {
        message.success('新增成功');
        yield put({type: 'concat', payload: {}});
        callback && callback();
      } else {
        err && err()
      }
    },
    *getBuildingList ({ payload }, { call, put, select }) {
      let defaultParam = {has_member_info: 1};
      payload = Object.assign({}, defaultParam, payload);
      const { data, code } = yield call(rentalHouseManagementService.buildingList, payload);
      if (code === 20000) {
        yield put({
          type: 'concat',
          payload: {
            phoneNum: '',
            building:'',
            unit: '',
            room: '',
            space: '',
            ownerInfo: [],
            member_id: '',
            member_mobile: '',
            buildingData: data
          }
        })
      }
    },
    *getUnitList ({ payload }, { call, put, select }) {
      let defaultParam = {has_member_info: 1};
      payload = Object.assign({}, defaultParam, payload);
      const { data, code } = yield call(rentalHouseManagementService.Units, payload);
      if (code === 20000) {
        yield put({
          type: 'concat',
          payload: {
            unitData: data,
            unit: '',
            room: '',
            space: '',
            ownerInfo: [],
            member_id: '',
            member_mobile: ''
          }
        })
      }
    },
    *getRoomList ({ payload }, { call, put, select }) {
      let defaultParam = {has_member_info: 1};
      payload = Object.assign({}, defaultParam, payload);
      const { data, code } = yield call(rentalHouseManagementService.roomList, payload);
      if (code === 20000) {
        yield put({
          type: 'concat',
          payload: {
            roomData: data,
            room: '',
            space: '',
            ownerInfo: [],
            member_id: '',
            member_mobile: ''
          }
        })
      }
    },
    *getHouseSourceGetOwner ({ payload }, { call, put, select }) {
      const { data, code } = yield call(rentalHouseManagementService.houseSourceGetOwner, payload);
      if (code === 20000) {
        yield put({
          type: 'concat',
          payload: {
            ownerInfo: data.user ? data.user : [],
            roomId: data.room_id,
            space: data.charge_area
          }
        })
      }
    },
    *houseSourceShowRent ({ payload }, { call, put, select }) {
      const layout = yield select(state => state.MainLayout);
      const { data, code } = yield call(rentalHouseManagementService.detailsList, payload);
      if (code === 20000) {
        for(let i = 0; i < data.imgs.length; i++){
          let obj = {
            uid: i - 1,
            name: `img${i}`,
            status: 'done',
            url: data.imgs[i],
          };
          data.imgs[i] = obj;
        }
        yield put({
          type: 'concat',
          payload: {
            detailInfo: data,
            group: data.group,
            building: data.building,
            unit: data.unit,
            room: data.room,
            space: data.house_space,
            member_id: data.member_id,
            member_mobile: data.member_mobile
          }
        });
        const AddRentalHouseModel = yield select(state => state.AddRentalHouseModel);
        if (AddRentalHouseModel.detailInfo.rent_way === '2') {
          yield put({type: 'concat', payload: {showRoom: true}});
        }
        if (layout.communityId) {
          yield put({
            type: 'getHouseSourceGetOwner',
            payload: {
              group: AddRentalHouseModel.detailInfo.group,
              building: AddRentalHouseModel.detailInfo.building,
              unit: AddRentalHouseModel.detailInfo.unit,
              room: AddRentalHouseModel.detailInfo.room,
              community_id: layout.communityId
            }
          })
        }
        yield put({type: 'concat', payload: {phoneNum: data.member_mobile}});
      }
    }
  },
  subscriptions: {
    setup ({ dispatch, history }) {
      return history.listen (({ pathname, search }) => {
        if (pathname === '/addRentalHouse') {
          let query = queryString.parse(search);
          dispatch({type: 'init'})
          // 判断是否是编辑页面
          if (query.id) {
            dispatch({type: 'houseSourceShowRent', payload: {rent_id: query.id}})
          }
        }
      })
    }
  }
}
