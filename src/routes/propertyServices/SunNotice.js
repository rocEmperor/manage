import React from 'react';
import { connect } from 'dva';
import { Link } from 'react-router-dom';
import { author } from '../../utils/util';

import {
  Form,
  Breadcrumb,
  Table,
  Input,
  Button,
  Card,
  DatePicker,
  Row,
  Col,
  Popconfirm,
  Switch,
  Select
} from 'antd';
const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const Option=Select.Option;

function SunNotice(props) {
  let { dispatch, list, params, form, is_reset, loading, totals } = props;
  if (is_reset == true) {
    form.resetFields();
    dispatch({
      type: 'SunNoticeModel/concat',
      payload: {
        is_reset: false,
      }
    });
  }
  const { getFieldDecorator } = props.form;
  const formItemLayout = {
    labelCol: {
      span: 6
    },
    wrapperCol: {
      span: 16
    }
  };
  const formItemLayout2 = {
    labelCol: {
      span: 3
    },
    wrapperCol: {
      span: 21
    }
  };
  const pagination = {
    showTotal(total, range) {
      return '共' + totals + '条'
    },
    defaultCurrent: 1,
    current: params.page,
    defaultPageSize: 10,
    total: totals,
    onChange: (page, size) => { dispatch({ type: 'SunNoticeModel/sunNoticeList', payload: { ...params, page } }) },
  }
  function removeInfo(record) {
    dispatch({
      type: 'SunNoticeModel/sunNoticeDelete',
      payload: {
        id: record.id,
        params: params,
      },
    })
  }
  /**
   *
   * @param {is_show} record
   * record.is_show = 1 显示
   * record.is_show = 2 隐藏
   */
  function openDown(record) {
    const param = params;
    dispatch({
      type: 'SunNoticeModel/openDown',
      payload: {
        id: record.id,
        is_show: record.is_show == 1 ? 2 : 1,
        params: param,
      }
    })
  }
  function reload(params) {
    dispatch({
      type: 'SunNoticeModel/sunNoticeList',
      payload: params,
    });
    dispatch({
      type: 'SunNoticeModel/concat',
      payload: {params:params},
    });
  }
  //搜索
  function handleSubmit(val) {
    form.validateFields((err, values) => {
      const param = {
        title: values.title,
      };
      param.page = 1;
      param.rows = 10;
      param.community_id = sessionStorage.getItem("communityId");
      param.proclaim_type = values.proclaim_type;
      if (values.time && values.time.length > 0) {
        param.start_date = values.time ? values.time[0].format('YYYY-MM-DD') : '';
        param.end_date = values.time ? values.time[1].format('YYYY-MM-DD') : '';
      }else{
        param.start_date = '';
        param.end_date = '';
      }
      reload(param);
    })
  }

  function openTop(record,checked) {
    const param = params;
    dispatch({
      type: 'SunNoticeModel/openTop',
      payload: {
        id: record.id,
        is_top: checked == true ? 2 : 1,
        params: param,
      }
    })
  }
  //重置
  function handleReset() {
    form.resetFields();
    form.validateFields((err, values) => {
      const param = {
        page: 1,
        rows: 10,
        community_id: sessionStorage.getItem("communityId"),
        proclaim_type:'',
        title: "",
        time: "",
        start_date: '',
        end_date: '',
      }
      reload(param);
    })
  }

  const columns = [
    {
      title: '公告标题',
      dataIndex: 'title',
      key: 'title'
    }, {
      title: '公告分类',
      dataIndex: 'proclaim_type_desc',
      key: 'proclaim_type_desc'
    },{
      title: '添加时间',
      dataIndex: 'create_at',
      key: 'create_at'
    }, {
      title: '是否置顶',
      dataIndex: 'is_top',
      key: 'is_top',
      render:(text,record)=>{
        return <Switch defaultChecked={text == "2" ? true : false} onChange={openTop.bind(this,record)} />
      }
    }, {
      title: '是否显示',
      dataIndex: 'is_show',
      key: 'is_show',
      render:(text,record)=>{
        if (record.is_show=="2"){
          return '显示'
        }else{
          return '隐藏'
        }
      }
    }, {
      title: '显示时间',
      dataIndex: 'show_at',
      key: 'show_at'
    }, {
      title: '操作',
      dataIndex: 'desc',
      render: (text, record) => {
        let link2 = `/addNotice?id=${record.id}`;
        let linkShow = `/showNotice?id=${record.id}`;
        return <div>
          {
            author('edit') && record.is_show == "1" ?  <Link to={link2} className="mr1">编辑</Link> : null
          }
          {
            author('delete') && record.is_show == "1"  ?
              <Popconfirm title="确定要删除这个公告么？" onConfirm={removeInfo.bind(this, record)}>
                <a className="table-operating">删除</a>
              </Popconfirm> : null
          }
          {
            author('showHide') ? <Popconfirm title={record.is_show == "1" ? '是否确认显示' : '是否确认隐藏'} onConfirm={openDown.bind(this, record)}>
              <a>{record.is_show == "1" ? '显示' : '隐藏'}</a>
            </Popconfirm> : null
          }
          <Link to={linkShow} className="ml1">查看</Link>

        </div>
      }
    }
  ];

  return (
    <div className="page-content">
      <Breadcrumb separator="/">
        <Breadcrumb.Item>物业服务</Breadcrumb.Item>
        <Breadcrumb.Item>小区公告</Breadcrumb.Item>
      </Breadcrumb>
      <Card>
        <Form>
          <Row>
            <Col span={6}>
              <FormItem label="公告类型" {...formItemLayout}>
                {getFieldDecorator('proclaim_type')(
                  <Select className="select-100 mr-5" placeholder="请选择发放类型">
                    <Option value="">全部</Option>
                    <Option value="1">通知</Option>
                    <Option value="2">新闻</Option>
                    <Option value="3">公告</Option>
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label="公告标题" {...formItemLayout}>
                {getFieldDecorator('title')(<Input type="text" placeholder="请输入公告标题" />)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="添加时间" {...formItemLayout2}>
                {getFieldDecorator('time')(<RangePicker placeholder={['开始时间', '结束时间']} style={{width:'96%'}}/>)}
              </FormItem>
            </Col>
            <Col span={6} offset={18}>
              <Button
                type="primary"
                className="mr1"
                onClick={handleSubmit}
                style={{
                  marginLeft: '10px'
                }}>查询</Button>
              <Button type="ghost" onClick={handleReset}>重置</Button>
            </Col>
          </Row>
        </Form>
      </Card>
      <Card className="mt1">
        {
          author('add') ? <Link to="/addNotice"><Button type="primary">新增公告</Button></Link> : null
        }

        <Table
          columns={columns}
          pagination={pagination}
          dataSource={list}
          loading={loading}
          rowKey={record => record.id}
          className="mt1" />
      </Card>
    </div>
  )
}
function mapStateToProps(state) {
  return {
    ...state.SunNoticeModel,
    loading: state.loading.models.SunNoticeModel
  };
}
export default connect(mapStateToProps)(Form.create()(SunNotice));
