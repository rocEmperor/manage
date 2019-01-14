import request from '../utils/request';

const commonInterface = {
  //智能门禁-智能门禁管理-列表
  smartDoorList: (parameter) => {
    const data = JSON.stringify(parameter)
    return request('/property/open-door/device-list', data); 
  },
  // 苑/期/区
  getPermissionsOption: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/open-door/permission-list',data);
  },
  // 供应商、设备、列表
  getSupplierOption: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/open-door/type',data);
  },
  // 启用/禁用
  disabledDropDown: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/open-door/device-status',data);
  },
  // 删除
  doorDelete: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/open-door/device-delete',data);
  },
  // 智能门禁-智能门禁管理-新增
  // 详情
  doorDetail: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/open-door/device-detail',data);
  },
  doorAdd: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/open-door/device-add',data);
  },
  doorEdit: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/open-door/device-edit',data);
  },
  // 智能门禁-门卡管理-列表
  doorCarList: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/open-door/card-list',data);
  },
  // 智能门禁-启用禁用
  doorCarDisabled: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/open-door/card-status',data);
  },
  // 智能门禁-删除
  doorCarDelete: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/open-door/card-delete',data);
  },
  // 智能门禁-批量启用禁用
  doorCarSelDisabled: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/open-door/card-status-more',data);
  },
  // 智能门禁-门卡管理-新增-门卡类型
  doorCarType: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/open-door/card-get-types',data);
  },
  // 智能门禁-门卡管理-新增-门卡详情
  doorCarDetail: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/open-door/card-detail',data);
  },
  // 智能门禁-门卡管理-新增-授权门禁列表
  authList: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/open-door/card-get-devices',data);
  },
  // 智能门禁-门卡管理-新增-业主列表
  userList: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/open-door/card-get-users',data);
  },
  doorCardAdd: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/open-door/card-add',data);
  },
  doorCardEdit: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/open-door/card-edit',data);
  },
  // 智能门禁-访客留影-列表
  visitorAlbumList: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/open-door/photo-list',data);
  },
  // 智能门禁-开门记录-列表
  openRecordList: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/open-door/photo-record',data);
  },
  //4级联动关联小区接口
  group:(parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/house/get-groups?data='+data,data)
  },
  building:(parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/house/get-buildings?data='+data,data)
  },
  unit:(parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/house/get-units?data='+data,data)
  },
  room:(parameter) => {
    const data = JSON.stringify (parameter);
    return request('/property/house/get-rooms?data='+data,data)
  },
  // 开门方式
  openType:(parameter) => {
    const data = JSON.stringify (parameter);
    return request('/property/open-door/get-open-type',data)
  },
  // 用户类型
  userType:(parameter) => {
    const data = JSON.stringify (parameter);
    return request('/property/open-door/photo-user-type',data)
  },
  // 用户类型-不带访客
  userTypes:(parameter) => {
    const data = JSON.stringify (parameter);
    return request('/property/open-door/photo-user-types',data)
  },
}
export default commonInterface;