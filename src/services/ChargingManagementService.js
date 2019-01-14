import request from '../utils/request';

const chargingManagement = {
  // 票据模版列表
  templateList: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/template/template-list', data);
  },
  // 票据模版删除
  templateDelete: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/template/template-delete', data);
  },
  // 票据模版新增第一步
  templateAdd: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/template/template-add', data);
  },
  // 票据模版新增第一步
  templateEdit: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/template/template-edit', data);
  },
  // 票据模版详情第一步
  templateShow: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/template/template-show', data);
  },
  // 票据模版删除第二步
  templateConfigDelete: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/template/template-config-delete', data);
  },
  // 票据模版新增第二步
  templateConfigAdd: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/template/template-config-add', data);
  },
  // 票据模版详情第二步
  templateConfigShow: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/template/template-config-show', data);
  },
  //显示内容下拉
  templateTypeDropDown: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/template/type-drop-down', data);
  },
  //模版下拉
  templateDropDown: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/template/template-drop-down', data);
  },
  // 账单管理列表
  billList: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/alipay-cost/bill-list', data);
  },
  // 账单管理 收费项目
  payList: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/bill-cost/pay-list', data);
  },
  // 账单管理 账单类型列表
  billDetailList: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/alipay-cost/bill-detail-list', data);
  },
  // 账单管理 账单状态列表
  statusList: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/alipay-cost/get-status', data);
  },
  // 账单管理 /已收账单/优惠账单/待生成账单
  exportTypeBill: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/alipay-cost/export-bill-source', data);
  },
  // 账单管理 /已收账单/优惠账单/待生成账单 全部删除
  delAllData: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/alipay-cost/batch-del-bill-all', data);
  },
  // 账单管理 /已收账单/优惠账单/待生成账单
  delBills: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/alipay-cost/batch-del-bill', data);
  },
  // 账单管理 /已收账单/优惠账单/待生成账单
  generateBills: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/alipay-cost/batch-push-bill', data);
  },
  // 账单管理 /已收账单/优惠账单/待生成账单
  generateAllBills: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/alipay-cost/batch-push-bill-all', data);
  },
  // 获取组/苑/区
  getGroupsList: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/house/get-groups', data);
  },
  // 收费项目列表
  costTypeList: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/bill-cost/pay-list', data);
  },
  // 按搜索账单列表
  getSrarchBillList: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/print/bill-list', data);
  },
  // 获取幢
  getBuildingsList: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/house/get-buildings', data);
  },
  // 获取室号
  getRoomsList: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/house/get-rooms', data);
  },
  // 获取单元
  getUnitsList: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/house/get-units', data);
  },
  // 打印公共信息获取
  printInfoList: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/print/comm-info', data);
  },
  // 获取账单列表
  billChargeList: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/print/bill-charge', data);
  },
  // 获取账单编号
  chargeNumberReq: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/print/charge-print', data);
  },
  //
  printBillReq: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/print/print-bill', data);
  },
  // 收费明细管理列表
  chargeListReq: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/alipay-cost/pay-detail-list', data);
  },
  // 报表统计 财务明细 缴费状态获取
  payStatusReq: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/report/pay-status', data);
  },
  // 首页-- 缴费方式
  payChannelReq: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/alipay-cost/pay-channel', data);
  },
  // 收费明细导出报表
  chargeExportBillReq: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/alipay-cost/export-detail', data);
  },
  // 小区列表
  community: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/community/change',data);
  },
  //
  showRoom: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/house/show-room',data);
  },
  //收费项目列表
  costType: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/bill-cost/pay-list',data);
  },
  //税费公式详情
  formulaWaterShow: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/formula/water-show',data);
  },
  //新增账单时调用电费水费公式
  formulaShow: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/formula/electric-show',data);
  },
  //账单新增获取应缴金额接口
  getAmount: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/alipay-cost/get-bill-money',data);
  },
  //单个账单生成
  billAdd: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/alipay-cost/create-bill',data);
  },
  //
  getBuildings: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/formula/get-buildings',data);
  },
  ///property/formula/list
  formulaList: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/formula/list',data);
  },
  communityService: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/service/community-service',data);
  },
  getBillCalc: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/alipay-cost/get-bill-calc',data);
  },
  //生成账单列表
  billdetailList: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/alipay-cost/bill-detail-list',data);
  },
  // 账单详情
  billViewList: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/alipay-cost/bill-info', data);
  },
  // 缴费方式
  payTypeList: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/alipay-cost/get-pay-type', data);
  },
  //
  billCollectPrint: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/alipay-cost/bill-collect-print', data);
  },
  // 线下收款确认
  submitCharge: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/alipay-cost/bill-collect', data);
  },
  // 收款记录list
  gatheringRecordList: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/bill-income/bill-income-list', data);
  },
  // 收款复核list
  gatheringCheckList: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/bill-income/check-list', data);
  },
  // 收款记录明细
  gatheringRecordShow: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/bill-income/bill-income-show', data);
  },
  // 撤销收款 ---- 收款复核
  billIncome: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/bill-income/refund-add', data);
  },
  // 撤销收款 ---- 收款记录
  recordBillIncome: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/bill-income/refund-add-offline', data);
  },
  // 打印收据
  printReceiptInfo: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/bill-income/print-list', data);
  },
  // 发票记录详情
  invoiceShow: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/bill-income/invoice-show', data);
  },
  // 批量复核/撤销复核
  billIncomeCheck: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/bill-income/bill-income-check', data);
  },
  // 批量提交核销
  billIncomeReview: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/bill-income/bill-income-review', data);
  },
  // 发票记录新增/编辑
  invoiceEdit: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/bill-income/invoice-edit', data);
  },
  // 收费明细导出报表
  collectionsListReq: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/alipay-cost/bill-pay-info', data);
  },
  //生成账单
  createBatchBill: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/alipay-cost/create-batch-bill',data);
  },
  //取消推送
  recallBill: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/alipay-cost/recall-bill',data);
  },
  //账单发布
  pushBill: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/alipay-cost/push-bill',data);
  },
  //账期列表
  sharedPeriodList: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/shared-period/list',data);
  },
  //账期新增
  sharedPeriodAdd: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/shared-period/add',data);
  },
  //账期编辑
  sharedPeriodEdit: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/shared-period/edit',data);
  },
  //账期删除
  sharedPeriodDelete: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/shared-period/delete',data);
  },
  //
  //账期详情
  sharedPeriodShow: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/shared-period/show',data);
  },
  //账期抄表数据列表
  sharedPeriodRecordList: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/shared-period/record-list',data);
  },
  //房屋编辑选择公摊项目
  sharedSearchList: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/shared/shared-search-list',data);
  },
  //账期抄表数据新增金额计算
  getRecordMoney: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/shared-period/record-money',data);
  },
  //上次读数
  recordNumber: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/shared-period/record-number',data);
  },
  //账期抄表数据详情
  recordShow: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/shared-period/show-record',data);
  },
  //账期抄表数据新增
  recordAdd: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/shared-period/record-add',data);
  },
  //账期抄表数据编辑
  recordEdit: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/shared-period/record-edit',data);
  },
  //账期抄表数据删除
  recordDelete: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/shared-period/record-delete',data);
  },
  //生成账单
  createBill: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/shared-period/create-bill',data);
  },
  //账单列表
  sharedPeriodBillList: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/shared-period/bill-list',data);
  },
  //取消发布账单
  sharedPeriodCancelList: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/shared-period/cancel-bill',data);
  },
  //发布账单
  sharedPeriodpushBill: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/shared-period/push-bill',data);
  },
  //账单管理，导出账单
  alipayCostDownExportBill: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/alipay-cost/down-export-bill', data);
  },
  //账单管理，批量收款
  alipayCostGetPayExcel: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/alipay-cost/get-pay-excel', data);
  },
  //账单管理，导入账单
  alipayCostGetExcel: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/alipay-cost/get-excel', data);
  },

  //上传服务器
  sharedPeriodUpload: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/shared-period/upload',data);
  },
  //上传服务器
  sharedPeriodGetExcel: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/shared-period/get-excel',data);
  },
  //导出公摊账期明细
  billDetailReq: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/shared-period/export-bill',data);
  },
  //财务核销列表
  billIncomeReviewList: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/bill-income/review-list', data);
  },
  //核销/撤销核销
  billIncomeConfirm: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/bill-income/confirm', data);
  },
  // // 获取抄表周期列表
  getMeterReadingList: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/meter-reading/list', data);
  },
  //添加周期列表
  getMeterReadingAdd: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/meter-reading/add', data);
  },
  //水电表删除 property/meter-reading/delete
  meterReadingDelete: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/meter-reading/delete', data);
  },
  //抄表记录导出
  reportExport: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/meter-reading/export', data);
  },
  //抄表记录列表
  MeterReadingRecord: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/meter-reading/list-record', data);
  },
  //抄表生成账单
  generateBill: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/meter-reading/generate-bill', data);
  },
  //修改抄表记录读数接口
  editMeterNum: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/meter-reading/edit-meter-num', data);
  },
};
export default chargingManagement;
