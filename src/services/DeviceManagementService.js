import request from '../utils/request';

const deviceManagementService = {
  deviceList: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/device/list', data);
  },
  deviceCommon: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/device/common', data);
  },
  getGroups: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/house/get-groups?data=' + data, data);
  },
  getBuildings: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/house/get-buildings', data);
  },
  getUnits: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/house/get-units', data);
  },
  opendoorLog: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/device/opendoor-log', data);
  }
};
export default deviceManagementService;
