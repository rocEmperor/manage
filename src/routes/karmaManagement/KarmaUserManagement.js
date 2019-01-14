import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Table, Breadcrumb, Card, Select, Button, Input, Form, Row, Col, Popconfirm } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
import { author } from '../../utils/util';

function KarmaUserManagement(props) {
  let { dispatch, form, layout, KarmaUserManagementModel } = props;
  let { params, list, totals, groupData, loading,is_reset } = KarmaUserManagementModel;
  const { getFieldDecorator } = form;
  if (is_reset == true) {
    form.resetFields();
    dispatch({
      type: 'KarmaUserManagementModel/concat',
      payload: {
        is_reset: false,
      }
    });
  }
  /*
  * 查询
  * */
  function handSearch() {
    form.validateFields((err, values) => {
      params.page = 1;
      params.rows = 10;
      params.group = values.group;
      params.community_id = layout.communityId;
      params.community_name = values.community_name;
      params.name = values.name;
      params.social_name = values.social_name;
      params.mobile = values.mobile;
      dispatch({
        type: 'KarmaUserManagementModel/karmaUserList',
        payload: params
      })
    });
  }
  /*
  * 删除业委会成员
  * record Object
  * */
  function removeInfo(record) {
    dispatch({
      type: 'KarmaUserManagementModel/karmaUserDelete',
      payload: { id: record.id }
    })
  }
  /*
  * 重置
  * */
  function handleReset() {
    dispatch({
      type: 'KarmaUserManagementModel/concat',
      payload: {
        page: 1,
        rows: 10,
        community_name: '',
        name: '',
        social_name: '',
        community_id: layout.communityId
      }
    });
    form.resetFields();
    dispatch({
      type: 'KarmaUserManagementModel/karmaUserList',
      payload: { community_id: layout.communityId }
    })
  }
  /*
  * 监听页码改变
  * page Number
  * */
  function handlePaginationChange(page) {
    params.page = page;
    params.community_id = layout.communityId;
    dispatch({
      type: 'KarmaUserManagementModel/karmaUserList',
      payload: params
    })
  }
  /*
  * 监分页pageSize变化
  * size Number
  * */
  function handleShowSizeChange(current, size) {
    params.page = 1;
    params.rows = size;
    params.community_id = layout.communityId;
    dispatch({
      type: 'KarmaUserManagementModel/karmaUserList',
      payload: params
    })
  }

  const columns = [{
    title: '业委会名称',
    dataIndex: 'owners_committee_name',
    key: 'owners_committee_name'
  }, {
    title: '姓名',
    dataIndex: 'name',
    key: 'name'
  }, {
    title: '联系电话',
    dataIndex: 'mobile',
    key: 'mobile'
  }, {
    title: '出生年月',
    dataIndex: 'birthdate',
    key: 'birthdate'
  }, {
    title: '政治面貌',
    dataIndex: 'politics_status',
    key: 'politics_status'
  }, {
    title: '文化程度',
    dataIndex: 'education',
    key: 'education'
  }, {
    title: '工作单位',
    dataIndex: 'company',
    key: 'company'
  }, {
    title: '小区名称',
    dataIndex: 'community_name',
    key: 'community_name'
  }, {
    title: '苑/期/区',
    dataIndex: 'group',
    key: 'group'
  }, {
    title: '幢',
    dataIndex: 'building',
    key: 'building'
  }, {
    title: '单元',
    dataIndex: 'unit',
    key: 'unit'
  }, {
    title: '室号',
    dataIndex: 'room',
    key: 'room'
  }, {
    title: '新增日期',
    dataIndex: 'create_at',
    key: 'create_at'
  }, {
    title: '操作',
    dataIndex: 'desc',
    render: (text, record) => {
      return (
        <div>
          {record.is_self == 0 && author('edit') ? <Link to={`/karmaUserAdd?id=${record.id}`} className="mr1">编辑</Link> : null}
          {
            record.is_self == 0 && author('delete')
              ? <Popconfirm title="确定要删除业委会成员么？" onConfirm={() => removeInfo(record)}>
                <a className="table-operating">删除</a>
              </Popconfirm>
              : ''
          }
        </div>
      )
    }
  }];

  const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 14 }
  };
  const pagination = {
    current: params.page,
    pageSize: params.rows,
    onShowSizeChange: handleShowSizeChange,
    onChange: handlePaginationChange,
    defaultPageSize: 10,
    total: parseInt(totals),
    showTotal(total, range) {
      return `共 ${totals} 条`
    }
  };

  return (
    <div className="page-content">
      <Breadcrumb separator=">">
        <Breadcrumb.Item>业委会管理</Breadcrumb.Item>
        <Breadcrumb.Item>业委会成员管理</Breadcrumb.Item>
      </Breadcrumb>
      <Card className="section">
        <Form>
          <Row>
            <Col span={6}>
              <FormItem label="苑/期/区" {...formItemLayout}>
                {getFieldDecorator('group')(
                  <Select placeholder="请选择苑/期/区" showSearch={true}>
                    <Option value="">全部</Option>
                    {groupData.map((value, index) => {
                      return (
                        <Option key={index} value={value.name}>
                          {value.name}
                        </Option>
                      )
                    })}
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label="姓名" {...formItemLayout}>
                {getFieldDecorator('name')(<Input placeholder="请输入姓名" />)}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label="联系电话" {...formItemLayout}>
                {getFieldDecorator('mobile')(<Input placeholder="请输入联系电话" />)}
              </FormItem>
            </Col>

            <Col span={5} offset={1}>
              <Button type="primary" className="mr1" onClick={handSearch} >查询</Button>
              <Button type="ghost" onClick={handleReset}>重置</Button>
            </Col>
          </Row>
        </Form>
      </Card>
      <Card className="mt1">
        {
          author('add') ?
            <Link to="/karmaUserAdd">
              <Button type="primary">新增业委会成员</Button>
            </Link> : null

        }
        <Table columns={columns} className="mt1" pagination={pagination} dataSource={list} rowKey={record => record.id} loading={loading} />
      </Card>
    </div>
  )
}
export default connect(state => {
  return {
    KarmaUserManagementModel: state.KarmaUserManagementModel,
    layout: state.MainLayout
  }
})(Form.create({})(KarmaUserManagement));
