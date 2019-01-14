import request from '../utils/request';

const commonInterface = {
  //列表
  communityGuideList: (parameter) => {
    const data = JSON.stringify(parameter)
    return request('/property/serve/guide-list', data); 
  },
  //显示隐藏
  guideOpenDown: (parameter) => {
    const data = JSON.stringify(parameter)
    return request('/property/serve/guide-open-down', data); 
  },
  //分类列表
  guideTypeList:(parameter) => {
    const data = JSON.stringify(parameter)
    return request('/property/serve/guide-types',data)
  },
  //编辑详情
  guideDetail:(parameter) => {
    const data = JSON.stringify(parameter)
    return request('/property/serve/guide-detail',data)
  },
  //编辑
  guideEdit:(parameter) => {
    const data = JSON.stringify(parameter)
    return request('/property/serve/guide-edit',data)
  },
  //新增指南
  guideCreate: (parameter) => {
    const data = JSON.stringify(parameter)
    return request('/property/serve/guide-create', data); 
  },
  //包裹状态
  packageStatus: (parameter) => {
    const data = JSON.stringify(parameter)
    return request('/property/serve/package-status', data); 
  },
  //包裹快递公司
  packageDelivery: (parameter) => {
    const data = JSON.stringify(parameter)
    return request('/property/serve/package-delivery', data); 
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
  //列表
  packageList: (parameter) => {
    const data = JSON.stringify(parameter)
    return request('/property/serve/package-list', data); 
  },
  //包裹确认领取
  packageReceive: (parameter) => {
    const data = JSON.stringify(parameter)
    return request('/property/serve/package-receive', data); 
  },
  //包裹编辑
  packageEdit: (parameter) => {
    const data = JSON.stringify(parameter)
    return request('/property/serve/package-edit', data); 
  },
  //包裹详情
  packageDetail: (parameter) => {
    const data = JSON.stringify(parameter)
    return request('/property/serve/package-detail', data); 
  },
  //快递备注
  packageNote: (parameter) => {
    const data = JSON.stringify(parameter)
    return request('/property/serve/package-note', data); 
  },
  //包裹新增
  packageCreate: (parameter) => {
    const data = JSON.stringify(parameter)
    return request('/property/serve/package-create', data); 
  },
  //小区公告列表
  proclaimList: (parameter) => {
    const data = JSON.stringify(parameter)
    return request('/property/proclaim/list', data);
  },
  //小区公告删除
  proclaimDel: (parameter) => {
    const data = JSON.stringify(parameter)
    return request('/property/proclaim/del', data);
  },
  //小区公告显示隐藏
  proclaimEditShow: (parameter) => {
    const data = JSON.stringify(parameter)
    return request('/property/proclaim/edit-show', data);
  },
  //小区公告置顶
  proclaimEditTop: (parameter) => {
    const data = JSON.stringify(parameter)
    return request('/property/proclaim/edit-top', data);
  },
  //小区公告新增
  proclaimAdd: (parameter) => {
    const data = JSON.stringify(parameter)
    return request('/property/proclaim/add', data);
  },
  //小区公告详情
  proclaimShow: (parameter) => {
    const data = JSON.stringify(parameter)
    return request('/property/proclaim/show', data);
  },
  //小区公告编辑
  proclaimEdit: (parameter) => {
    const data = JSON.stringify(parameter)
    return request('/property/proclaim/edit', data);
  },
  //阳光工作栏列表
  sunNotice: (parameter) => {
    const data = JSON.stringify(parameter)
    return request('/property/sun-notice/list', data); 
  },
  //阳光工作栏删除
  sunNoticeDelete: (parameter) => {
    const data = JSON.stringify(parameter)
    return request('/property/sun-notice/delete', data); 
  },
  //显示隐藏
  openDown: (parameter) => {
    const data = JSON.stringify(parameter)
    return request('/property/sun-notice/edit-status', data); 
  },
  //阳光公告栏新增
  sunNoticeAdd: (parameter) => {
    const data = JSON.stringify(parameter)
    return request('/property/sun-notice/add', data); 
  },
  //阳光公告栏编辑
  sunNoticeEdit: (parameter) => {
    const data = JSON.stringify(parameter)
    return request('/property/sun-notice/edit', data); 
  },
  //阳光公告栏详情
  sunNoticeDetail: (parameter) => {
    const data = JSON.stringify(parameter)
    return request('/property/sun-notice/show', data); 
  },
  //消息管理
  newsList: (parameter) => {
    const data = JSON.stringify(parameter)
    return request('/property/send-msg/list', data); 
  },
  //消息管理删除
  newsDelete: (parameter) => {
    const data = JSON.stringify(parameter)
    return request('/property/send-msg/delete', data); 
  },
  //推送消息
  newsPush: (parameter) => {
    const data = JSON.stringify(parameter)
    return request('/property/send-msg/push', data); 
  },
  //消息类型
  getSendType: (parameter) => {
    const data = JSON.stringify(parameter)
    return request('/property/send-msg/get-send-type', data); 
  },
  //发送对象
  getPushType: (parameter) => {
    const data = JSON.stringify(parameter)
    return request('/property/send-msg/get-push-type', data); 
  },
  //消息新增
  newsAdd: (parameter) => {
    const data = JSON.stringify(parameter)
    return request('/property/send-msg/add', data)
  },
  //消息详情
  newsShow: (parameter) => {
    const data = JSON.stringify(parameter)
    return request('/property/send-msg/show', data)
  },
  //消息编辑
  newsEdit: (parameter) => {
    const data = JSON.stringify(parameter)
    return request('/property/send-msg/edit', data)
  },
  //垃圾袋发放记录
  sendList: (parameter) => {
    const data = JSON.stringify(parameter)
    return request('/garbage/property/garbage-bag/send-list', data)
  },
  //垃圾袋检查记录
  checkList: (parameter) => {
    const data = JSON.stringify(parameter)
    return request('/garbage/property/garbage-bag/check-list', data)
  },
  //垃圾袋检查详情info
  checkShowBasic: (parameter) => {
    const data = JSON.stringify(parameter)
    return request('/garbage/property/garbage-bag/check-show-basic', data)
  },
  //垃圾袋检查详情列表
  checkShowList: (parameter) => {
    const data = JSON.stringify(parameter)
    return request('/garbage/property/garbage-bag/check-show-list', data)
  },
  //垃圾袋发放记录导出
  exportSendList: (parameter) => {
    const data = JSON.stringify(parameter)
    return request('/garbage/property/garbage-bag/export-send-list', data)
  },
  //垃圾袋检查记录导出
  exportCheckList: (parameter) => {
    const data = JSON.stringify(parameter)
    return request('/garbage/property/garbage-bag/export-check-list', data)
  },
};
export default commonInterface;