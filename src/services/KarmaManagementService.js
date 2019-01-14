import request from '../utils/request';

const karmaManagementService = {
  // 业委会管理列表
  getKarmaList (parameter) {
    const data = JSON.stringify(parameter);
    return request('/street/property/committee/owners-committee-list', data);
  },
  // 删除业委会
  karmaDeleteReq (parameter) {
    const data = JSON.stringify(parameter);
    return request('/street/property/committee/owners-committee-delete', data);
  },
  // 社区列表
  getSocialList (parameter) {
    const data = JSON.stringify(parameter);
    return request('/street/property/committee/social-drop-down', data);
  },
  // 小区切换
  communityChange (parameter) {
    const data = JSON.stringify(parameter);
    return request('/property/community/change', data);
  },
  // 新增业委会
  karmaAddReq (parameter) {
    const data = JSON.stringify(parameter);
    return request('/street/property/committee/owners-committee-add', data);
  },
  // 编辑业委会
  karmaEditReq (parameter) {
    const data = JSON.stringify(parameter);
    return request('/street/property/committee/owners-committee-edit', data);
  },
  // 业委会详情
  getKarmaInfo (parameter) {
    const data = JSON.stringify(parameter);
    return request('/street/property/committee/owners-committee-show', data);
  },
  // 获取组/苑/区
  getGroupsList (parameter) {
    const data = JSON.stringify(parameter);
    return request('/property/house/get-groups', data);
  },
  // 获取幢
  getBuildingsList (parameter) {
    const data = JSON.stringify(parameter);
    return request('/property/house/get-buildings', data);
  },
  // 获取单元
  getUnitsList (parameter) {
    const data = JSON.stringify(parameter);
    return request('/property/house/get-units', data);
  },
  // 获取室号
  getRooms (parameter) {
    const data = JSON.stringify(parameter);
    return request('/property/house/get-rooms', data);
  },
  // 业委会成员下拉列表
  karmaUserDropDownList (parameter) {
    const data = JSON.stringify(parameter);
    return request('/street/property/committee/member-drop-down', data);
  },
  // 新增业委会成员
  karmaUserAddReq (parameter) {
    const data = JSON.stringify(parameter);
    return request('/street/property/committee/owners-committee-member-add', data);
  },
  // 业委会下拉列表
  karmaDropDownList (parameter) {
    const data = JSON.stringify(parameter);
    return request('/street/property/committee/owners-committee-drop-down', data);
  },
  // 业委会成员详情
  karmaUserInfoList (parameter) {
    const data = JSON.stringify(parameter);
    return request('/street/property/committee/owners-committee-member-show', data);
  },
  // 编辑业委会成员
  karmaUserEditReq (parameter) {
    const data = JSON.stringify(parameter);
    return request('/street/property/committee/owners-committee-member-edit', data);
  },
  // 业委会成员列表
  getKarmaUserList (parameter) {
    const data = JSON.stringify(parameter);
    return request('/street/property/committee/owners-committee-member-list', data);
  },
  // 业委会成员列表删除
  karmaUserDeleteReq (parameter) {
    const data = JSON.stringify(parameter);
    return request('/street/property/committee/owners-committee-member-delete', data);
  }
};
export default karmaManagementService;
