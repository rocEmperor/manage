import React from 'react';
import { connect } from 'dva';
import { Form, Breadcrumb, Card, Row, Col, Input, Select, Cascader, DatePicker, Button, Table, Popconfirm, Modal } from 'antd';
import { Link } from 'react-router-dom';
import Community from '../../../components/Community/Community.js';
import { author } from '../../../utils/util';
const FormItem = Form.Item;
const Option = Select.Option;
const { RangePicker } = DatePicker;

function Hard(props) {
  const { form, dispatch, loading, type, fromList, status, list, paginationTotal, params, visible2, truename, mobile, id, is_reset } = props;
  const { getFieldDecorator } = form;
  if (is_reset == true) {
    form.resetFields();
    dispatch({
      type: 'Hard/concat',
      payload: {
        is_reset: false,
      }
    });
  }
  //布局
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
  /**
   * 作废确定接口调取
   * 
   * @param {any} id 
   */
  function nullifyRepair(id) {
    dispatch({
      type: 'Hard/nullifyRepair',
      payload: {
        repair_id: id,
      }
    })
  }
  /**
   * 复核
   * 
   * @param {string} num
   * @param {number} id
   * @param {number} show 
   * @param {string} operator_name 
   * show = 电话
   * operator_name = 用户名
   */
  function modalShow(num, id, show, operator_name) {
    if (num == "6") {
      dispatch({
        type: 'Repair/concat', payload: {
          visible2: true,
          id: id,
          mobile: show,
          truename: operator_name,
        }
      });
    }
  }
  //表格
  const tableProps = {
    columns: [{
      title: '提交时间',
      dataIndex: 'create_at',
      key: 'create_at',
    }, {
      title: '订单号',
      dataIndex: 'repair_no',
      key: 'repair_no',
    }, {
      title: '提交人',
      dataIndex: 'created_username',
      key: 'created_username',
    }, {
      title: '联系电话',
      dataIndex: 'contact_mobile',
      key: 'contact_mobile',
    }, {
      title: '报修地址',
      dataIndex: 'room_address',
      key: 'room_address',
      render: (text, record) => {
        return (<span>{text == "" ? "-" : text}</span>)
      }
    }, {
      title: '内容',
      dataIndex: 'repair_content',
      key: 'repair_content',
      render: (text, record) => {
        return (<span title={text}>{text.length > 15 ? text.substring(0, 15) + '...' : text}</span>)
      }
    }, {
      title: '报修来源',
      key: 'repair_from_desc',
      dataIndex: 'repair_from_desc',
    }, {
      title: '状态',
      key: 'status_desc',
      dataIndex: 'status_desc',
    }, {
      title: '标记说明',
      key: 'hard_remark',
      dataIndex: 'hard_remark',
      render: (text, record) => {
        return (<span title={text}>{text.length > 15 ? text.substring(0, 15) + '...' : text}</span>)
      }
    }, {
      title: '标记时间',
      key: 'hard_check_at',
      dataIndex: 'hard_check_at',
    }, {
      title: '操作',
      dataIndex: 'desc',
      render: (text, record) => {
        let link = `/repairView?id=${record.id}&type=2`;
        let link2 = `/repairAllocation?id=${record.id}&type=2`;
        let link1 = `/repairSign?id=${record.id}&type=2`;
        let link3 = `/repairAppend?id=${record.id}&type=2`;
        return <div>
          <Link to={link}>查看</Link>
          {record.status == "1" ? <span>
            {author('allocation') ? <Link to={link2} className="mlr1" style={{ marginLeft: 10 }}>分配</Link> : null}
            {author('signFinish') ? <Link to={link1} className="mlr1" style={{ marginLeft: 10 }}>标记完成</Link> : null}
            {author('addRecord') ? <Link to={link3} className="mlr1" style={{ marginLeft: 10 }}>添加记录</Link> : null}
            <Popconfirm title="确定要作废这个订单么？" onConfirm={nullifyRepair.bind(this, record.id)}>
              {author('invalid') ? <a className="mlr1" style={{ marginLeft: 10 }}>作废</a> : null}
            </Popconfirm>
          </span> : ""}
          {record.status == "2" || record.status == "7" || record.status == "8" ? <span>
            {author('allocation') ? <Link to={link2} className="mlr1" style={{ marginLeft: 10 }}>改派</Link> : null}
            {author('signFinish') ? <Link to={link1} className="mlr1" style={{ marginLeft: 10 }}>标记完成</Link> : null}
            {author('addRecord') ? <Link to={link3} className="mlr1" style={{ marginLeft: 10 }}>添加记录</Link> : null}
            <Popconfirm title="确定要作废这个订单么？" onConfirm={nullifyRepair.bind(this, record.id)}>
              {author('invalid') ? <a className="mlr1" style={{ marginLeft: 10 }}>作废</a> : null}
            </Popconfirm>
          </span> : ""}
          {(record.status == "3" || record.status == "4") ? <span>{author('allocation') ? <a className="mlr1" style={{ marginLeft: 10 }} onClick={modalShow.bind(this, "6", record.id)}>复核</a> : null}</span> : ""}
        </div>
      }
    }],
    dataSource: list,
    pagination: {
      total: paginationTotal ? Number(paginationTotal) : '',
      current: params.page,
      defaultCurrent: 1,
      defaultPageSize: 10,
      showTotal: (total, range) => `共有 ${paginationTotal} 条`,
      onChange: (page, pageSize) => {
        dispatch({
          type: 'Hard/getHardList',
          payload: { ...params, page }
        })
      },
    },
    rowKey: record => record.id,
    loading: loading
  }
  //搜索列表
  function handSearch() {
    form.validateFields(['repair_no', 'member_name', 'member_mobile', 'operator_name', 'group', 'building', 'unit', 'room', 'listStatus', 'repair_type', 'create', 'check', 'repair_from'], (err, values) => {
      if (values.create && values.create.length > 0) {
        values.create_at_start = values.create[0].format('YYYY-MM-DD');
        values.create_at_end = values.create[1].format('YYYY-MM-DD');
        delete values.create;
      } else {
        values.create_at_start = '';
        values.create_at_end = '';
        delete values.create;
      }
      if (values.check && values.check.length > 0) {
        values.check_at_start = values.check[0].format('YYYY-MM-DD');
        values.check_at_end = values.check[1].format('YYYY-MM-DD');
        delete values.check;
      } else {
        values.check_at_start = '';
        values.check_at_end = '';
        delete values.check;
      }
      values.status = values.listStatus;
      dispatch({
        type: 'Hard/getHardList',
        payload: { ...params, ...values }
      })

    });
  }
  //重置列表
  function handleReset() {
    form.resetFields();
    const payload = {
      page: 1,
      rows: 10,
      repair_no: '',
      status: '',
      repair_type: '',
      repair_from: '',
      group: '',
      building: '',
      unit: '',
      room: '',
      create_at_end: '',
      create_at_start: '',
      check_at_end: '',
      check_at_start: '',
      operator_name: '',
      member_mobile: '',
      member_name: '',
    }
    dispatch({
      type: 'Hard/getHardList', payload
    });
    dispatch({
      type: 'CommunityModel/concat',
      payload: {
        unitData: [],
        roomData: [],
        buildingData: [],
      }
    });
  }
  // 导出
  function handleExport() {
    dispatch({
      type: 'Hard/hardExport',
      payload: { ...params }
    })
  }
  /**
   * 复核工单弹框确定
   * 
   */
  function recheck() {
    form.validateFields(['recheck_result', 'content'], (err, values) => {
      if (err) {
        return;
      }
      dispatch({
        type: 'Repair/repairReview',
        payload: {
          repair_id: id,
          content: values.content,
          status: values.recheck_result
        }
      })
    })
  }
  /**
   * 复核工单弹框关闭
   * 
   * @param {string} num 
   */
  function handleCancel(num) {
    if (num == "5") {
      dispatch({
        type: 'Repair/concat',
        payload: {
          visible: false,
        }
      })
    } else if (num == "6") {
      dispatch({
        type: 'Repair/concat',
        payload: {
          visible2: false,
        }
      })
    }

  }
  return (<div>
    <Breadcrumb separator=">">
      <Breadcrumb.Item>报修管理</Breadcrumb.Item>
      <Breadcrumb.Item>疑难问题</Breadcrumb.Item>
    </Breadcrumb>
    <Card>
      <Form>
        <Row>
          <Col span={6}>
            <FormItem label="订单编号" {...formItemLayout}>
              {getFieldDecorator('repair_no')(<Input type="text" placeholder="请输入订单号" />
              )}
            </FormItem>
          </Col>
          <Col span={6} >
            <FormItem label="业主姓名" {...formItemLayout}>
              {getFieldDecorator('member_name')(<Input type="text" placeholder="请输入业主姓名" />
              )}
            </FormItem>
          </Col>
          <Col span={6} >
            <FormItem label="业主电话" {...formItemLayout}>
              {getFieldDecorator('member_mobile')(<Input type="text" placeholder="请输入业主电话" />
              )}
            </FormItem>
          </Col>
          <Col span={6} >
            <FormItem label="处理人" {...formItemLayout}>
              {getFieldDecorator('operator_name')(<Input type="text" placeholder="请输入处理人" />
              )}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <FormItem label="提交时间" {...formItemLayout2} >
              {getFieldDecorator('create')(<RangePicker style={{ width: '96%' }} />
              )}
            </FormItem>
          </Col>
          <Col span={6}>
            <FormItem label="订单状态" {...formItemLayout} >
              {getFieldDecorator('listStatus', {})(
                <Select
                  placeholder="请选择"
                >
                  <Option key={-1} dataValue={""} value="">全部</Option>
                  {
                    status.map((value, index) => {
                      return <Option key={index} value={value.key.toString()}>{value.value}</Option>
                    })
                  }
                </Select>
              )}
            </FormItem>
          </Col>
          <Col span={6}>
            <FormItem label="订单类型" {...formItemLayout}>
              {getFieldDecorator('repair_type', {})(
                <Cascader options={type} placeholder="请选择" changeOnSelect />
              )}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <FormItem label="标记时间" {...formItemLayout2}>
              {getFieldDecorator('check')(<RangePicker style={{ width: '96%' }} />
              )}
            </FormItem>
          </Col>
          <Col span={6}>
            <FormItem label="报修来源" {...formItemLayout} >
              {getFieldDecorator('repair_from')(
                <Select placeholder="请选择" >
                  <Option key={-1} value="">全部</Option>
                  {
                    fromList.map((value, index) => {
                      return <Option key={index} value={value.key.toString()}>{value.value}</Option>
                    })
                  }
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Community form={form} allDatas={{ group: {}, building: {}, unit: {}, room: {} }} />
          <Col span={4}>
            <Button type="primary" onClick={handSearch.bind(this)} className="mr1" style={{ marginLeft: '10px' }} >查询</Button>
            <Button type="ghost" onClick={handleReset.bind(this)}>重置</Button>
          </Col>
        </Row>
      </Form>
    </Card>
    <Card className="mt1">
      {author('export') ? <Button type="primary" className="mr1" style={{ marginLeft: '10px' }} onClick={handleExport.bind(this)} >导出</Button> : null}
      <Table className="mt1" {...tableProps} />
    </Card>
    <Modal
      title="复核工单"
      visible={visible2}
      onOk={recheck.bind(this)}
      onCancel={handleCancel.bind(this, "6")}
    >
      <Form>
        <Row>
          <Col span={20}>
            <FormItem label="复核人" {...formItemLayout}>
              {getFieldDecorator('name')(<span>{truename}</span>)}
            </FormItem>
            <FormItem label="联系电话" {...formItemLayout}>
              {getFieldDecorator('phone')(<span>{mobile}</span>)}
            </FormItem>
            <FormItem label="复核结果" {...formItemLayout}>
              {getFieldDecorator('status', {
                rules: [
                  { required: true, message: '请选择!' },
                ],
              })(
                <Select placeholder="请选择">
                  <Option key={1} value="1">通过</Option>
                  <Option key={2} value="2">不通过</Option>
                </Select>
              )}
            </FormItem>
            <FormItem label="复核内容" {...formItemLayout}>
              {getFieldDecorator('content', { rules: [{ type: 'string', pattern: /^[^ ]{1,50}$/, required: true, message: "请输入复核内容50字以内" }] })(<Input type="textarea" placeholder="请输入标记说明" />)}
            </FormItem>
          </Col>
        </Row>
      </Form>
    </Modal>

  </div>)
}
function mapStateToProps(state) {
  return {
    ...state.Hard,
    loading: state.loading.models.Hard
  };
}
export default connect(mapStateToProps)(Form.create()(Hard));
