import request from '../utils/request';

const voteService = {
  // 投票管理--- 列表
  getListReq: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/vote/list', data);
  },
  // 投票-删除
  voteDeleteReq: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/vote/delete', data);
  },
  // 上架/下架
  voteOnOffReq: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/vote/on-off', data);
  },
  // 获取公共参数
  voteGetCommList: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/vote/get-comm', data);
  },
  // 新增投票
  voteAddReq: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/vote/add', data);
  },
  // 获取业主列表
  voteGetResidentList: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/resident/get-resident', data);
  },
  // 获取住户身份列表
  residentTypeListReq: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/resident/get-resident', data);
  },
  // 获取组/苑/区
  getGroupsList: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/house/get-groups', data);
  },
  // 获取幢
  getBuildingsList: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/house/get-buildings', data);
  },
  // 获取单元
  getUnitsList: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/house/get-units', data);
  },
  // 获取室号
  getRoomsList: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/house/get-rooms', data);
  },
  // 投票详情
  voteShowList: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/vote/show', data);
  },
  // 修改截止时间
  voteEndtimeReq: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/vote/end-time', data);
  },
  // 修改公示时间
  voteShowtimeReq: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/vote/show-time', data);
  },
  // 查看投票详情人数
  voteShowMemberReq: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/vote/show-member', data);
  },
  // 导出投票详情数据
  downLoadDataReq: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/vote/export-det', data);
  },
  // 显示公示结果详情
  showResultViewReq: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/vote/show-result', data);
  },
  // 新增编辑公示结果
  voteDeleteResultReq: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/vote/delete-result', data);
  },
  // 新增编辑公示结果
  voteAddShowResultReq: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/vote/edit-result', data);
  },
  // 查看房屋投票详情
  voteShowDetReq: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/vote/show-member-det', data);
  },
  // 线下投票录入
  voteDoReq: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/vote/do-vote', data);
  },
  // 业主获取
  houseSourceGetOwnerReq: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/house-source/get-owner', data);
  },
  //
  voteDataExport: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/vote/data-export', data);
  },
  //
  voteDataExportVote: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/vote/export-vote', data);
  }
};

export default voteService;
