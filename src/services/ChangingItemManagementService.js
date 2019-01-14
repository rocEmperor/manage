import request from '../utils/request';

const changingItemManagement = {
  // 缴费项目列表
  getBillCostList: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/bill-cost/list', data);
  },
  // 缴费状态
  getBillCostStatus: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/bill-cost/edit-status', data);
  },
  // 缴费项目新增
  billCostAddReq: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/bill-cost/add', data);
  },
  // 缴费项目编辑
  billCostEditReq: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/bill-cost/edit', data);
  },
  // 缴费项目详情
  billCostInfoList: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/bill-cost/info', data);
  },
  // 物业费公式列表
  getFormula: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/formula/list', data);
  },
  // 删除物业费公式
  deleteFormula: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/formula/delete', data);
  },
  // 新增物业费公式
  addFormula: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/formula/add', data);
  },
  // 水费公式详情
  waterShow: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/formula/water-show', data);
  },
  // 水费公式列表
  getWaterLiat: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/formula/water-list', data);
  },
  // 新增编辑水费公式
  WaterEditReq: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/formula/water-edit', data);
  },
  // 电费公式详情
  electricShowList: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/formula/electric-show', data);
  },
  // 电费公式列表
  getElectricList: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/formula/electric-list', data);
  },
  // 公摊水费公式
  shareWaterEdit: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/formula/shared-water-edit', data);
  },
  // 公摊水费公式列表
  sharedWaterList: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/formula/shared-water-list', data);
  },
  // 公摊电费公式
  sharedElectricEdit: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/formula/shared-electric-edit', data);
  },
  // 公摊电费公式列表
  sharedElectricList: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/formula/shared-electric-list', data);
  },
  // 新增编辑电费公式
  electricEdit: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/formula/electric-edit', data);
  },
};
export default changingItemManagement;
