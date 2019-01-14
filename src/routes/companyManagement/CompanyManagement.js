import React from 'react';
import { connect } from 'dva';
import { Breadcrumb, Card, Form, Row, Col, Select, Input, Button, Table, Icon } from 'antd';

const FormItem = Form.Item;

function CompanyManagement(props) {
  const { form, list, total } = props;
  const { getFieldDecorator } = form;
  function handlePaginationChange(pagination, size) {

  }
  const formItemLayout = {
    labelCol: {
      span: 6,
    },
    wrapperCol: {
      span: 16,
    },
  };
  const pagination = {
    onChange: handlePaginationChange,
    total: parseInt(total),
    showTotal: total => `共${total}条`,
  };
  const columns = [{
    title: '所属省',
    dataIndex: 'province_name',
    key: 'province_name',
  }, {
    title: '所属市',
    dataIndex: 'city_name',
    key: 'city_name',
  }, {
    title: '小区|园区名称',
    dataIndex: 'community_name',
    key: 'community_name',
  }, {
    title: '小区地址',
    dataIndex: 'address',
    key: 'address',
  }, {
    title: '车位号',
    dataIndex: 'park_no',
    key: 'park_no',
    render: (text, record) => {
      if (text === 1) {
        return '启用';
      }
      return '禁用';
    },
  }, {
    title: '发布人',
    dataIndex: 'user_name',
    key: 'user_name',
  }, {
    title: '联系电话',
    dataIndex: 'mobile',
    key: 'mobile',
  }, {
    title: '车位状态',
    dataIndex: 'status.name',
    key: 'status.name',
  }, {
    title: '操作',
    dataIndex: 'desc',
    key: 'desc',
  }];
  return (
    <div>
      <Breadcrumb separator=">">
        <Breadcrumb.Item>企业管理</Breadcrumb.Item>
        <Breadcrumb.Item>公司管理</Breadcrumb.Item>
      </Breadcrumb>
      <Card className="section">
        <Form>
          <Row>
            <Col span={6}>
              <FormItem label="车位号" {...formItemLayout}>
                {getFieldDecorator('park_no')(<Input placeholder="请输入车位号" />,
                )}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label="发布人" {...formItemLayout}>
                {getFieldDecorator('user_name')(<Input placeholder="请输入发布人" />,
                )}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label="车位号" {...formItemLayout}>
                {getFieldDecorator('park_no')(<Input placeholder="请输入车位号" />,
                )}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label="发布人" {...formItemLayout}>
                {getFieldDecorator('user_name')(<Input placeholder="请输入发布人" />,
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={6}>
              <FormItem label="联系电话" {...formItemLayout}>
                {getFieldDecorator('mobile')(<Input placeholder="请输入发布人联系电话" />,
                )}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label="小区名称" {...formItemLayout}>
                {getFieldDecorator('community_id')(
                  <Select placeholder="请选择小区">

                    {
                    // {communitys.map((value,index)=>{
                    //   return <Option value={value.id+""} key={index}>{value.name}</Option>
                    // })}
                    }

                  </Select>,
                )}
              </FormItem>
            </Col>
            <Col span={5} offset={6}>
              <Button type="primary" className="mr1">查询</Button>
              <Button type="ghost">重置</Button>
            </Col>
          </Row>
        </Form>
      </Card>
      <Card>
        <Button type="primary"><Icon type="plus" />新增物业公司</Button>
        <Table className="mt1" dataSource={list} columns={columns} pagination={pagination} />
      </Card>
    </div>
  );
}

CompanyManagement.propTypes = {
};
export default connect()(Form.create()(CompanyManagement));
