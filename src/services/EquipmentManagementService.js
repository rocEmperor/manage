import request from '../utils/request';

const equipmentManagementService = {
  deviceCategoryList: (parameter) => {/*设备分类列表*/
    const data = JSON.stringify(parameter);
    return request('/inspect/property/device/device-category-list', data);
  },
  deviceCategoryDropDown: (parameter) => {/*上级类别下拉*/
    const data = JSON.stringify(parameter);
    return request('/inspect/property/device/device-category-drop-down', data);
  },
  deviceCategoryAdd: (parameter) => {/*设备分类新增*/
    const data = JSON.stringify(parameter);
    return request('/inspect/property/device/device-category-add', data);
  },
  deviceCategoryEdit: (parameter) => {/*设备分类编辑*/
    const data = JSON.stringify(parameter);
    return request('/inspect/property/device/device-category-edit', data);
  },
  deviceCategoryShow: (parameter) => {/*设备分类详情*/
    const data = JSON.stringify(parameter);
    return request('/inspect/property/device/device-category-show', data);
  },
  deviceCategoryDelete: (parameter) => {/*设备分类删除*/
    const data = JSON.stringify(parameter);
    return request('/inspect/property/device/device-category-delete', data);
  },

  deviceDropDown: (parameter) => {/*设备下拉列表*/
    const data = JSON.stringify(parameter);
    return request('/inspect/property/device/device-drop-down', data);
  },
  deviceList: (parameter) => {/*设备列表*/
    const data = JSON.stringify(parameter);
    return request('/inspect/property/device/device-list', data);
  },
  deviceDelete: (parameter) => {/*设备删除*/
    const data = JSON.stringify(parameter);
    return request('/inspect/property/device/device-delete', data);
  },
  deviceExport: (parameter) => {/*设备导出*/
    const data = JSON.stringify(parameter);
    return request('/inspect/property/device/device-export', data);
  },
  deviceAdd: (parameter) => {/*设备新增*/
    const data = JSON.stringify(parameter);
    return request('/inspect/property/device/device-add', data);
  },
  deviceEdit: (parameter) => {/*设备编辑*/
    const data = JSON.stringify(parameter);
    return request('/inspect/property/device/device-edit', data);
  },
  deviceShow: (parameter) => {/*设备详情*/
    const data = JSON.stringify(parameter);
    return request('/inspect/property/device/device-show', data);
  },

  deviceRepairList: (parameter) => {/*保养登记列表*/
    const data = JSON.stringify(parameter);
    return request('/inspect/property/device/device-repair-list', data);
  },
  deviceRepairDelete: (parameter) => {/*保养登记删除*/
    const data = JSON.stringify(parameter);
    return request('/inspect/property/device/device-repair-delete', data);
  },
  deviceRepairExport: (parameter) => {/*保养登记导出*/
    const data = JSON.stringify(parameter);
    return request('/inspect/property/device/device-repair-export', data);
  },
  deviceRepairAdd: (parameter) => {/*保养登记新增*/
    const data = JSON.stringify(parameter);
    return request('/inspect/property/device/device-repair-add', data);
  },
  deviceRepairEdit: (parameter) => {/*保养登记编辑*/
    const data = JSON.stringify(parameter);
    return request('/inspect/property/device/device-repair-edit', data);
  },
  deviceRepairShow: (parameter) => {/*保养登记详情*/
    const data = JSON.stringify(parameter);
    return request('/inspect/property/device/device-repair-show', data);
  },

  // 重大事故列表
  accidentList: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/inspect/property/device/device-accident-list', data);
  },
  // 重大事故删除
  accidentDelete: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/inspect/property/device/device-accident-delete', data);
  },
  // 重大事故新增
  accidentAdd: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/inspect/property/device/device-accident-add', data);
  },
  // 重大事故编辑
  accidentEdit: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/inspect/property/device/device-accident-edit', data);
  },
  // 重大事故详情
  accidentShow: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/inspect/property/device/device-accident-show', data);
  },
  // 重大事故导出
  accidentExport: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/inspect/property/device/device-accident-export', data);
  },
  downFile: (parameter) => {/** 文件下载 */
    const data = JSON.stringify(parameter);
    return request('/inspect/property/device/down-file', data);
  },
};

export default equipmentManagementService;