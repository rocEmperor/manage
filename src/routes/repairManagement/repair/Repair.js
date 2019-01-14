import React from 'react';
import { connect } from 'dva';
import { Link } from 'react-router-dom';
import { Form, Breadcrumb, Card, Row, Col, Input, DatePicker, Select, Cascader, Button, Table, Popconfirm, message, Modal } from 'antd';
import Community from '../../../components/Community/Community.js';
import { author,getCommunityId } from '../../../utils/util';
const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const Option = Select.Option;

function Repair(props) {
  const { form, dispatch, loading, type, fromList, status, list, paginationTotal, params, userInfo, id, visible, visible2, truename, mobile, 
    statusId, is_reset} = props;
  const { getFieldDecorator } = form;
  if (is_reset == true) {
    form.resetFields();
    dispatch({
      type: 'Repair/concat',
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
  //没有数据
  function renderColumns(text, record) {
    return (Object.prototype.toString.call(text) === '[object String]' && text !== '') ? text : '-'
  }
  //表格
  const tableProps = {
    columns: [{
      title: '提交时间',
      dataIndex: 'create_at',
      key: 'create_at',
      render: renderColumns
    }, {
      title: '订单号',
      dataIndex: 'repair_no',
      key: 'repair_no',
      render: renderColumns
    }, {
      title: '提交人',
      dataIndex: 'created_username',
      key: 'created_username',
      render: renderColumns
    }, {
      title: '联系电话',
      dataIndex: 'contact_mobile',
      key: 'contact_mobile',
      render: renderColumns
    }, {
      title: '报修地址',
      dataIndex: 'room_address',
      key: 'room_address',
      render: renderColumns
    }, {
      title: '类型',
      dataIndex: 'repair_type_desc',
      key: 'repair_type_desc',
      render: renderColumns
    }, {
      title: '内容',
      dataIndex: 'repair_content',
      key: 'repair_content',
      render: (text, record) => {
        return (<span title={text}>{text.length > 15 ? text.substring(0, 15) + '...' : text}</span>)
      }
    }, {
      title: '期望上门时间',
      dataIndex: 'expired_repair_time',
      key: 'expired_repair_time',
      render: (text, record) => {
        return <span>{record.expired_repair_time} {record.expired_repair_type == 1 ? '上午' : '下午'}</span>
      }
    }, {
      title: '报修来源',
      key: 'repair_from_desc',
      dataIndex: 'repair_from_desc',
    }, {
      title: '工单金额',
      key: 'amount',
      dataIndex: 'amount',
    }, {
      title: '状态',
      key: 'status_desc',
      dataIndex: 'status_desc',
    }, {
      title: '处理人',
      key: 'operator_name',
      dataIndex: 'operator_name',
    }, {
      title: '操作',
      dataIndex: 'desc',
      render: (text, record) => {
        // let link = statusId?`/repairView?id=${record.id}&type=1&status=${statusId}`:`/repairView?id=${record.id}&type=1`;
        // let link2 = statusId?`/repairAllocation?id=${record.id}&type=1&status=${statusId}`:`/repairAllocation?id=${record.id}&type=1`;
        // let link1 = statusId?`/repairSign?id=${record.id}&type=1&status=${statusId}`:`/repairSign?id=${record.id}&type=1`;
        // let link3 = statusId?`/repairAppend?id=${record.id}&type=1&status=${statusId}`:`/repairAppend?id=${record.id}&type=1`;
        let link = `/repairView?id=${record.id}&type=1`;
        let link2 = `/repairAllocation?id=${record.id}&type=1`;
        let link1 = `/repairSign?id=${record.id}&type=1`;
        let link3 = `/repairAppend?id=${record.id}&type=1`;
        return <div>
          <Link to={link}>查看</Link>
          {record.status == "1" ? <span>
            {author('allocation') ? <Link to={link2} className="mlr1" style={{ marginLeft: 10 }}>分配</Link> : null}
            {author('signFinish') ? <Link to={link1} className="mlr1" style={{ marginLeft: 10 }}>标记完成</Link> : null}
            {author('addRecord') ? <Link to={link3} className="mlr1" style={{ marginLeft: 10 }}>添加记录</Link> : null}
            {author('signKnotty') ? <a className="mlr1" style={{ marginLeft: 10 }} onClick={modalShow.bind(this, "5", record.id)}>标记为疑难</a> : null}
            <Popconfirm title="确定要作废这个订单么？" onConfirm={nullifyRepair.bind(this, record.id)}>
              {author('invalid') ? <a className="mlr1" style={{ marginLeft: 10 }}>作废</a> : null}
            </Popconfirm>
          </span> : ""}
          {record.status == "2" || record.status == "7" || record.status == "8" ? <span>
            {author('allocation') ? <Link to={link2} className="mlr1" style={{ marginLeft: 10 }}>改派</Link> : null}
            {author('signFinish') ? <Link to={link1} className="mlr1" style={{ marginLeft: 10 }}>标记完成</Link> : null}
            {author('addRecord') ? <Link to={link3} className="mlr1" style={{ marginLeft: 10 }}>添加记录</Link> : null}
            {author('signKnotty') ? <a className="mlr1" style={{ marginLeft: 10 }} onClick={modalShow.bind(this, "5", record.id)}>标记为疑难</a> : null}
            <Popconfirm title="确定要作废这个订单么？" onConfirm={nullifyRepair.bind(this, record.id)}>
              {author('invalid') ? <a className="mlr1" style={{ marginLeft: 10 }}>作废</a> : null}
            </Popconfirm>
          </span> : ""}
          {(record.status == "3" || record.status == "4") ? <span>{author('check') ? <a className="mlr1" style={{ marginLeft: 10 }} onClick={modalShow.bind(this, "6", record.id, userInfo.mobile, userInfo.truename)}>复核</a> : null}</span> : ""}
          {record.status == "9" ? <Popconfirm title="确定要二次维修这个订单么？" onConfirm={creatNew.bind(this, record.id, record.is_assign_again)}>
            {author('list') ? <a className="mlr1" style={{ marginLeft: 10 }}>二次维修</a> : null}
          </Popconfirm> : ""}
          {(record.status == "3" || record.status == "5" || record.status == "9" || record.status == "8") && record.is_pay == "1" ? <span>
            {author('isPay') ? <Popconfirm title="确定要标记为支付么？" onConfirm={alreadyPay.bind(this, record.id)}>
              {author('invalid') ? <a className="mlr1" style={{ marginLeft: 10 }}>标记为支付</a> : null}
            </Popconfirm>:null}
          </span>: ""}
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
          type: 'Repair/getRepairList',
          payload: { ...params, page, community_id: sessionStorage.getItem("communityId") }
        })
      },
    },
    rowKey: record => record.id,
    loading: loading
  }
  //搜索列表
  function handSearch() {
    form.validateFields(['repair_no', 'member_name', 'member_mobile', 'operator_name', 'date', 'listStatus', 'repair_type', 'group', 'building', 'unit', 'room', 'repair_from'], (err, values) => {
      if (values.date && values.date.length > 0) {
        values.create_at_start = values.date[0].format('YYYY-MM-DD');
        values.create_at_end = values.date[1].format('YYYY-MM-DD');
        delete values.date;
      } else {
        values.create_at_start = '';
        values.create_at_end = '';
        delete values.date;
      }
      values.status = values.listStatus;
      dispatch({
        type: 'Repair/getRepairList', payload: { ...params, ...values, community_id: sessionStorage.getItem("communityId"), page: 1  }
      });
    })
  }
  //重置列表
  function handleReset() {
    form.resetFields();
    if(statusId){
      let payload = {
        "page": 1,
        "rows": 10,
        "community_id":getCommunityId(),
        "repair_no": "",
        "member_name": "",
        "member_mobile": "",
        "operator_name": "",
        "status": statusId,
        "repair_type": [],
        "group": "",
        "building": "",
        "unit": "",
        "room": "",
        "repair_from": "",
        "create_at_start": "",
        "create_at_end": "",
        "show": ""
      }
      dispatch({
        type: 'Repair/getRepairList', payload
      });
    }else{
      let payload = {
        "page": 1,
        "rows": 10,
        "community_id":getCommunityId(),
        "repair_no": "",
        "member_name": "",
        "member_mobile": "",
        "operator_name": "",
        "status": "",
        "repair_type": [],
        "group": "",
        "building": "",
        "unit": "",
        "room": "",
        "repair_from": "",
        "create_at_start": "",
        "create_at_end": "",
        "show": ""
      }
      dispatch({
        type: 'Repair/getRepairList', payload
      });
    }
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
      type: 'Repair/repairExport',
      payload: { ...params, community_id: sessionStorage.getItem("communityId") }
    })
  }
  /**
   * 标记为疑难/复核弹框
   *
   * @param {string} num
   * @param {number} id
   * @param {number} show
   * @param {string} operator_name
   * num = 5 标记为疑难
   * num = 6 复核
   * num = 7 标记为支付
   */
  function modalShow(num, id, show, operator_name, repair_type_desc, amount, repair_no) {
    if (num == "5") {
      dispatch({
        type: 'Repair/concat', payload: {
          visible: true,
          id: id
        }
      });
    } else if (num == "6") {
      dispatch({
        type: 'Repair/concat', payload: {
          visible2: true,
          id: id,
          mobile: show,
          truename: operator_name,
        }
      });
    } else if (num == "7") {
      dispatch({
        type: 'Repair/concat', payload: {
          visible4: true,
          id: id,
          repair_no: repair_no,
          repair_type_desc: repair_type_desc,
          amount:amount,
        }
      });
    }
  }
  /**
   * 作废
   *
   * @param {number} id
   */
  function nullifyRepair(id) {
    dispatch({
      type: 'Repair/nullifyRepair',
      payload: {
        repair_id: id,
        community_id:getCommunityId()
      },callBack(){
        let payload = {
          "page": 1,
          "rows": 10,
          "community_id":getCommunityId(),
          "repair_no": "",
          "member_name": "",
          "member_mobile": "",
          "operator_name": "",
          "status": statusId?statusId:"",
          "repair_type": [],
          "group": "",
          "building": "",
          "unit": "",
          "room": "",
          "repair_from": "",
          "create_at_start": "",
          "create_at_end": "",
          "show": ""
        }
        dispatch({
          type: 'Repair/getRepairList', payload
        });
      }
    })
  }
  /**
   * 二次维修
   *
   * @param {string} id
   * @param {number} is_assign_again
   * @returns
   *
   * is_assign_again = 1 已二次维修
   */
  function creatNew(id, is_assign_again) {
    if (is_assign_again == 1) {
      message.info("已二次维修，请勿重复操作！")
      return;
    }
    dispatch({
      type: 'Repair/repairCreateNew',
      payload: {
        repair_id: id,
      }
    })
  }
  function submit(e) {
    form.validateFields(['hard_remark'], (err, values) => {
      if (err) {
        return;
      }
      dispatch({
        type: 'Repair/checkHard',
        payload: {
          repair_id: id,
          hard_remark: values.hard_remark
        }
      })
    })
  }
  /**
   * 标记疑难/复核工单弹框取消
   *
   * @param {string} num
   * num = 5 标记疑难
   * num = 6 复核工单
   * num = 7 标记为支付
   */
  function handleCancel(num) {
    if (num == "5") {
      dispatch({
        type: 'Repair/concat',
        payload: {
          visible: false,
        }
      })
      props.form.resetFields();
    } else if (num == "6") {
      dispatch({
        type: 'Repair/concat',
        payload: {
          visible2: false,
        }
      })
    } else if (num == "7") {
      dispatch({
        type: 'Repair/concat',
        payload: {
          visible4: false,
        }
      })
    }

  }
  /**
   * 复核工单确定
   *
   * @param {any} e
   */
  function recheck(e) {
    form.validateFields(['status', 'content'], (err, values) => {
      if (err) {
        return;
      }
      dispatch({
        type: 'Repair/repairReview',
        payload: {
          repair_id: id,
          content: values.content,
          status: values.status
        }
      })
    })
  }

  /**
   * 标记支付确定
   *
   * @param {any} e
   */
  function alreadyPay(id) {
    dispatch({
      type: 'Repair/repairMakePay',
      payload: {
        repair_id: id,
      }
    })
  }

  return (<div>
    <Breadcrumb separator=">">
      <Breadcrumb.Item>报修管理</Breadcrumb.Item>
      <Breadcrumb.Item>报修管理</Breadcrumb.Item>
    </Breadcrumb>
    <Card>
      <Form>
        <Row>
          <Col span={6} >
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
            <FormItem label="提交时间" {...formItemLayout2}>
              {getFieldDecorator('date')(<RangePicker style={{ width: '96%' }} />
              )}
            </FormItem>
          </Col>
          <Col span={6}>
            <FormItem label="订单状态" {...formItemLayout}>
              {getFieldDecorator('listStatus', { initialValue: statusId ? "1" : undefined })(
                <Select placeholder="请选择">
                  <Option key={-1} value="">全部</Option>
                  {status.map((value, index) => {
                    return <Option key={index} value={value.key.toString()}>{value.value}</Option>
                  })}
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
          <Community form={form} allDatas={{ group: {}, building: {}, unit: {}, room: {} }} />
          <Col span={6}>
            <FormItem label="报修来源"  {...formItemLayout}>
              {getFieldDecorator('repair_from')(
                <Select placeholder="请选择">
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
          <Col span={4} offset={18}>
            <Button type="primary" onClick={handSearch.bind(this)} className="mr1" style={{ marginLeft: '10px' }} >查询</Button>
            <Button type="ghost" onClick={handleReset.bind(this)}>重置</Button>
          </Col>
        </Row>
      </Form>
    </Card>
    <Card className="mt1">
      <Link to="/repairAdd">
        {author('add') ? <Button type="primary">新增工单</Button> : null}
      </Link>
      {author('export') ? <Button type="primary" className="mr1" style={{ marginLeft: '10px' }} onClick={handleExport.bind(this)} >导出</Button> : null}
      <Table className="mt1" {...tableProps} />
    </Card>
    <Modal
      title="标记疑难"
      visible={visible}
      onOk={submit.bind(this)}
      onCancel={handleCancel.bind(this, "5")}
    >
      <Form>
        <Row>
          <Col span={24}>
            <FormItem label="标记说明" {...formItemLayout}>
              {getFieldDecorator('hard_remark', { rules: [{ type: 'string', pattern: /^[^ ]{1,200}$/, required: true, message: "请输入标记说明200字以内" }] })(<Input type="textarea" placeholder="请输入标记说明" />)}
            </FormItem>
          </Col>
        </Row>
      </Form>
    </Modal>

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

    {/* <Modal
      title="标记为支付"
      visible={visible4}
      onOk={alreadyPay.bind(this)}
      onCancel={handleCancel.bind(this, "7")}
    >
      <Form>
        <Row>
          <Col span={20}>
            <FormItem label="工单编号" {...formItemLayout}>
              {getFieldDecorator('num')(<span>{repair_no}</span>)}
            </FormItem>
            <FormItem label="工单类型" {...formItemLayout}>
              {getFieldDecorator('type')(<span>{repair_type_desc}</span>)}
            </FormItem>
            <FormItem label="应付金额" {...formItemLayout}>
              {getFieldDecorator('money')(<span>{amount}</span>)}
            </FormItem>
            <FormItem label="实付金额" {...formItemLayout}>
              {getFieldDecorator('already_amount', {
                rules: [{
                  type: 'string',
                  pattern: /(^[1-9]([0-9]){1,4}\.\d{1,2}$)|(^[1-9]{1,5}\.\d{1,2}$)|(^0\.\d[1-9]$)|(^0\.[1-9]\d?$)|(^[1-9]{1,5}$)|(^[1-9]([0-9]){1,4}$)/,
                  required: true,
                  message: '请输入金额(整数5位以内,小数点后保留两位)'
                }]
              })(
                <Input type= "text" placeholder="请输入金额" addonAfter="元"/>
              )}
            </FormItem>
          </Col>
        </Row>
      </Form>
    </Modal> */}
  </div>)
}
function mapStateToProps(state) {
  return {
    ...state.Repair,
    loading: state.loading.models.Repair
  };
}
export default connect(mapStateToProps)(Form.create()(Repair));
