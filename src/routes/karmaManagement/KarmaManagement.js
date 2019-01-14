import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Table, Breadcrumb, Card, Select, Button, Form, Row, Col, Popconfirm } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
import { author } from '../../utils/util';

function KarmaManagement(props) {
  let { dispatch, layout, KarmaManagementModel, form } = props;
  let { params, list, totals, socialList, loading,is_reset } = KarmaManagementModel;
  let { getFieldDecorator } = form;
  if (is_reset == true) {
    form.resetFields();
    dispatch({
      type: 'KarmaManagementModel/concat',
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
      // params.community_name = values.community_name;
      // params.name = values.name;
      params.social_id = values.social_name;
      dispatch({
        type: 'KarmaManagementModel/karmaList',
        payload: params
      })
    });
  }
  /*
  * 删除业委会
  * record Object
  * */
  function removeInfo(record) {
    dispatch({
      type: 'KarmaManagementModel/karmaDelete',
      payload: {
        id: record.id
      }
    })
  }
  /*
  * 重置
  * */
  function handleReset() {
    dispatch({
      type: 'KarmaManagementModel/concat',
      payload: {
        params: {
          page: 1,
          rows: 10,
          community_name: '',
          name: '',
          social_name: '',
          community_id: layout.communityId
        }
      }
    });
    form.resetFields();
    dispatch({
      type: 'KarmaManagementModel/karmaList',
      payload: {
        community_id: layout.communityId
      }
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
      type: 'KarmaManagementModel/karmaList',
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
      type: 'KarmaManagementModel/karmaList',
      payload: params
    })
  }

  const columns = [{
    title: '社区名称',
    dataIndex: 'social_name',
    key: 'social_name'
  }, {
    title: '小区名称',
    dataIndex: 'community_name',
    key: 'community_name'
  }, {
    title: '业委会名称',
    dataIndex: 'name',
    key: 'name'
  }, {
    title: '成员数',
    dataIndex: 'member_num',
    key: 'member_num'
  }, {
    title: '成立时间',
    dataIndex: 'found_at',
    key: 'found_at'
  }, {
    title: '任期周期',
    dataIndex: 'cycle',
    key: 'cycle'
  }, {
    title: '换届时间',
    dataIndex: 'change_at',
    key: 'change_at'
  }, {
    title: '操作',
    dataIndex: 'desc',
    render: (text, record) => {
      return <div>
        {
          author('edit') ? <Link to={`/karmaAdd?id=${record.id}`} className="mr1">编辑</Link> : null
        }
        {
          author('addStaff') ? <Link className="mr1" to={`/karmaUserAdd?room_user_id=${record.id}`}>添加成员</Link> : null
        }
        {
          author('delete') ? <Popconfirm title="确定要删除业委会么？" onConfirm={() => removeInfo(record)}>
            <a className="table-operating">删除</a>
          </Popconfirm> : null
        }

      </div>
    }
  }];
  const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 14 },
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
        <Breadcrumb.Item>业委会管理</Breadcrumb.Item>
      </Breadcrumb>
      <Card className="section">
        <Form>
          <Row>
            <Col span={6}>
              <FormItem label="社区名称:" {...formItemLayout}>
                {getFieldDecorator('social_name')(
                  <Select placeholder="请选择社区名称" showSearch={true}>
                    <Option value="">全部</Option>
                    {socialList && socialList.map((value, index) => {
                      return (
                        <Option key={index} value={value.id}>
                          {value.name}
                        </Option>
                      )
                    })}
                  </Select>
                )}
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
        <Link to="/karmaAdd">
          {
            author('add')?<Button type="primary">新增业委会</Button>:null
          }

        </Link>
        <Table columns={columns} className="mt1" pagination={pagination} dataSource={list} rowKey={record => record.id} loading={loading} />
      </Card>
    </div>
  )
}
export default connect(state => {
  return {
    KarmaManagementModel: state.KarmaManagementModel,
    layout: state.MainLayout
  }
})(Form.create({})(KarmaManagement));
