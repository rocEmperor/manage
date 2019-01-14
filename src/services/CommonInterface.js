import request from '../utils/request';

const commonInterface = {

  // 登入
  login: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/user/login', data);
  },
  // 发送验证码
  getSmsCode: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/user/get-sms-code', data);
  },
  //身份验证
  validateSmsCode: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/user/validate-sms-code', data);
  },
  //重置密码
  resetPassword: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/user/reset-password', data)
  },
  //变更密码
  changePassword: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/user/change-password', data)
  },
  //登出
  loginOut: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/user/login-out', data);
  },
  //获取用户信息
  getUserByToken: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/user/get-user-by-token', data);
  },
  //小区列表
  change: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/community/change', data);
  },
  //问题反馈
  feedbackAdd: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/feedback/add', data);
  },
  // 菜单栏
  getMenuList: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/menu/get-left-menu', data);
  },
  // 联掌门禁url
  lianZhang: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/device/lianzhang-url', data);
  },
  // 收银台密码验证
  confirmPwd:(parameter)=>{
    const data = JSON.stringify(parameter);
    return request('/property/receipt/confirm-pwd', data);
  },
  verifyPwd:(parameter)=>{
    const data = JSON.stringify(parameter);
    return request('/property/receipt/verify-pwd', data);
  }
};
export default commonInterface;
