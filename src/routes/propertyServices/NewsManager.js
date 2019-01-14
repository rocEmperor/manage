import React from 'react';
import { connect } from 'dva';
import { Link } from 'react-router-dom';
import { Form, Breadcrumb, Table, Input, Button, Card, DatePicker, Row, Col, Popconfirm, Select } from 'antd';
import { author } from '../../utils/util';

const FormItem = Form.Item;
const Option = Select.Option;
const { RangePicker } = DatePicker;

function NewsManager(props) {
  let { dispatch, list, totals, is_reset, form, params, loading, noticeType, sendType } = props;
  const { getFieldDecorator } = props.form;
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
  if (is_reset == true) {
    form.resetFields();
    dispatch({
      type: 'NewsManagerModel/concat',
      payload: {
        is_reset: false,
      }
    });
  }
  function handSearch(val) {
    form.validateFields((err, values) => {
      const param = {
        title: values.title,
        send_type: values.send_type,
        notice_type: values.notice_type 
      };
      param.page = 1;
      param.rows = 10;
      param.community_id = sessionStorage.getItem("communityId");
      if (values.time && values.time.length > 0) {
        param.start_date = values.time ? values.time[0].format('YYYY-MM-DD') : '';
        param.end_date = values.time ? values.time[1].format('YYYY-MM-DD') : '';
      }else{
        param.start_date = '';
        param.end_date = '';
      }
      dispatch({
        type: 'NewsManagerModel/newsList', payload:  param 
      });
      dispatch({
        type: 'NewsManagerModel/concat', payload: {params:param}
      });
    })
  }
  function handleReset(e) {
    form.resetFields();
    form.validateFields((err, values) => {
      const param = {
        page: 1,
        rows: 10,
        community_id: sessionStorage.getItem("communityId"),
        title: "",
        start_date: "",
        end_date: '',
        send_type: "",
        notice_type: ""
      }
      dispatch({
        type: 'NewsManagerModel/newsList', payload: param
      });
      dispatch({
        type: 'NewsManagerModel/concat', payload: { params: param }
      });
    })
  }
  function removeInfo(record) {
    dispatch({
      type: 'NewsManagerModel/newsDelete',
      payload: {
        id: record.id,
        params: params,
      },
    })
  }
  function newsManagerPush(record) {
    dispatch({
      type: 'NewsManagerModel/newsPush',
      payload: {
        id: record.id,
        params: params,
      },
    })
  }
  const columns = [{
    title: '消息标题',
    dataIndex: 'title',
    key: 'title',
  }, {
    title: '消息类型',
    dataIndex: 'notice_type_desc',
    key: 'notice_type_desc',
    render: (text, record) => {
      if (typeof record.notice_type_desc == 'string') {
        return record.notice_type_desc
      } else {
        return <span>
          return <span className="margin-right-10">新增</span>
        </span>
      }
    }
  }, {
    title: '发送对象',
    dataIndex: 'send_type_desc',
    key: 'send_type_desc',
  }, {
    title: '创建人',
    dataIndex: 'operator_name',
    key: 'operator_name',
  }, {
    title: '创建时间',
    dataIndex: 'create_at',
    key: 'create_at',
  }, {
    title: '操作',
    dataIndex: 'desc',
    render: (text, record) => {
      let link2 = `/editNews?id=${record.id}`;
      let link = `/viewNews?id=${record.id}`;
      return <div>
        {
          author('view') ? <Link to={link} className="mr1">查看</Link> : null
        }

        {record.is_send == 1 && author('edit') ? <Link to={link2} className="mr1">编辑</Link> : null}
        {record.is_send == 1 && author('push') ?
          <Popconfirm title="确定要推送该消息到生活号么?" onConfirm={newsManagerPush.bind(this, record)} >
            <a className="table-operating mr1">推送</a>
          </Popconfirm>
          : null}
        {record.is_send == 1 && author('delete') ?
          <Popconfirm title="确定要删除这条消息么?" onConfirm={removeInfo.bind(this, record)} >
            <a className="table-operating">删除</a>
          </Popconfirm> : null}
      </div>
    }
  }];
  const pagination = {
    showTotal(total, range) {
      return '共' + totals + '条'
    },
    defaultCurrent: 1,
    current: params.page,
    total: parseInt(totals),
    pageSizeOptions: ['10', '20', '30', '40'],
    defaultPageSize: 10,
    onChange: (page, size) => { dispatch({ type: 'NewsManagerModel/newsList', payload: { ...params, page } }) },
  }

  return (
    <div>
      <Breadcrumb separator="/">
        <Breadcrumb.Item>物业服务</Breadcrumb.Item>
        <Breadcrumb.Item>消息管理</Breadcrumb.Item>
      </Breadcrumb>
      <Card>
        <Form>
          <Row>
            <Col span={6}>
              <FormItem label="消息标题" {...formItemLayout}>
                {getFieldDecorator('title')(<Input type="text" placeholder="请输入消息标题" />
                )}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label="发送对象" {...formItemLayout}>
                {getFieldDecorator('send_type')(
                  <Select placeholder="请选择发送对象" notFoundContent="没有数据">
                    {sendType.map((value, index) => { return <Option key={index} value={String(value.key)}>{value.value}</Option> })}
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label="消息类型" {...formItemLayout}>
                {getFieldDecorator('notice_type')(
                  <Select placeholder="请选择消息类型" notFoundContent="没有数据">
                    {noticeType.map((value, index) => { return <Option key={index} value={String(value.key)}>{value.value}</Option> })}
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="发布时间" {...formItemLayout2}>
                {getFieldDecorator('time')(<RangePicker style={{width:'96%'}}/>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row style={{ textAlign: 'right' }}>
            <Col span={23}>
              <Button type="primary" className="mr1" style={{ marginLeft: '10px' }} onClick={handSearch.bind(this)} >查询</Button>
              <Button type="ghost" onClick={handleReset.bind(this)} >重置</Button>
            </Col>
          </Row>
        </Form>
      </Card>
      <Card className="mt1">
        {
          author('add') ? <Link to="/addNews"><Button type="primary">新增消息</Button></Link> : null
        }

        <Table columns={columns} dataSource={list} className="mt1" rowKey={record => record.id} pagination={pagination} loading={loading} />
      </Card>
    </div>
  )
}

function mapStateToProps(state) {
  return {
    ...state.NewsManagerModel,
    loading: state.loading.models.NewsManagerModel,
  };
}
export default connect(mapStateToProps)(Form.create()(NewsManager));