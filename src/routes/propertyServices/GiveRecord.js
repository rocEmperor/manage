import React from 'react';
import { connect } from 'dva';
import { Breadcrumb, Form, Card, Select, Button, Input, Col, Row, Table, DatePicker } from 'antd';
import Community from '../../components/Community/Community.js';
import { noData} from '../../utils/util';
const { RangePicker } = DatePicker;
const FormItem = Form.Item;
const Option = Select.Option;

function GiveRecord(props) {
  const { dispatch, form,list, totals, params, is_reset } = props;
  const { getFieldDecorator } = form;

  if (is_reset == true) {
    form.resetFields();
    dispatch({
      type: 'GiveRecordModel/concat',
      payload: {
        is_reset: false,
      }
    });
  }
  function reload(params) {
    dispatch({
      type: 'GiveRecordModel/giveList',
      payload: params,
    });
    dispatch({
      type: 'GiveRecordModel/concat',
      payload: { params: params },
    });
  }

  //搜索确定
  function handleSubmit(e) {
    form.validateFields((err, values) => {
      if (values.create_at && values.create_at.length > 0) {
        values.first_create_at = values.create_at[0].format('YYYY-MM-DD');
        values.last_create_at = values.create_at[1].format('YYYY-MM-DD');
        delete values.create_at;
      }
      const param = {
        type:values.type,
        numbering: values.numbering,
        name:values.name,
        first_create_at:values.first_create_at,
        last_create_at:values.last_create_at,
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
        type: '',
        numbering: '',
        name: '',
        first_create_at: '',
        last_create_at: '',
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
  };
  
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
    render:(index,record)=>{
      return record.group + record.building + record.unit+record.room
    }
  }, {
    title: '发放时间',
    dataIndex: 'create_at',
    key: 'create_at',
  }, {
    title: '发放类型',
    dataIndex: 'type.name',
    key: 'type.name',
  }, {
    title: '垃圾袋编号',
    dataIndex: 'numbering',
    key: 'numbering',
  }, {
    title: '备注',
    dataIndex: 'remarks',
    key: 'remarks',
    render: (text, record) => {
      if (text) {
        if (text.length > 10) {
          return <span title={text}>{text.substring(0, 10) + '...'}</span>
        } else {
          return text
        }
      } else {
        return noData()
      }
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
    onChange: (page, size) => { dispatch({ type: 'GiveRecordModel/giveList', payload: { ...params, page } }) },
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
        <Breadcrumb.Item>垃圾袋发放记录</Breadcrumb.Item>
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
            <Col span={6}>
              <FormItem label="垃圾袋编号：" {...formItemLayout}>
                {getFieldDecorator('numbering')(
                  <Input placeholder="请输入垃圾袋编号" />
                )}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label="发放类型" {...formItemLayout}>
                {getFieldDecorator('type')(
                  <Select className="select-100 mr-5" placeholder="请选择发放类型">
                    <Option value="">全部</Option>
                    <Option value="1">餐厨类</Option>
                    <Option value="2">其它类</Option>
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label="发放时间" {...formItemLayout}>
                {getFieldDecorator('create_at')(
                  <RangePicker />
                )}
              </FormItem>
            </Col>
            <Col span={5} offset={1} className="fr">
              <Button type="primary" className="mr1" onClick={handleSubmit}>查询</Button>
              <Button type="ghost" onClick={handleReset}>重置</Button>
            </Col>
          </Row>
        </Form>
      </Card>
      <Card className="mt1">
        <Button type="primary" onClick={() => { dispatch({ type: 'GiveRecordModel/export', payload: { ...params }})}}>导出</Button>
        <Table className="mt1" {...tableProps} pagination={pagination} />
      </Card>
    </div>
  )
}

function mapStateToProps(state) {
  return {
    ...state.GiveRecordModel,
    loading: state.loading.models.GiveRecord
  };
}
export default connect(mapStateToProps)(Form.create()(GiveRecord));