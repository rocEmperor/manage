import request from '../utils/request';
const HomePageService = {
  dashboardIndex:(parameter)=>{
    const data = JSON.stringify(parameter);
    return request('/property/dashboard/index', data);
  },
  confirmPwd:(parameter)=>{
    const data = JSON.stringify(parameter);
    return request('/property/receipt/confirm-pwd', data);
  },
  verifyPwd:(parameter)=>{
    const data = JSON.stringify(parameter);
    return request('/property/receipt/verify-pwd', data);
  },
  versionRead:(parameter)=>{
    const data = JSON.stringify(parameter);
    return request('/property/system/version-read', data);
  },
}
export default HomePageService;