import React from 'react';
import { connect } from 'dva';
import { Form, Tabs, Breadcrumb, Card, Button, Row, Table } from 'antd';
const TabPane = Tabs.TabPane;
import { noData } from '../../utils/util';

function CarportManagementView(props) {
  const { form, detail, dispatch, params, list, totals, loading } = props;
  const { getFieldDecorator } = form;

  /**
   * 布局
   */
  const formItemLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 },
    style: { maxWidth: '600px', marginBottom: "10px" }
  }

  /**
   * 车辆信息
   * @param {*} key 
   */
  function callback(key) {

  }
  /**
   * 返回上一页
   */
  function handleBack(e) {
    history.go(-1);
  }
  const tableProps = {
    columns: [{
      title: '车牌号码',
      dataIndex: 'car_num',
      key: 'car_num',
      render: noData
    }, {
      title: '是否住户',
      dataIndex: 'room_type_label',
      key: 'room_type_label',
      render: noData
    }, {
      title: '车主姓名',
      dataIndex: 'user_name',
      key: 'user_name',
      render: noData
    }, {
      title: '车主电话',
      dataIndex: 'user_mobile',
      key: 'user_mobile',
      render: noData
    }, {
      title: '停车场',
      dataIndex: 'lot_name',
      key: 'lot_name',
      render: noData
    }, {
      title: '场区',
      dataIndex: 'lot_area_name',
      key: 'lot_area_name',
      render: noData
    }, {
      title: '车位类型',
      dataIndex: 'car_port_type_label',
      key: 'car_port_type_label',
      render: noData
    }, {
      title: '车位号',
      dataIndex: 'car_port_num',
      key: 'car_port_num',
      render: noData
    }, {
      title: '停车卡号',
      dataIndex: 'park_card_no',
      key: 'park_card_no',
      render: noData
    }, {
      title: '有效期开始时间',
      dataIndex: 'carport_rent_start',
      key: 'carport_rent_start',
      render: noData
    }, {
      title: '有效期结束时间',
      dataIndex: 'carport_rent_end',
      key: 'carport_rent_end',
      render: noData
    }],
    dataSource: list,
    pagination: {
      showTotal: (total, range) => `共 ${totals} 条`,
      current: params.page,
      defaultCurrent: 1,
      defaultPageSize: 10,
      total: Number(totals),
      onChange: (page, size) => { dispatch({ type: 'CarportManagementView/ownerList', payload: { ...params, page } }) },
    },
    rowKey: (record, index) => index,
    loading: loading,
  }
  return (<div>
    <Breadcrumb separator=">">
      <Breadcrumb.Item>停车管理</Breadcrumb.Item>
      <Breadcrumb.Item><a href="#/carportManagement">车位管理</a></Breadcrumb.Item>
      <Breadcrumb.Item>查看</Breadcrumb.Item>
    </Breadcrumb>
    <Card>

      <Tabs defaultActiveKey="1" onChange={callback} style={{ "minHeight": "500px" }}>
        <TabPane tab="车位信息" key="1">
          <Form>
            <Form.Item label="停车场" {...formItemLayout}>
              {getFieldDecorator('lot_id', {
                initialValue: detail.lot_id,
              })(
                <span>{detail.lot_name}</span>
              )}
            </Form.Item>
            <Form.Item label="停车区域" {...formItemLayout}>
              {getFieldDecorator('lot_area_id', {
                initialValue: detail.lot_area_id,
                rules: []
              })(
                <span>{detail.lot_area_name}</span>
              )}
            </Form.Item>
            <Form.Item label="车位号" {...formItemLayout}>
              {getFieldDecorator('car_port_num', {
                initialValue: detail.car_port_num,
              })(
                <span>{detail.car_port_num}</span>
              )}
            </Form.Item>
            <Form.Item label="车位类型" {...formItemLayout}>
              {getFieldDecorator('car_port_type', {
                initialValue: detail.car_port_type,
              })(
                <span>{detail.type?detail.type.name:''}</span>
              )}
            </Form.Item>
            <Form.Item label="车位面积" {...formItemLayout}>
              {getFieldDecorator('car_port_area', {
                initialValue: detail.car_port_area,
                rules: [],
              })(
                <span>{detail.car_port_area}</span>
              )}
            </Form.Item>
            <Form.Item label="使用状态" {...formItemLayout}>
              {getFieldDecorator('car_port_status', {
                initialValue: detail.car_port_status,
              })(
                <span>{detail.status?detail.status.name:''}</span>
              )}
            </Form.Item>
            <Form.Item label="关联房产" {...formItemLayout}>
              <Row gutter={18}>

                <Form.Item>
                  {getFieldDecorator('room_address', {
                    initialValue: detail.room_address,
                    rules: [],
                  })(
                    <span>{detail.room_address}</span>
                  )}
                </Form.Item>

              </Row>
            </Form.Item>
            <Form.Item label="产权人" {...formItemLayout}>
              {getFieldDecorator('room_name', {
                initialValue: detail.room_name,
                rules: [],
              })(
                <span>{detail.room_name}</span>
              )}
            </Form.Item>
            <Form.Item label="联系电话" {...formItemLayout}>
              {getFieldDecorator('room_mobile', {
                initialValue: detail.room_mobile,
                rules: [],
              })(
                <span>{detail.room_mobile}</span>
              )}
            </Form.Item>

          </Form>

        </TabPane>
        <TabPane tab="车辆信息" key="2">
          <Table className="mt1" {...tableProps} />
        </TabPane>
      </Tabs>
      <Form.Item style={{ maxWidth: '600px' }} wrapperCol={{ span: 8, offset: 4 }}>
        <Button className="ml1" onClick={handleBack}>返回</Button>
      </Form.Item>
    </Card>
  </div>)
}
function mapStateToProps(state) {
  return {
    ...state.CarportManagementView,
    loading: state.loading.models.CarportManagementView
  };
}
export default connect(mapStateToProps)(Form.create()(CarportManagementView));
