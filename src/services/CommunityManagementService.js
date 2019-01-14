import request from '../utils/request';
const commonInterface = {
  houseManagementList: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/house/list',data);
  },
  //4级联动关联小区接口
  group:(parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/house/get-groups?data='+data,data);
  },
  building:(parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/house/get-buildings?data='+data,data);
  },
  unit:(parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/house/get-units?data='+data,data);
  },
  room:(parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/house/get-rooms?data='+data,data);
  },
  // 新增/编辑房屋
  houseCreate:(parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/house/edit',data);
  },
  // 房屋数据导出
  dataExport:(parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/house/export',data);
  },
  //房屋详情
  houseView:(parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/house/show',data);
  },
  // 删除房屋
  removeInfo:(parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/house/delete',data);
  },
  // 住户管理列表
  residentsManageList: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/resident/list',data);
  },
  // 身份类型
  residentType: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/resident/resident-type',data);
  },
  // 住户详情
  residentView: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/resident/show',data);
  },
  // 住户新增
  createResidents: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/resident/add',data);
  },
  // 审核/不通过住户列表
  getAuditList: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/resident/audit-list',data);
  },
  // 审核/不通过住户详情
  auditShow: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/resident/audit-show',data);
  },
  // 编辑住户
  editResidents: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/resident/edit',data);
  },
  // 住户数据导出
  residentExport:(parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/resident/export',data);
  },
  // 删除住户
  deleteResidents: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/resident/delete',data);
  },
  // 业主信息变更
  changerOwner: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/resident/change-owner',data);
  },

  // 水表管理
  meterReadingManagerList: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/water/list',data);
  },
  meterReadingAdd: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/water/add',data);
  },
  meterReadingEdit: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/water/edit',data);
  },
  meterReadingView: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/water/show',data);
  },
  // 业主信息变更
  rightList: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/resident/changer-list',data);
  },
  // 设置为已处理
  changerAccept: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/resident/changer-accept',data);
  },
  // 发送短信
  changerSendMsg: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/resident/changer-send-msg',data);
  },
  // 获取当前状态
  changerStatus: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/resident/changer-comm',data);
  },
  // 业主变更详情
  changerView: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/resident/changer-show',data);
  },
  // 小区列表
  community: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/community/change',data);
  },
  // 电表管理
  electrictList: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/electrict/list',data);
  },
  electrictAdd: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/electrict/add',data);
  },
  electrictEdit: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/electrict/edit',data);
  },
  electrictShow: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/electrict/show',data);
  },
  electrictGetDown: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/electrict/get-down',data);
  },
  electrictImport: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/electrict/import',data);
  },
  // 公摊项目管理
  sharedList: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/shared/list',data);
  },
  getSharedLift: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/shared/get-shared-lift',data);
  },
  setSharedLift: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/shared/set-shared-lift',data);
  },
  sharedDelete: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/shared/delete',data);
  },
  sharedShow: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/shared/show',data);
  },
  sharedAdd: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/shared/add',data);
  },
  sharedEdit: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/shared/edit',data);
  },
  // 获取楼道号及电梯编号列表
  floorLiftList: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/shared/shared-search-list',data);
  },
  // 房屋导入
  houseImport: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/house/import',data);
  },
  houseExport: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/house/export',data);
  },
  // 房屋批量导入里的下载模板
  downFiles: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/house/get-excel',data);
  },
  // 数据订正导入
  dataRepairImport: (parameter) =>{
    const data = JSON.stringify(parameter);
    return request('/property/house/import-repair',data);
  },
  // 下载住户管理模板
  residentTemplet: (parameter) =>{
    const data = JSON.stringify(parameter);
    return request('/property/resident/get-down',data);
  },
  // 下载水表管理模板
  waterTemplet: (parameter) =>{
    const data = JSON.stringify(parameter);
    return request('/property/water/get-down',data);
  },
  // 下载电表管理模板
  electrictTemplet: (parameter) =>{
    const data = JSON.stringify(parameter);
    return request('/property/electrict/get-down',data);
  },
  // 下载公摊项目管理模板
  sharedTemplet: (parameter) =>{
    const data = JSON.stringify(parameter);
    return request('/property/shared/get-excel',data);
  },
  // 住户导出
  residentExportData: (parameter) =>{
    const data = JSON.stringify(parameter);
    return request('/property/resident/export',data);
  },
  // 标签列表
  labelList: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/label/list', data);
  },
  // 标签下拉
  labelType: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/label/difference-list', data);
  },
  // 标签新增
  labelAdd: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/label/add', data);
  },
  // 标签编辑
  labelEdit: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/label/edit', data);
  },
  // 标签删除
  labelDelete: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/label/delete', data);
  },
  // 标签类型
  labelModelType: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/label/label-type', data);
  },
  // 获取民族
  residentGetNation: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/resident/get-nation', data);
  },
  // 住户新增下拉数据
  residentCommonOptionInfo: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/resident/common-option-info', data);
  },
  // 住户新增下拉数据
  houseArea: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/house/area', data);
  },
  // 相关住户
  relatedResident: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/resident/related-resident', data);
  },
  // 相关住户
  relatedHouse: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/resident/related-house', data);
  },
  // 相关房屋编辑
  relatedHouseEdit: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/resident/related-house-edit', data);
  },
  // 审核不通过
  auditNopasst: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/resident/audit-nopass', data);
  },
  // 住户迁入
  moveInHouse: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/resident/move-in', data);
  },
  // 审核不通过数据删除
  auditDelete: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/resident/audit-delete', data);
  },
  // 住户迁出
  moveOutPerson: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/resident/move-out', data);
  },
  //仪表导出
  meterExport: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/meter/export', data);
  },
  //水电表删除
  sharedDeleteMeter: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/shared/delete-meter', data);
  },
  //区域列表
  groupManageList: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/vistor/backend/group-manage/list', data);
  },
  //区域删除
  groupManageDelete: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/vistor/backend/group-manage/delete', data);
  },
  //区域新增
  groupManageAdd: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/vistor/backend/group-manage/add', data);
  },
  //区域编辑
  groupManageEdit: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/vistor/backend/group-manage/edit', data);
  },
  //区域详情
  groupManageDetail: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/vistor/backend/group-manage/detail', data);
  },

  //楼宇列表
  buildingManageList: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/vistor/backend/building-manage/list', data);
  },
  //楼宇删除
  buildingManageDelete: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/vistor/backend/building-manage/delete', data);
  },
  //楼宇新增
  buildingManageAdd: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/vistor/backend/building-manage/add', data);
  },
  //楼宇编辑
  buildingManageEdit: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/vistor/backend/building-manage/edit', data);
  },
  //楼宇详情
  buildingManageDetail: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/vistor/backend/building-manage/detail', data);
  },
  groupList:(parameter) => {
    const data = JSON.stringify(parameter);
    return request('/vistor/backend/group-manage/group-list?data='+data,data);
  },
  buildingList:(parameter) => {
    const data = JSON.stringify(parameter);
    return request('/vistor/backend/building-manage/build-list?data='+data,data);
  },
  unitList:(parameter) => {
    const data = JSON.stringify(parameter);
    return request('/vistor/backend/building-manage/unit-list?data='+data,data);
  },
  //批量新增楼宇
  buildingManageBatchAdd: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/vistor/backend/building-manage/batch-add', data);
  },
}
export default commonInterface;
