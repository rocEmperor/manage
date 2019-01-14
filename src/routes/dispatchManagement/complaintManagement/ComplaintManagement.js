import React from 'react';
import { connect } from 'dva';
import { Form, Breadcrumb, Card, Row, Col, Input, Button, Select, Table, Modal } from 'antd';
import { author } from '../../../utils/util';
const FormItem = Form.Item;
const Option = Select.Option;
import { Link } from 'react-router-dom';

function ComplaintManagement(props) {
  const { dispatch, loading, form, list, typeOption, statusOption, params, totals, show, username, mobile, id, statusId,is_reset } = props;
  const { getFieldDecorator } = form;
  if (is_reset == true) {
    form.resetFields();
    dispatch({
      type: 'ComplaintManagement/concat',
      payload: {
        is_reset: false,
      }
    });
  }
  const formItemLayout = {
    labelCol: {
      span: 6,
    },
    wrapperCol: {
      span: 16,
    },
  };

  const columns = [{
    title: '编号',
    dataIndex: 'id',
    key: 'id',
  }, {
    title: '业主姓名',
    dataIndex: 'username',
    key: 'username',
  }, {
    title: '联系电话',
    dataIndex: 'mobile',
    key: 'mobile',
  }, {
    title: '投诉类型',
    dataIndex: 'type',
    key: 'type',
    render: (text, record) => {
      return <div>
        <span title={text}>{text.name}</span>
      </div>
    }
  }, {
    title: '内容',
    dataIndex: 'content',
    key: 'content',
    render: (text, record) => {
      if (text) {
        return <div>
          <span title={text}>{text.length <= 15 ? text : text.substring(0, 15) + "..."}</span>
        </div>
      }
    }
  }, {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    render: (text, record) => {
      return <div>
        <span title={text}>{text.name}</span>
      </div>
    }
  }, {
    title: '提交时间',
    dataIndex: 'create_at',
    key: 'create_at',
  }, {
    title: '操作',
    dataIndex: 'desc',
    render: (text, record) => {
      let link = `/complaintView?id=${record.id}&community_id=${params.community_id}`;
      return <div>
        {author('details') ?<Link to={link} className="margin-right-10">查看详情</Link>:null}
        {author('signHandled') ?<a className="ml1" onClick={mark.bind(this, record)}>{record.status.id == 1 ? '标记为已处理' : ''}</a>:null}
      </div>

    }
  }];
  const pagination = {
    showTotal: (total, range) => `共 ${totals} 条`,
    defaultCurrent: 1,
    current: params.page,
    defaultPageSize: 10,
    total: totals,
    onChange: (page, size) => { dispatch({ type: 'ComplaintManagement/getComplaintList', payload: { ...params, page } }) },
  }
  const tableProps = {
    rowKey: record => record.id,
    loading: loading,
    columns: columns,
    dataSource: list
  }
  function handSearch(e) {
    form.validateFields((err, values) => {
      dispatch({
        type: 'ComplaintManagement/getComplaintList', payload: { ...params, ...values, page: 1 }
      });
    })
  }
  function handleReset(e) {
    form.resetFields();
    form.validateFields((err, values) => {
      if(statusId){
        let param = {
          page: 1,
          rows: 10,
          username: "",
          mobile: "",
          type: "",
          status: 1
        }
        dispatch({
          type: 'ComplaintManagement/getComplaintList', payload: param
        });
      }else{
        let param = {
          page: 1,
          rows: 10,
          username: "",
          mobile: "",
          type: "",
          status: ""
        }
        dispatch({
          type: 'ComplaintManagement/getComplaintList', payload: param
        });
      }
    })
  }
  function mark(record) {
    dispatch({
      type: 'ComplaintManagement/concat', payload: {
        username: record.username,
        mobile: record.mobile,
        id: record.id,
        show: true
      }
    })
    props.form.resetFields();
  }
  function handleHidden(params) {
    dispatch({
      type: 'ComplaintManagement/concat', payload: {
        show: false
      }
    })
    props.form.resetFields();
  }
  function handleOk(e) {
    e.preventDefault();
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      dispatch({ type: 'ComplaintManagement/getComplaintMark', payload: { 
        content: values.content, community_id: params.community_id, id },callBack(){
        let param = {
          page: 1,
          rows: 10,
          username: "",
          mobile: "",
          type: "",
          status: statusId?1:""
        }
        dispatch({
          type: 'ComplaintManagement/getComplaintList', payload: param
        });
      } })
    });
  }
  return (
    <div>
      <Breadcrumb separator=">">
        <Breadcrumb.Item>报事管理</Breadcrumb.Item>
        <Breadcrumb.Item>业主投诉</Breadcrumb.Item>
      </Breadcrumb>
      <Card className="section">
        <Form>
          <Row>
            <Col span={6}>
              <FormItem label="业主姓名" {...formItemLayout}>
                {getFieldDecorator('username')(<Input type="text" placeholder="请输入业主名称" />
                )}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label="联系电话" {...formItemLayout}>
                {getFieldDecorator('mobile')(<Input type="text" placeholder="请输入联系电话" />
                )}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label="投诉类型" {...formItemLayout}>
                {getFieldDecorator('type')(
                  <Select placeholder="请选择投诉类型" notFoundContent="没有数据">
                    <Option key={-1} value="">全部</Option>
                    {
                      typeOption.map((value, index) => { return <Option key={index} value={String(value.id)}>{value.name}</Option> })
                    }
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={6}>
              {statusId?
                <FormItem label="投诉状态" {...formItemLayout}>
                  {getFieldDecorator('status', { initialValue: "1" })(
                    <Select placeholder="请选择投诉状态" notFoundContent="没有数据">
                      <Option key={-1} value="">全部</Option>
                      {statusOption.map((value, index) => { return <Option key={index} value={String(value.id)}>{value.name}</Option> })}
                    </Select>
                  )}
                </FormItem>
                :
                <FormItem label="投诉状态" {...formItemLayout}>
                  {getFieldDecorator('status', { initialValue: undefined })(
                    <Select placeholder="请选择投诉状态" notFoundContent="没有数据">
                      <Option key={-1} value="">全部</Option>
                      {statusOption.map((value, index) => { return <Option key={index} value={String(value.id)}>{value.name}</Option> })}
                    </Select>
                  )}
                </FormItem>
              }
            </Col>
          </Row>
          <Row>
            <Col span={24} style={{ textAlign: 'right', paddingRight: '35px' }}>
              <Button type="primary" onClick={handSearch} className="mr1" style={{ marginLeft: '10px' }} >查询</Button>
              <Button type="ghost" onClick={handleReset}>重置</Button>
            </Col>
          </Row>
        </Form>
      </Card>
      <Card>
        <Table className="mt1" {...tableProps} pagination={pagination} />
      </Card>
      <Modal title="标记为已处理" visible={show} onOk={handleOk} onCancel={handleHidden}>
        <Form>
          <Row>
            <Col className="mb1" style={{ paddingLeft: '60px' }}>
              <span className="mr1" style={{ fontSize: '12px' }}>业主姓名 :</span>
              <span style={{ fontSize: '12px' }}>{username}</span>
            </Col>
            <Col className="mb1" style={{ paddingLeft: '60px' }}>
              <span className="mr1" style={{ fontSize: '12px' }}>联系电话 :</span>
              <span style={{ fontSize: '12px' }}>{mobile}</span>
            </Col>
            <FormItem {...formItemLayout} label="处理内容">
              {getFieldDecorator('content', {
                rules: [{ required: true, message: '请输入处理内容', whitespace: true }],
              })(<Input type="textarea" maxLength={200} placeholder="请输入处理内容" style={{ lineHeight: "20px" }} />)}
            </FormItem>
          </Row>
        </Form>
      </Modal>
    </div>
  );
}

function mapStateToProps(state) {
  return {
    ...state.ComplaintManagement,
    loading: state.loading.models.ComplaintManagement
  };
}
export default connect(mapStateToProps)(Form.create()(ComplaintManagement));
