import request from '../utils/request';
//停车场设备管理
const commonInterface = {
  carEquipList: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/smartpark/gate/list', data);
  },
  carEquipType: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/smartpark/gate/types', data);
  },
  //在库车辆
  InList: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/wisdompark/backend-across/in-list', data);
  },
  InType: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/wisdompark/backend-across/types', data);
  },
  //出库车辆
  OutList: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/wisdompark/backend-across/out-list', data);
  },
  OutType: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/wisdompark/backend-across/types', data);
  },
  //收费规则设置
  ChargeList: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/smartpark/charge/list', data);
  },
  Delete: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/smartpark/charge/delete', data);
  },
  Add: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/smartpark/charge/add', data);
  },
  ChargeType: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/smartpark/lot/types', data);
  },
  Edit: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/smartpark/charge/edit', data);
  },
  //车位管理 车位状态
  CarportStatus: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/wisdompark/backend-carport/status', data);
  },
  //车位类型
  CarportTypes: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/wisdompark/backend-carport/types', data);
  },
  //车位管理列表
  CarportList: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/wisdompark/backend-carport/list', data);
  },
  carportAdd: (parameter) => {/*车位新增*/
    const data = JSON.stringify(parameter);
    return request('/wisdompark/backend-carport/add', data);
  },
  carportEdit: (parameter) => {/*车位编辑*/
    const data = JSON.stringify(parameter);
    return request('/wisdompark/backend-carport/edit', data);
  },
  CarportDel: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/wisdompark/backend-carport/delete', data);
  },

  carPortSelDel: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/wisdompark/backend-carport/delete-all',data);
  },


  //车主管理
  //交易类型
  TradingType: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/smartpark/user/tran-types', data);
  },
  //车主类型
  OwnerType: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/smartpark/user/types', data);
  },
  //车主状态
  StatusType: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/smartpark/user/status', data);
  },
  //列表
  ownerList: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/wisdompark/car-manage/list', data);
  },
  //续费
  OwneRenew: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/smartpark/user/renew-record', data);
  },
  // 车辆续费
  carRenew: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/wisdompark/car-manage/renew', data);
  },
  
  //编辑
  OwneEdit: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/wisdompark/car-manage/edit', data);
  },
  //删除
  OwneDelete: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/wisdompark/car-manage/del', data);
  },
  //车位号
  Addlots: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/smartpark/lot/get-lots', data);
  },
  //4级联动关联小区接口
  group: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/house/get-groups?data=' + data, data);
  },
  building: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/house/get-buildings?data=' + data, data);
  },
  unit: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/house/get-units?data=' + data, data);
  },
  room: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/house/get-rooms?data=' + data, data);
  },
  //增加车位
  AddSubmit: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/smartpark/user/add', data);
  },
  // 编辑住户
  editUser: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/smartpark/user/edit', data);
  },
  // 住户数据导出
  residentExport: (parameter) => {
    const data = JSON.stringify(parameter);
    // return request('/property/resident/export', data);
    return request('/smartpark/user/export', data);
  },
  // 停车场概况
  Carreport: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/wisdompark/backend-report/index', data);
  },
  // 车位管理导出
  carExport: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/wisdompark/backend-carport/export', data);
  },
  carOwnerExportData: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/wisdompark/car-manage/export', data);
  },
  // 车位管理下载模板
  downModel: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/wisdompark/backend-carport/template', data);
  },
  //车主管理下载模板
  downCarOwnerModel: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/wisdompark/car-manage/get-down', data);
  },
  // 车位管理详情
  carOwnerView: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/smartpark/user/detail', data);
  },
  lotListAll: (parameter) => {/*停车场列表（id-name）*/
    const data = JSON.stringify(parameter);
    return request('/wisdompark/backend-lot/list-all', data);
  },
  lotAreaList: (parameter) => {/*停车场区域列表（id-name）*/
    const data = JSON.stringify(parameter);
    return request('/wisdompark/backend-lot/area-list', data);
  },
  getGroups: (parameter) => {/*苑\期\区*/
    const data = JSON.stringify(parameter);
    return request('/property/house/get-groups', data);
  },
  getBuildings: (parameter) => {/*幢*/
    const data = JSON.stringify(parameter);
    return request('/property/house/get-buildings', data);
  },
  getUnits: (parameter) => {/*单元*/
    const data = JSON.stringify(parameter);
    return request('/property/house/get-units', data);
  },
  getRooms: (parameter) => {/*室*/
    const data = JSON.stringify(parameter);
    return request('/property/house/get-rooms', data);
  },
  /*车场管理*/
  lotListNew: (parameter) => {/*停车场列表*/
    const data = JSON.stringify(parameter);
    return request('/wisdompark/backend-lot/list-new', data);
  },
  lotAreaDelete: (parameter) => {/*车场/区域删除*/
    const data = JSON.stringify(parameter);
    return request('/wisdompark/backend-lot/area-delete', data);
  },
  lotAreaDetail: (parameter) => {/*车场/区域详情*/
    const data = JSON.stringify(parameter);
    return request('/wisdompark/backend-lot/area-detail', data);
  },
  lotAreaAdd: (parameter) => {/*车场/区域新增*/
    const data = JSON.stringify(parameter);
    return request('/wisdompark/backend-lot/area-add', data);
  },
  lotAreaEdit: (parameter) => {/*车场/区域编辑*/
    const data = JSON.stringify(parameter);
    return request('/wisdompark/backend-lot/area-edit', data);
  },
  /*车位管理*/
  carportDetail: (parameter) => {/*车位详情*/
    const data = JSON.stringify(parameter);
    return request('/wisdompark/backend-carport/detail', data);
  },
  findOwner: (parameter) => {/*门禁查找业主信息*/
    const data = JSON.stringify(parameter);
    return request('/property/open-door/card-get-users', data);
  },
  carManageAdd: (parameter) => {/*车辆新增*/
    const data = JSON.stringify(parameter);
    return request('/wisdompark/car-manage/add', data);
  },
  carManageEdit: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/wisdompark/car-manage/edit', data);
  },
  carManageDetail: (parameter) => {
    const data = JSON.stringify(parameter);
    return request ('/wisdompark/car-manage/detail',data)
  },
  // 查看续费记录
  renewList: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/wisdompark/car-manage/renew-list', data);
  },
  // 车辆管理-批量删除
  carSelDel: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/wisdompark/car-manage/batch-del', data);
  },
  // 停车场管理-新增-停车场列表
  parkList: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/wisdompark/backend-lot/lists', data);
  },
}

export default commonInterface;