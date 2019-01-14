import React from 'react';
import { connect } from 'dva';
import { Breadcrumb, Form, Card, Select, Button, Input, Col, Row, DatePicker, Table, Modal } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
import Community from '../../components/Community/Community.js';
import { noData } from '../../utils/util';

function OpenRecord(props) {
  const { dispatch, form, list, totals, params, loading, is_reset, userType, openType, previewVisible, previewImage } = props;
  const { getFieldDecorator } = form;

  if (is_reset == true) {
    form.resetFields();
    dispatch({
      type: 'OpenRecord/concat',
      payload: {
        is_reset: false,
      }
    });
  }
  function reload(params) {
    dispatch({
      type: 'OpenRecord/openRecordList',
      payload: params,
    });
    dispatch({
      type: 'OpenRecord/concat',
      payload: { params: params },
    });
  }
  /*
  * 图片预览
  * value Object
  * */
  function imgVisible(value) {
    dispatch({
      type: 'OpenRecord/concat',
      payload: {
        previewVisible: true,
        previewImage: value
      }
    })
  }
  /*
  * 取消图片预览
  * */
  function handleCancel() {
    dispatch({
      type: 'OpenRecord/concat',
      payload: {
        previewVisible: false,
        previewImage: ''
      }
    })
  }
  //搜索确定
  function handleSubmit(e) {
    form.validateFields((err, values) => {
      const param = {
        group: values.group,
        building: values.building,
        unit: values.unit,
        room: values.room,
        open_type: values.open_type,
        user_type: values.user_type,
        device_name: values.device_name,
        user_phone: values.user_phone,
        card_no: values.card_no
      };
      param.page = 1;
      param.rows = 10;
      param.community_id = sessionStorage.getItem("communityId");
      if (values.time && values.time.length > 0) {
        param.start_time = values.time ? values.time[0].format('YYYY-MM-DD HH:mm:ss') : '';
        param.end_time = values.time ? values.time[1].format('YYYY-MM-DD HH:mm:ss') : '';
      } else {
        param.start_time = '';
        param.end_time = '';
      }
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
        group: "",
        building: "",
        unit: "",
        room: "",
        open_type: "",
        user_type: "",
        device_name: "",
        user_phone: "",
        card_no: "",
        start_time: "",
        end_time: ""
      }
      reload(param);
      const params = {
        unitData:[],
        roomData:[],
        buildingData:[],
      };
      dispatch({
        type: 'CommunityModel/concat',
        payload: params
      });
    })
  }

  const formItemLayout = {
    labelCol: {
      span: 6
    },
    wrapperCol: {
      span: 16
    },
  };
  const formItemLayout2 = {
    labelCol: {
      span: 3
    },
    wrapperCol: {
      span: 21
    },
  }
  const {
    RangePicker
  } = DatePicker;
  const columns = [{
    title: '抓拍图片',
    dataIndex: 'capture_photo',
    key: 'capture_photo',
    render: (text) => {
      if (text) {
        return <img src={text} className="mr1" onClick={() => imgVisible(text)} />
      } else {
        return noData()
      }
    }
  }, {
    title: '开门方式',
    dataIndex: 'open_type',
    key: 'open_type',
    render: (text, record, index) => {
      return record.open_type ? record.open_type.value : noData()
    }
  }, {
    title: '开门时间',
    dataIndex: 'open_times',
    key: 'open_times',
    render: noData
  }, {
    title: '手机号码',
    dataIndex: 'user_phone',
    key: 'user_phone',
    render: noData
  }, {
    title: '门卡卡号',
    dataIndex: 'card_no',
    key: 'card_no',
    render: noData
  }, {
    title: '用户类型',
    dataIndex: 'user_type',
    key: 'user_type',
    render: (text, record, index) => {
      return record.user_type ? record.user_type.value : noData()
    }
  }, {
    title: '设备名称',
    dataIndex: 'device_name',
    key: 'device_name',
    render: noData
  }, {
    title: '楼宇单元',
    dataIndex: 'unit_name',
    key: 'unit_name',
    render: (text, record, index) => {
      return record.group ? `${record.group}${record.building}${record.unit}` : noData()
    }
  }, {
    title: '室',
    dataIndex: 'room',
    key: 'room',
    render: noData
  }];
  const pagination = {
    showTotal(total, range) {
      return '共 ' + totals + ' 条'
    },
    defaultCurrent: 1,
    current: params.page,
    defaultPageSize: 10,
    total: Number(totals),
    onChange: (page, size) => { dispatch({ type: 'OpenRecord/openRecordList', payload: { ...params, page } }) },
  };
  const tableProps = {
    rowKey: record => record.id,
    loading: loading,
    columns: columns,
    dataSource: list
  };
  return (
    <div className="page-content">
      <Breadcrumb separator=">">
        <Breadcrumb.Item>智能门禁</Breadcrumb.Item>
        <Breadcrumb.Item>开门记录</Breadcrumb.Item>
      </Breadcrumb>
      <Card className="section">
        <Form>
          <Row>
            <Community form={form} allDatas={{ group: {}, building: {}, unit: {}, room: {} }} />
            <Col span={6}>
              <FormItem label="开门方式" {...formItemLayout}>
                {getFieldDecorator('open_type')(
                  <Select placeholder="请选择开门方式">
                    {openType ? openType.map((item) => {
                      return <Option key={item.key} value={item.key}>{item.value}</Option>
                    }) : null}
                  </Select>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={6}>
              <FormItem label="用户身份" {...formItemLayout}>
                {getFieldDecorator('user_type')(
                  <Select placeholder="请选择用户身份">
                    {userType ? userType.map((item) => {
                      return <Option key={item.key} value={item.key}>{item.value}</Option>
                    }) : null}
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="开门时间" {...formItemLayout2}>
                {getFieldDecorator('time')(<RangePicker style={{ width: '96%' }} showTime format="YYYY-MM-DD HH:mm:ss" />)}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label="设备名称" {...formItemLayout}>
                {getFieldDecorator('device_name')(<Input placeholder="请输入设备名称" />)}
              </FormItem>
            </Col>
          </Row>
          <Modal visible={previewVisible} footer={null} onCancel={handleCancel}>
            <img alt="" style={{ width: '100%' }} src={previewImage} />
          </Modal>
          <Row>
            <Col span={6}>
              <FormItem label="手机号" {...formItemLayout}>
                {getFieldDecorator('user_phone')(<Input placeholder="请输入手机号" />)}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label="门卡卡号" {...formItemLayout}>
                {getFieldDecorator('card_no')(<Input placeholder="请输入门卡卡号" />)}
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
        <Table className="mt1" {...tableProps} pagination={pagination} />
      </Card>
    </div>
  )
}

function mapStateToProps(state) {
  return {
    ...state.OpenRecord,
    loading: state.loading.models.OpenRecord
  };
}
export default connect(mapStateToProps)(Form.create()(OpenRecord));