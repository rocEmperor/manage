import React from 'react';
import { connect } from 'dva';
import { Form, Breadcrumb, Card, Button, Table, Popconfirm, Row, Col, Input, Select, TreeSelect } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
import { Link } from 'react-router-dom';
import { noData, author, download } from '../../../utils/util';

function DeviceAccount(props) {
  const { dispatch, loading, form, list, paginationTotal, params, statusType, treeData, is_reset, deviceIdType } = props;
  const { getFieldDecorator } = form;
  /**
   * 点击左侧菜单重置列表
   */
  if (is_reset == true) {
    form.resetFields();
    dispatch({
      type: 'DeviceAccount/concat',
      payload: {
        is_reset: false,
      }
    });
  }
  //布局
  const formItemLayout = {
    labelCol: {
      span: 8
    },
    wrapperCol: {
      span: 14
    },
  }
  //搜索
  function handSearch(val) {
    form.validateFields((err, values) => {
      dispatch({
        type: 'DeviceAccount/getDeviceList', payload: { ...params, ...values, page: 1 }
      });
    })
  }
  //重置
  function handleReset(val) {
    form.resetFields();
    form.validateFields((err, values) => {
      const payload = {
        page: 1,
        device_id: '',
        device_no: '',
        status: '',
        category_id: ''
      }
      dispatch({
        type: 'DeviceAccount/getDeviceList', payload
      });
    })
  }
  /**
   * 表格
   */
  const tableProps = {
    columns: [{
      title: '设备名称',
      dataIndex: 'name',
      key: 'name',
      render: noData
    }, {
      title: '设备分类',
      dataIndex: 'category_name',
      key: 'category_name',
      render: noData
    }, {
      title: '设备编号',
      dataIndex: 'device_no',
      key: 'device_no',
      render: noData
    }, {
      title: '安装地点',
      dataIndex: 'install_place',
      key: 'install_place',
      render: noData
    }, {
      title: '设备状态',
      dataIndex: 'status',
      key: 'status',
      render: noData
    }, {
      title: '供应商',
      dataIndex: 'supplier',
      key: 'supplier',
      render: noData
    }, {
      title: '设备负责人',
      dataIndex: 'leader',
      key: 'leader',
      render: noData
    }, {
      title: '拟报废日期',
      dataIndex: 'plan_scrap_at',
      key: 'plan_scrap_at',
      render: noData
    }, {
      title: '操作',
      dataIndex: 'desc',
      render: (text, record) => {
        let link = `/deviceAccountEdit?id=${record.id}`;
        let link2 = `/deviceAccountShow?id=${record.id}`;
        return <div>
          {author('view') ?
            <Link to={link2} className="mr1">查看</Link>
            : null}
          {author('edit') ?
            <Link to={link} className="mr1">编辑</Link>
            : null}
          <Popconfirm title="确定要删除吗？" onConfirm={removeInfo.bind(this, record)}>
            {author('remove') ?
              <a className="margin-right-10">删除</a>
              : null}
          </Popconfirm>
        </div>
      }
    }],
    dataSource: list,
    pagination: {
      total: paginationTotal ? Number(paginationTotal) : '',
      current: params.page,
      defaultCurrent: 1,
      defaultPageSize: 10,
      showTotal: (total, range) => `共有 ${paginationTotal} 条`,
      onChange: (page, pageSize) => {
        dispatch({
          type: 'DeviceAccount/getDeviceList',
          payload: { ...params, page }
        })
      },
    },
    rowKey: record => record.id,
    loading: loading
  }
  /**
   * 设备台账删除
   */
  function removeInfo(record) {
    dispatch({
      type: 'DeviceAccount/getDeviceDelete', payload: { id: record.id, community_id: params.community_id }
    });
  }
  /**
   * 导出
   */
  function exportReport() {
    dispatch({
      type: 'DeviceAccount/downFiles',
      payload: { ...params },
      callback(data) {
        download(data);
      }
    });
  }

  return (<div>
    <Breadcrumb separator=">">
      <Breadcrumb.Item>设备管理</Breadcrumb.Item>
      <Breadcrumb.Item>设备台账</Breadcrumb.Item>
    </Breadcrumb>
    <Card>
      <Form>
        <Row>
          <Col span={6}>
            <FormItem label="设备名称" {...formItemLayout}>
              {getFieldDecorator('device_id')(
                <Select placeholder="请选择" notFoundContent="没有数据" showSearch optionFilterProp="children">
                  {deviceIdType && deviceIdType.length > 0 ? deviceIdType.map((value, index) => { return <Option key={index} value={value.id} device_no={value.device_no}>{value.name}</Option> }) : null}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col span={6}>
            <FormItem label="设备编号" {...formItemLayout}>
              {getFieldDecorator('device_no')(<Input type="text" placeholder="请输入设备编号" />
              )}
            </FormItem>
          </Col>
          <Col span={6}>
            <FormItem label="设备状态" {...formItemLayout}>
              {getFieldDecorator('status')(
                <Select placeholder="请选择" notFoundContent="没有数据">
                  {statusType ? statusType.map((value, index) => { return <Option key={index} value={value.id}>{value.name}</Option> }) : null}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col span={6}>
            <FormItem label="设备类别" {...formItemLayout}>
              {getFieldDecorator('category_id')(
                <TreeSelect
                  dropdownStyle={{ maxHeight: 200, overflow: 'auto' }}
                  treeData={treeData}
                  placeholder="请选择"
                  treeDefaultExpandedKeys={["0"]}
                />
              )}
            </FormItem>
          </Col>
          <Col className="fr" span={4}>
            <Button type="primary" onClick={handSearch} className="mr1" style={{ marginLeft: '10px' }} >查询</Button>
            <Button type="ghost" onClick={handleReset}>重置</Button>
          </Col>

        </Row>
      </Form>
    </Card>
    <Card className="mt1">
      {author('add') ?
        <Link to="/deviceAccountAdd">
          <Button type="primary">新增设备</Button>
        </Link>
        : null}
      {author('export') ?
        <Button type="primary" style={{ marginLeft: "10px" }} onClick={exportReport}>导出</Button>
        : null}
      <Table className="mt1" {...tableProps} />
    </Card>
  </div>)
}
function mapStateToProps(state) {
  return {
    ...state.DeviceAccount,
    loading: state.loading.models.DeviceAccount
  };
}
export default connect(mapStateToProps)(Form.create()(DeviceAccount));
