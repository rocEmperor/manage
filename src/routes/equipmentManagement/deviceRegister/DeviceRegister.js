import React from 'react';
import { connect } from 'dva';
import { Form, Breadcrumb, Card, Button, Table, Popconfirm, Row, Col, Input, Select, DatePicker } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
const { RangePicker } = DatePicker;
import { Link } from 'react-router-dom';
import { noData, author, download } from '../../../utils/util';

function DeviceRegister(props) {
  const { dispatch, loading, form, list, paginationTotal, params, statusType, is_reset, deviceIdType } = props;
  const { getFieldDecorator } = form;
  /**
   * 点击左侧菜单重置列表
   */
  if (is_reset == true) {
    form.resetFields();
    dispatch({
      type: 'DeviceRegister/concat',
      payload: {
        is_reset: false,
      }
    });
  }
  //布局
  const formItemLayout = {
    labelCol: {
      span: 6
    },
    wrapperCol: {
      span: 16
    },
  }
  const formItemLayout2 = {
    labelCol: {
      span: 3
    },
    wrapperCol: {
      span: 21
    },
  }
  //搜索
  function handSearch(val) {
    form.validateFields((err, values) => {
      let start_at;
      let end_at;
      if (values.date && values.date.length > 0) {
        start_at = values.date[0].format('YYYY-MM-DD');
        end_at = values.date[1].format('YYYY-MM-DD');
        delete values.date;
      } else {
        delete values.date;
      }
      const payload = { ...params, ...values, start_at, end_at, page: 1 };
      dispatch({
        type: 'DeviceRegister/getDeviceRepairList', payload
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
        repair_person: '',
        status: '',
        start_at: '',
        end_at: ''
      }
      dispatch({
        type: 'DeviceRegister/getDeviceRepairList', payload
      });
    })
  }
  /**
   * 表格
   */
  const tableProps = {
    columns: [{
      title: '设备编号',
      dataIndex: 'device_no',
      key: 'device_no',
      render: noData
    }, {
      title: '设备名称',
      dataIndex: 'device_name',
      key: 'device_name',
      render: noData
    }, {
      title: '保养人',
      dataIndex: 'repair_person',
      key: 'repair_person',
      render: noData
    }, {
      title: '保养开始时间',
      dataIndex: 'start_at',
      key: 'start_at',
      render: noData
    }, {
      title: '保养结束时间',
      dataIndex: 'end_at',
      key: 'end_at',
      render: noData
    }, {
      title: '保养状态',
      dataIndex: 'status',
      key: 'status',
      render: noData
    }, {
      title: '检查人',
      dataIndex: 'check_person',
      key: 'check_person',
      render: noData
    }, {
      title: '检查日期',
      dataIndex: 'check_at',
      key: 'check_at',
      render: noData
    }, {
      title: '操作',
      dataIndex: 'desc',
      render: (text, record) => {
        let link = `/deviceRegisterEdit?id=${record.id}`;
        let link2 = `/deviceRegisterShow?id=${record.id}`;
        return <div>
          {author('view') ?
            <Link to={link2} className="mr1">查看</Link>
            : null}
          {author('edit') ?
            <Link to={link} className="mr1">编辑</Link>
            : null}
          <Popconfirm title="确定要删除吗？" onConfirm={removeInfo.bind(this, record)}>
            {author('remove') ?
              <a className="mr1">删除</a>
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
          type: 'DeviceRegister/getDeviceRepairList',
          payload: { ...params, page }
        })
      },
    },
    rowKey: record => record.id,
    loading: loading
  }
  /**
   * 设备保养登记删除
   */
  function removeInfo(record) {
    dispatch({
      type: 'DeviceRegister/getDeviceRepairDelete', payload: { id: record.id,community_id: params.community_id }
    });
  }
  /**
   * 导出
   */
  function exportReport() {
    dispatch({
      type: 'DeviceRegister/downFiles',
      payload: { ...params },
      callback(data) {
        download(data);
      }
    });
  }

  return (<div>
    <Breadcrumb separator=">">
      <Breadcrumb.Item>设备管理</Breadcrumb.Item>
      <Breadcrumb.Item>设备保养登记</Breadcrumb.Item>
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
            <FormItem label="保养人员" {...formItemLayout}>
              {getFieldDecorator('repair_person')(<Input type="text" placeholder="请输入保养人员" />
              )}
            </FormItem>
          </Col>
          <Col span={6}>
            <FormItem label="保养状态" {...formItemLayout}>
              {getFieldDecorator('status')(
                <Select placeholder="请选择" notFoundContent="没有数据">
                  {statusType ? statusType.map((value, index) => { return <Option key={index} value={value.id}>{value.name}</Option> }) : null}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label="保养时间" {...formItemLayout2}>
              {getFieldDecorator('date')(<RangePicker style={{ width: '96%' }} />
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
        <Link to="/deviceRegisterAdd">
          <Button type="primary">新增保养登记</Button>
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
    ...state.DeviceRegister,
    loading: state.loading.models.DeviceRegister
  };
}
export default connect(mapStateToProps)(Form.create()(DeviceRegister));
