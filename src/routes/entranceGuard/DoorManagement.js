import React from 'react';
import { connect } from 'dva';
import { Link } from 'react-router-dom';
import { Breadcrumb, Form, Card, Select, Button, Input, Col, Row, DatePicker, Table, Popconfirm, Cascader, Popover } from 'antd';
import { author, noData } from '../../utils/util';
import './index.less';
const FormItem = Form.Item;
const Option = Select.Option;

function DoorManagement(props) {
  const { dispatch, form, list, totals, params, loading, is_reset, treeData, supplierOption } = props;
  const { getFieldDecorator } = form;

  if (is_reset == true) {
    form.resetFields();
    dispatch({
      type: 'DoorManagement/concat',
      payload: {
        is_reset: false,
      }
    });
  }
  function reload(params) {
    dispatch({
      type: 'DoorManagement/smartDoorList',
      payload: params,
    });
    dispatch({
      type: 'DoorManagement/concat',
      payload: { params: params },
    });
  }

  //搜索确定
  function handleSubmit(e) {
    form.validateFields((err, values) => {
      
      let arr = values.unit_id?values.unit_id:[];
      let str = values.unit_id?arr.join('-'):"";
      const param = {
        device_id: values.device_id,
        status: values.status,
        supplier_id: values.supplier_id,
        unit_id: str
      };
      
      param.page = 1;
      param.rows = 10;
      param.community_id = sessionStorage.getItem("communityId");
      if (values.time && values.time.length > 0) {
        param.start_time = values.time ? values.time[0].format('YYYY-MM-DD') : '';
        param.end_time = values.time ? values.time[1].format('YYYY-MM-DD') : '';
      } else {
        param.start_time = '';
        param.end_time = '';
      }
      reload(param);
    })
  }
  //重置按钮
  function handleReset() {
    form.resetFields();
    form.validateFields((err, values) => {
      const param = {
        page: 1,
        rows: 10,
        community_id: sessionStorage.getItem("communityId"),
        device_id: "",
        status: "",
        supplier_id: "",
        unit_id: "",
        start_time: '',
        end_time: '',
      }
      reload(param);
    })
  }
  /**
   * 
   * @param {status} record
   * record.status = 1 启用
   * record.status = 2 禁用
   */
  function handleOk(record) {
    dispatch({
      type: 'DoorManagement/disabledDropDown',
      payload: {
        id: record.id,
        status: record.status == 1 ? 2 : 1,
        community_id: sessionStorage.getItem("communityId"),
      }
    })
  }
  /**
   * 楼宇单元
   * @param  {Array} data
   */
  function renderPermissionsDetails(data) {
    if (data.length == 1) {
      return <span>{data.length != 0 ? data[0].name : '-'}</span>
    } else {
      return (
        <Popover title="楼宇单元详情" overlayClassName="antdScroll" placement="right" content={data.map((value, index) => {
          return (
            <span key={index}>{(index + 1) + '. ' + value.name}<br /></span>
          )
        })}>
          <a>查看详情</a>
        </Popover>
      )
    }

  }
  // 删除
  function removeInfo(record) {
    dispatch({
      type: 'DoorManagement/doorDelete',
      payload: {
        id: record.id,
        community_id: sessionStorage.getItem("communityId"),
      }
    })
  }
  const formItemLayout = {
    labelCol: {
      span: 6
    },
    wrapperCol: {
      span: 16
    },
  };
  const formItemLayout2 = {
    labelCol: {
      span: 3
    },
    wrapperCol: {
      span: 21
    },
  }
  const {
    RangePicker
  } = DatePicker;
  const columns = [{
    title: '苑期区',
    dataIndex: 'permission',
    key: 'permission',
    render: (text, record, index) => renderPermissionsDetails(record.permission)
  }, {
    title: '门禁名称',
    dataIndex: 'name',
    key: 'name',
  }, {
    title: '设备类型',
    dataIndex: 'type_name',
    key: 'type_name',
  }, {
    title: '设备厂商',
    dataIndex: 'supplier_name',
    key: 'supplier_name',
  }, {
    title: '设备序列号',
    dataIndex: 'device_id',
    key: 'device_id',
    width: '25%'
  }, {
    title: '备注',
    dataIndex: 'note',
    key: 'note',
    render: (text, record) => {
      if (text) {
        if (text.length > 10) {
          return <span title={text}>{text.substring(0, 10) + '...'}</span>
        } else {
          return text
        }
      } else {
        return noData()
      }
    }
  }, {
    title: '启用状态',
    dataIndex: 'status_name',
    key: 'status_name',
  }, {
    title: '添加时间',
    dataIndex: 'create_time',
    key: 'create_time',
  }, {
    title: '操作',
    dataIndex: 'desc',
    render: (text, record) => {
      let link = `/doorAdd?id=${record.id}`;
      return <div>
        <div>
          {
            author('disabled') ?
              <Popconfirm title={record.status == 1 ? '确定禁用吗' : '确定启用吗?'} okText="确认" cancelText="取消" onConfirm={handleOk.bind(this, record)}>
                <a className="ml1">{record.status == 1 ? '禁用' : '启用'}</a>
              </Popconfirm> : null
          }
          {author('edit') ? <Link to={link} className="ml1">编辑</Link> : null}
          {
            author('delete') ?
              <Popconfirm title="确定删除吗？" okText="确认" cancelText="取消" onConfirm={removeInfo.bind(this, record)}>
                <a className="ml1">删除</a>
              </Popconfirm> : null
          }
        </div>
      </div>
    }
  }];
  const pagination = {
    showTotal(total, range) {
      return '共 ' + totals + ' 条'
    },
    defaultCurrent: 1,
    current: params.page,
    defaultPageSize: 10,
    total: Number(totals),
    onChange: (page, size) => { dispatch({ type: 'DoorManagement/smartDoorList', payload: { ...params, page } }) },
  };
  const tableProps = {
    rowKey: record => record.id,
    loading: loading,
    columns: columns,
    dataSource: list
  };

  return (
    <div className="page-content">
      <Breadcrumb separator=">">
        <Breadcrumb.Item>智能门禁</Breadcrumb.Item>
        <Breadcrumb.Item>智能门禁管理</Breadcrumb.Item>
      </Breadcrumb>
      <Card className="section">
        <Form>
          <Row>
            <Col span={6}>
              <FormItem label="苑/期/区" {...formItemLayout}>
                {getFieldDecorator('unit_id')(
                  <Cascader
                    options={treeData}
                    placeholder="请选择苑/期/区"
                    changeOnSelect
                  />
                )}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label="设备序列号" {...formItemLayout}>
                {getFieldDecorator('device_id')(<Input placeholder="请输入设备序列号" />)}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label="状态" {...formItemLayout}>
                {getFieldDecorator('status')(
                  <Select placeholder="请选择状态">
                    <Option value="">全部</Option>
                    <Option key="1" value="1">启用</Option>
                    <Option key="2" value="2">禁用</Option>
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label="设备厂商" {...formItemLayout}>
                {getFieldDecorator('supplier_id')(
                  <Select placeholder="请选择设备厂商">
                    {supplierOption ? supplierOption.map((item) => {
                      return <Option key={item.id} value={item.id}>{item.name}</Option>
                    }) : null}
                  </Select>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <FormItem label="添加时间" {...formItemLayout2}>
                {getFieldDecorator('time')(<RangePicker style={{ width: '96%' }} />)}
              </FormItem>
            </Col>
            <Col span={5} offset={1} className="fr">
              <Button type="primary" className="mr1" onClick={handleSubmit}>查询</Button>
              <Button type="ghost" onClick={handleReset}>重置</Button>
            </Col>
          </Row>
        </Form>
      </Card>
      <Card className="mt1">
        {
          author('add') ? <Link to="/doorAdd"><Button type="primary">新增设备</Button></Link> : null
        }

        <Table className="mt1" {...tableProps} pagination={pagination} />
      </Card>
    </div>
  )
}

function mapStateToProps(state) {
  return {
    ...state.DoorManagement,
    loading: state.loading.models.DoorManagement
  };
}
export default connect(mapStateToProps)(Form.create()(DoorManagement));