import React from 'react';
import { connect } from 'dva';
import { Form, Breadcrumb, Card, Button, Table, Popconfirm, Row, Col, Input } from 'antd';
import { Link } from 'react-router-dom';
import { noData, author } from '../../utils/util';
const FormItem = Form.Item;

function ParkingLotManagement(props) {
  const { dispatch, loading, form, list, params, is_reset } = props;
  const { getFieldDecorator } = form;
  /**
   * 点击左菜单更新数据
  */
  if (is_reset == true) {
    form.resetFields();
    dispatch({
      type: 'ParkingLotManagement/concat',
      payload: {
        is_reset: false,
      }
    });
  }
  /**
   * 布局
   */
  const formItemLayout = {
    labelCol: {
      span: 8
    },
    wrapperCol: {
      span: 14
    },
  }
  /**
   * 表格
   */
  const tableProps = {
    columns: [{
      title: '名称',
      dataIndex: 'label',
      key: 'label',
      width: "50%",
      render: (text, record) => {
        if(record.checked == true){
          return <span style={{color: 'red'}} key={record.value}>{record.label}</span>
        }else{
          return <span key={record.value}>{record.label}</span>
        }
      }
    }, {
      title: '编号',
      dataIndex: 'value',
      key: 'value',
      width: "30%",
      render: noData
    },{
      title: '操作',
      dataIndex: 'desc',
      width: "20%",
      render: (text, record) => {
        return <div>
          {author('edit') ? '' : null}
          <a className="mr1" onClick={onClickEdit.bind(this, record)} >编辑</a>
          {author('remove') ? '' : null}
          <Popconfirm title="确定要删除吗？" onConfirm={removeInfo.bind(this, record)}>
            <a className="margin-right-10">删除</a>
          </Popconfirm>
        </div>
      }
    }],
    dataSource: list.slice(),
    pagination: false,
    rowKey: (index) => index,
    loading: loading
  }

  function onClickEdit(record) {
    window.location.href = `#/parkingLotManagementEdit?id=${record.value}`;
  }
  /**
   * 删除
   */
  function removeInfo(record) {
    dispatch({
      type: 'ParkingLotManagement/getLotAreaDelete', payload: { id: record.value, community_id: params.community_id }
    });
  }
  /**
   * 搜索
   */
  function handSearch(val) {
    form.validateFields((err, values) => {
      dispatch({
        type: 'ParkingLotManagement/getLotListNew', payload: { ...params, ...values }
      });
    })
  }
  /**
   * 重置
   */
  function handleReset(val) {
    form.resetFields();
    form.validateFields((err, values) => {
      const payload = {
        name: ''
      }
      dispatch({
        type: 'ParkingLotManagement/getLotListNew', payload
      });
    })
  }

  return (<div>
    <Breadcrumb separator=">">
      <Breadcrumb.Item>停车管理</Breadcrumb.Item>
      <Breadcrumb.Item>车场管理</Breadcrumb.Item>
    </Breadcrumb>
    <Card>
      <Form>
        <Row>
          <Col span={8}>
            <FormItem label="停车场" {...formItemLayout}>
              {getFieldDecorator('name')(<Input type="text" placeholder="请输入停车场和区域名称" />
              )}
            </FormItem>
          </Col>
          <Col className="fr" span={4}>
            <Button type="primary" onClick={handSearch} className="mr1">查询</Button>
            <Button type="ghost" onClick={handleReset}>重置</Button>
          </Col>
        </Row>
      </Form>
    </Card>
    <Card className="mt1">
      {author('add') ? '' : null}
      <Link to="/parkingLotManagementAdd">
        <Button type="primary">新增停车场</Button>
      </Link>
      <Table className="mt1" {...tableProps} />
    </Card>
  </div>)
}
function mapStateToProps(state) {
  return {
    ...state.ParkingLotManagement,
    loading: state.loading.models.ParkingLotManagement
  };
}
export default connect(mapStateToProps)(Form.create()(ParkingLotManagement));
