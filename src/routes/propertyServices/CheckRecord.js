import React from 'react';
import { connect } from 'dva';
import { Breadcrumb, Form, Card, Button, Input, Col, Row, Table } from 'antd';
import Community from '../../components/Community/Community.js';
import { Link } from 'react-router-dom';
const FormItem = Form.Item;

function CheckRecord(props) {
  const { dispatch, form,list, totals, params, is_reset} = props;
  const { getFieldDecorator } = form;


  if (is_reset == true) {
    form.resetFields();
    dispatch({
      type: 'CheckRecordModel/concat',
      payload: {
        is_reset: false,
      }
    });
  }
  function reload(params) {
    dispatch({
      type: 'CheckRecordModel/checkList',
      payload: params,
    });
    dispatch({
      type: 'CheckRecordModel/concat',
      payload: { params: params },
    });
  }

  //搜索确定
  function handleSubmit(e) {
    form.validateFields((err, values) => {
      const param = {
        name:values.name,
        group: values.group,
        building: values.building,
        unit: values.unit,
        room: values.room
      };
      param.page = 1;
      param.rows = 10;
      param.community_id = sessionStorage.getItem("communityId");
      reload(param);
    })
  }
  //重置按钮
  function handleReset() {
    form.resetFields();
    form.validateFields((err, values) => {
      const param = {
        page: 1,
        rows: 10,
        community_id: sessionStorage.getItem("communityId"),
        group: '',
        building: '',
        unit: '',
        room: '',
        name: '',
      }
      reload(param);
    })
    dispatch({
      type: 'CommunityModel/concat',
      payload: {
        unitData: [],
        roomData: [],
        buildingData: [],
      }
    });
  }

  const formItemLayout = {
    labelCol: {
      span: 6
    },
    wrapperCol: {
      span: 16
    },
  }

  const columns = [{
    title: '姓名',
    dataIndex: 'name',
    key: 'name',
  }, {
    title: '手机号码',
    dataIndex: 'mobile',
    key: 'mobile',
  }, {
    title: '对应房屋',
    dataIndex: 'group',
    key: 'group',
    render: (index, record) => {
      return record.group + record.building + record.unit + record.room
    }
  }, {
    title: '检查次数',
    dataIndex: 'checked_total',
    key: 'checked_total',
  }, {
    title: '超赞次数',
    dataIndex: 'good_total',
    key: 'good_total',
  }, {
    title: '一般次数',
    dataIndex: 'ordinary_total',
    key: 'ordinary_total',
  }, {
    title: '不合格次数',
    dataIndex: 'fail_total',
    key: 'fail_total',
  }, {
    title: '总分值',
    dataIndex: 'score_count',
    key: 'score_count',
  }, {
    title: '操作',
    dataIndex: 'receive_at',
    key: 'receive_at',
    render:(index,record)=>{
      return <Link to={`/checkDetail?id=` + record.room_user_id}><a>查看详情</a></Link>
    }
  }];

  const pagination = {
    showTotal(total, range) {
      return '共 ' + totals + ' 条'
    },
    defaultCurrent: 1,
    current: params.page,
    defaultPageSize: 10,
    total: totals,
    onChange: (page, size) => { dispatch({ type: 'CheckRecordModel/checkList', payload: { ...params, page } }) },
  };
  const tableProps = {
    rowKey: record => record.id,
    columns: columns,
    dataSource: list
  };

  return (
    <div className="page-content">
      <Breadcrumb separator=">">
        <Breadcrumb.Item>物业服务</Breadcrumb.Item>
        <Breadcrumb.Item>垃圾袋检查记录</Breadcrumb.Item>
      </Breadcrumb>
      <Card className="section">
        <Form>
          <Row>
            <Col span={6}>
              <FormItem label="住户：" {...formItemLayout}>
                {getFieldDecorator('name')(<Input placeholder="请输入姓名/手机号码" />)}
              </FormItem>
            </Col>
            <Community form={form} allDatas={{ group: {}, building: {}, unit: {}, room: {} }} />
          </Row>
          <Row>
            <Col span={5} offset={18} className="fr">
              <Button type="primary" className="mr1" onClick={handleSubmit}>查询</Button>
              <Button type="ghost" onClick={handleReset}>重置</Button>
            </Col>
          </Row>
        </Form>
      </Card>
      <Card className="mt1">
        <Button type="primary" onClick={() => { dispatch({ type: 'CheckRecordModel/export', payload: { ...params } }) }}>导出</Button>
        <Table className="mt1" {...tableProps} pagination={pagination} />
      </Card>
    </div>
  )
}

function mapStateToProps(state) {
  return {
    ...state.CheckRecordModel,
    loading: state.loading.models.CheckRecord
  };
}
export default connect(mapStateToProps)(Form.create()(CheckRecord));