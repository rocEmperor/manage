import React from 'react';
import { connect } from 'react-redux';
import { Form, Breadcrumb, Table, Input, Button, Card, Row, Col, Popconfirm, Icon, Select } from 'antd';
import { Link } from 'react-router-dom';
import { author } from '../../utils/util';
const FormItem = Form.Item;
const Option = Select.Option;
const formItemLayout = {
  labelCol: {
    span: 6
  },
  wrapperCol: {
    span: 16
  }
};
let communityParams = {
  page: 1,
  rows: 10,
  community_id: '',
  status: '',
  name: ''
};
function ChangingItemManagement(props) {
  let { dispatch, layout, ChangingItemManagementModel, form, loading, } = props;
  let { data, paginationTotal,is_reset } = ChangingItemManagementModel;
  const { getFieldDecorator } = form;
  if (is_reset == true) {
    form.resetFields();
    communityParams.page = 1;
    communityParams.rows = 10;
    dispatch({
      type: 'ChangingItemManagementModel/concat',
      payload: {
        is_reset: false,
      }
    });
  }
  function handSearch() {
    form.validateFields((err, values) => {
      communityParams.community_id = layout.communityId;
      communityParams.page = 1;
      communityParams.rows = 10;
      communityParams.status = values.status;
      communityParams.name = values.name;
      dispatch({
        type: 'ChangingItemManagementModel/billCostList',
        payload: communityParams
      })
    });
  }

  function handleReset(e) {
    communityParams = {
      page: 1,
      rows: 10,
      community_id: layout.communityId,
      status: '',
      name: ''
    };
    form.resetFields();
    dispatch({
      type: 'ChangingItemManagementModel/billCostList',
      payload: { community_id: layout.communityId }
    })
  }

  function handlePaginationChange(page) {
    communityParams.community_id = layout.communityId;
    communityParams.page = page;
    dispatch({
      type: 'ChangingItemManagementModel/billCostList',
      payload: communityParams
    })
  }

  function handleShowSizeChange(current, size) {
    communityParams.community_id = layout.communityId;
    communityParams.rows = size;
    communityParams.page = 1;
    dispatch({
      type: 'ChangingItemManagementModel/billCostList',
      payload: communityParams
    })
  }

  function changeStatus(record) {
    dispatch({
      type: 'ChangingItemManagementModel/billCostStatus',
      payload: {
        data: {
          id: record.id,
          community_id: layout.communityId,
          status: record.status == 1 ? 2 : 1
        },
        communityParams: communityParams
      }
    })
  }
  const columns = [{
    title: '缴费项目',
    dataIndex: 'name',
    key: 'name'
  }, {
    title: '项目说明',
    dataIndex: 'describe',
    key: 'describe'
  }, {
    title: '创建时间',
    dataIndex: 'create_at',
    key: 'create_at',
  }, {
    title: '状态',
    dataIndex: 'status_msg',
    key: 'status_msg'
  }, {
    title: '操作',
    dataIndex: 'desc',
    render: (text, record) => {
      let link = `/changingItemAdd?id=${record.id}`;
      return <div>
        {
          record.describe === '系统初始化' ? "" :
            (author('forbidden') ? <Popconfirm title={record.status === '2' ? '是否确认启用' : '是否确认禁用'} onConfirm={() => changeStatus(record)}>
              <a className="margin-right-10">{record.status === '2' ? '启用' : '禁用'}</a>
            </Popconfirm> : null)
        }
        {
          record.describe === '系统初始化' ? "" : (author('edit') ? <Link to={link} className="margin-right-10" style={{ marginLeft: 10 }}>编辑</Link> : null)
        }
      </div>
    }
  }];
  const pagination = {
    current: communityParams.page,
    pageSize: communityParams.size,
    onShowSizeChange: handleShowSizeChange,
    onChange: handlePaginationChange,
    total: parseInt(paginationTotal),
    pageSizeOptions: ['10', '20', '30', '40'],
    defaultPageSize: 10,
    showTotal(total, range) {
      return `共 ${parseInt(paginationTotal)} 条`
    }
  };
  return (
    <div className="page-content">
      <Breadcrumb separator="/">
        <Breadcrumb.Item>计费管理</Breadcrumb.Item>
        <Breadcrumb.Item>计费项目管理</Breadcrumb.Item>
      </Breadcrumb>
      <Card>
        <Form>
          <Row>
            <Col span={6}>
              <FormItem label="缴费项目" {...formItemLayout}>
                {getFieldDecorator('name')(<Input type="text" placeholder="请输入缴费项目" />
                )}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label="项目状态" {...formItemLayout}>
                {getFieldDecorator('status')(
                  <Select placeholder="请选择项目状态" notFoundContent="没有数据">
                    <Option value="1">启用</Option>
                    <Option value="2">禁用</Option>
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={12} style={{ textAlign: 'right', paddingRight: '35px' }}>
              <Button type="primary" onClick={handSearch} className="mr1" style={{ marginLeft: '10px' }} >查询</Button>
              <Button type="ghost" onClick={handleReset}>重置</Button>
            </Col>
          </Row>
        </Form>
      </Card>
      <Card className="mt1">
        {
          author('add') ?
            <Link to="/changingItemAdd">
              <span>
                <Button type="primary" className="mr1">
                  <Icon type="plus" />新增缴费项目
                </Button>
              </span>
            </Link> : null
        }
        <Table columns={columns} dataSource={data} className="mt1" pagination={pagination} rowKey={record => record.id} loading={loading} />
      </Card>
    </div>
  )
}
export default connect(state => {
  return {
    ChangingItemManagementModel: state.ChangingItemManagementModel,
    layout: state.MainLayout,
    loading: state.loading.models.ChangingItemManagementModel
  }
})(Form.create({})(ChangingItemManagement));
