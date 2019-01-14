export default {
  namespace: 'Question',
  state: {
    data: [{
      question: '账号登录后，发现一片空白',
      answer: '检查该账号权限是否配置正确，联系权限配置人员'
    }, {
      question: '导入房屋数据时，下载了模板，可是无法打开模板',
      answer: '更换wps打开，若安装了office2003，可安装office2007兼容包解决。'
    }, {
      question: '打开物业系统时，发现物业系统显示错乱了',
      answer: '更换浏览器，推荐使用谷歌浏览器。'
    }, {
      question: '导入做好的模板后，发现系统变得好慢',
      answer: '导入数据量偏大，会造成系统反应变慢，耐心等待即可。'
    }, {
      question: '导入账单后，需要点击【确认并发布账单】，才能最终完成账单发布，但是在检查导入的数据，发现出错了，此时又不能将导入的数据修改或撤回，需要如何操作才行',
      answer: '迅速联系技术部处理，在导入账单的时候，必须确保导入账单的数据正确'
    }, {
      question: '登录系统后，没有立即跳转到登录界面，但是操作一段时间后，却自动跳转到了登录界面',
      answer: '检查浏览器插件，某些恶意插件将影响系统操作，比如“返利宝宝”、“口水党”（目前已知恶意插件），可使用腾讯电脑管家等安全软件进行卸载插件'
    }, {
      question: '如何开启浏览器“记住密码”功能，方便下次登录？',
      answer: '多数浏览器会在登录时自动提示用户是否记住密码，若此功能被用户关闭，可在浏览器设置—安全菜单，勾选记住登录信息（以火狐浏览器为例）'
    }, {
      question: '发现支付宝账户中，莫名多了（或少了）金额',
      answer: '登录支付宝网站，下载某时间段下的账单明细表，在明细表中查找账单，查看对方账号（即发生账单业务的对方支付宝账号），备注（一般都写明业务原因）'
    }]
  },
  reducers: {
    concat(state, { payload }) {
      return { ...state, ...payload }
    }
  },
  effects: {
    *init({ payload }, { call, put, select }) {
    }
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, search }) => {
      })
    }
  }
}
