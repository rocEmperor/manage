**设备管理-设备分类-新增/编辑**

	请求参数列表
	data:{
	    super_id: "上级类别",
	    name: "类别名称",
	    note: "类别说明",
		id: "编辑时候传"
	},

- super_id:上级类别     字段校验:一个下拉列表对应的id值,必选,string（支持无限极展示）
- name:类别名称         字段校验:15个字以内，必填，string
- note:类别说明         字段校验:100字以内，非必填,string（textarea多行）
- id:页面id 字段校验：编辑必填，number

**设备管理-设备分类-列表页**

	请求参数列表
	data:{
	    page: "分页",
	    rows: "分页页码",
	},
	响应参数列表
	data:{
		list:[
		    name: "类别名称",
		    note: "类别说明",
			id: "页面id",
			children: [
			    name: "类别名称",
			    note: "类别说明",
				id: "页面id",
			],
		]
	},


- page:分页 字段校验：非必填，number，1
- rows:分页页码 字段校验：非必填，number，10
- children:子类别 字段校验：非必填，array，

**设备管理-设备台账-新增/编辑**

	请求参数列表
	data:{
	    device_type_id: "设备分类id",
	    device_name: "设备名称",
	    device_num: "设备编号",
		norm: "技术规格",
		amount: "数量",
		unit_price: "单价",
		supplier: "供应商",
		supplier_phone: "供应商联系电话",
		install_location: "安装地点",
		principal: "设备负责人",
		device_status_id: "设备状态",
		retired_date: "拟报废日期",
		factory_date: "出厂日期",
		warranty_deadline: "保修截止日期",
		life_span: "寿命年限",
		warranty_unit: "保修单位",
		create_unit: "制造单位",
		create_unit_phone: "制造单位电话",
		install_unit: "安装单位",
		install_unit_phone: "安装单位电话",
		note: "备注",
		data_annex: "设备资料附件",
		retired_people: "报废人",
		retired_directions: "报废说明",
		id: "编辑时候传"
	},

- device_type_id:设备分类     字段校验:一个下拉列表对应的id值,必选,string
- device_name:设备名称         字段校验: 必填，15字以内，string
- device_num:设备编号         字段校验:必填，15字以内；number
- norm:技术规格         字段校验:选填，15字以内；number
- amount:数量         字段校验:选填，整数数字。
- unit_price:单价         字段校验:选填，数字
- supplier:供应商         字段校验:必填，15字以内；
- supplier_phone:供应商联系电话         字段校验:必填，11位数字；
- install_location:安装地点         字段校验:必填，15字以内；
- principal:设备负责人         字段校验:必填，15字以内
- device_status_id:设备状态         字段校验:必选，运行or报废；若为报废，需填写报废人和报废说明；
- retired_date:拟报废日期         字段校验:必填，日期控件，年月日；
- factory_date:出厂日期         字段校验:选填，日期控件，年月日；
- warranty_deadline:保修截止日期         字段校验:选填，日期控件，年月日；
- life_span:寿命年限         字段校验:选填，整数数字；
- warranty_unit:保修单位         字段校验:选填，15字以内；
- create_unit:制造单位         字段校验:选填，15字以内；
- create_unit_phone:制造单位电话         字段校验:选填，11位电话号码
- install_unit: "安装单位",         字段校验:选填，15字以内
- install_unit_phone: "安装单位电话",         字段校验:选填，11位电话号码
- note: "备注",         字段校验:选填，200字以内
- data_annex: "设备资料附件",         字段校验:只可上传一个附件，格式：.doc,.ppt,.excel,.pdf,.jpeg等；
- retired_people: "报废人",         字段校验:必填，15字以内；
- retired_directions: "报废说明",         字段校验:必填，200字以内；
- id:页面id 字段校验：编辑必填，number