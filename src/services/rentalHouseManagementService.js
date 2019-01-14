import request from '../utils/request';

const commonInterface = {
  //  幢列表获取
  buildingList: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/house/get-buildings', data);
  },
  // 获取单元列表
  Units: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/house/get-units', data);
  },
  // 获取室列表
  roomList: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/house/get-rooms', data);
  },
  // 获取table列表数据
  list: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/house-source/rents', data);
  },
  // 取消委托
  houseSourceCancelEntrust: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/house-source/cancel-entrust', data);
  },
  // 预约看房
  houseSourcePropertyCreate: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/rent-reserve/property-create', data);
  },
  // 房屋来源，房屋状态枚举接口
  commList: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/house-source/get-rent-comm', data);
  },
  // 获取组/苑/区
  groupsList: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/house/get-groups', data);
  },
  // 详情页数据接口
  detailsList: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/house-source/property-show-rent', data);
  },
  // 房源信息编辑接口
  houseSourceEditRent: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/house-source/edit-rent', data);
  },
  // 房源信息新增接口
  houseSourceAddRent: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/house-source/add-rent', data);
  },
  // 获取业主
  houseSourceGetOwner: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/house-source/get-owner', data);
  },
  // 获取全部标签
  houseSourceGetRentLabel: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/house-source/get-rent-label', data);
  },
  // 获取图片上传token
  // uploadToken: (parameter) => {
  //   const data = JSON.stringify(parameter);
  //   return request('http://101.37.135.54:8555/apiserver/api/qiNiuUpToken', data);
  // }
  // 预约看房列表
  rentReservePropertyList: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/rent-reserve/property-list', data);
  },
  // 标记已带看
  rentReserveTakeLook: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/rent-reserve/take-look', data);
  },
  // 获取公共参数
  rentReserveGetComm: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/rent-reserve/get-comm', data);
  },
  // 预约看房详情
  rentReservePropertyShow: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/rent-reserve/property-show', data);
  },
  // 收益列表
  incomPropertyList: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/income/property-list', data);
  },
  // 签约获取公共信息
  rentReserveGetRentInfo: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/rent-reserve/get-rent-info', data);
  },
  // 签约
  rentReserveRentContract: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/rent-reserve/rent-contract', data);
  },
  // 导出
  propertyExport: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/income/property-export', data);
  },
  // 下载合同模板
  downContact: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/rent-reserve/down-contact', data);
  }
};

export default commonInterface;

