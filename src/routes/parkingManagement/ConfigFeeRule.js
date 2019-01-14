import React from 'react';
import { connect } from 'dva';
import { Form, Breadcrumb, Card, Button, Table, Modal, Popconfirm, Row, Input, Select } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
import { author } from '../../utils/util';

function ConfigFeeRule(props) {
  const { dispatch, loading, list, params, totals, typeOption, show, form, modalTitle } = props;
  const { getFieldDecorator } = form;
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
    dataIndex: 'tid',
    key: 'tid',
  }, {
    title: '车位类型',
    dataIndex: 'name',
    key: 'name',
    render: (text, record, index) => {
      return record.lot_type.name
    }
  }, {
    title: '免费时长（分钟）',
    dataIndex: 'free_minutes',
    key: 'free_minutes',
  }, {
    title: '计费价格（元/小时）',
    dataIndex: 'top_price',
    key: 'top_price',
  }, {
    title: '单日上限（元）',
    dataIndex: 'cost',
    key: 'cost',
  }, {
    title: '操作',
    dataIndex: 'in_time',
    key: 'in_time',
    render: (text, record) => {
      function TableItemTime() {
        return (
          <div>
            {
              author('edit') ? <a className="ml1" onClick={() => { EditModal(record) }}>编辑</a> : null
            }
            {
              author('delete') ?
                <Popconfirm title="删除后不可恢复，是否确认删除" trigger="click" onConfirm={getDel.bind(this, record)}>
                  <a className="ml1">删除</a>
                </Popconfirm> : null
            }

          </div>
        )
      }
      return TableItemTime()
    }
  }]

  const pagination = {
    showTotal: (total, range) => `共 ${totals} 条`,
    defaultCurrent: 1,
    current: params.page,
    defaultPageSize: 10,
    total: totals,
    onChange: (page, size) => { dispatch({ type: 'ConfigFeeRule/getChargeList', payload: { ...params, page } }) },
  }

  const tableProps = {
    rowKey: record => record.id,
    loading: loading,
    columns: columns,
    dataSource: list
  }

  function handleOk(e) {
    e.preventDefault();
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      if (values.name == "地面" || values.name == 1) {
        values.name = 1
      } else {
        values.name = 2
      }
      if (values.id == undefined) {
        dispatch({
          type: 'ConfigFeeRule/getAdd', payload: {
            cost: values.cost,
            free_minutes: values.free_minutes,
            lot_type: values.name,
            top_price: values.top_price,
            community_id: params.community_id
          }
        })
      } else {
        dispatch({
          type: 'ConfigFeeRule/getEdit', payload: {
            cost: values.cost,
            free_minutes: values.free_minutes,
            lot_type: values.name,
            top_price: values.top_price,
            community_id: params.community_id,
            id: values.id,
          }
        })
      }
      props.form.resetFields();
    });
  }

  function handleHidden(params) {
    dispatch({
      type: 'ConfigFeeRule/concat', payload: {
        show: false
      }
    })
    props.form.resetFields();
  }

  function showModal() {
    dispatch({
      type: 'ConfigFeeRule/concat', payload: {
        show: true,
        modalTitle: "新增规则"
      }
    })
  }

  function getDel(record) {
    dispatch({
      type: 'ConfigFeeRule/getDelete', payload: {
        id: record.id
      }
    })
  }

  function EditModal(record) {
    dispatch({
      type: 'ConfigFeeRule/concat', payload: {
        show: true,
        modalTitle: "编辑规则"
      }
    })
    props.form.setFieldsValue({
      name: record.lot_type.name,
      free_minutes: record.free_minutes,
      cost: record.cost,
      top_price: record.top_price,
      id: record.id
    })
  }

  return (
    <div>
      <Breadcrumb separator=">">
        <Breadcrumb.Item>停车管理</Breadcrumb.Item>
        <Breadcrumb.Item>收费规则设置</Breadcrumb.Item>
      </Breadcrumb>
      <Card className="section">
        {
          author('add')?<Button type="primary" icon="plus" onClick={showModal}>新增规则</Button>:null
        }
        
        <Table {...tableProps} pagination={pagination} style={{ marginTop: '10px' }} />
      </Card>
      <Modal title={modalTitle} visible={show} onOk={handleOk} onCancel={handleHidden}>
        <Row>
          {getFieldDecorator('id')}
          <FormItem label="车位类型" {...formItemLayout}>
            {getFieldDecorator('name', {
              rules: [{ required: true, message: '请选择车位类型', whitespace: true }],
            })(
              <Select placeholder="请选择车位类型" notFoundContent="没有数据" style={{ width: '193px' }}>
                {
                  typeOption.map((value, index) => { return <Option key={index} value={String(value.id)}>{value.name}</Option> })
                }
              </Select>
            )}
          </FormItem>

          <FormItem {...formItemLayout} label="免费时长">
            {getFieldDecorator('free_minutes', {
              rules: [{ required: true, message: '请输入免费时长', whitespace: true }],
            })(<Input type="text" placeholder="请输入免费时长" addonAfter="分钟" />)}
          </FormItem>

          <FormItem {...formItemLayout} label="计费价格">
            {getFieldDecorator('top_price', {
              rules: [{ required: true, message: '请输入计费价格(最多5位正整数)', whitespace: true }],
            })(<Input type="num" maxLength={5} placeholder="请输入计费价格" addonAfter="元/小时" />)}
          </FormItem>

          <FormItem {...formItemLayout} label="单日上限">
            {getFieldDecorator('cost')(<Input type="text" maxLength={5} placeholder="请输入单日上限" addonAfter="元" />)}
          </FormItem>
        </Row>
      </Modal>
    </div>
  )
}

function mapStateToProps(state) {
  return {
    ...state.ConfigFeeRule,
    loading: state.loading.models.ConfigFeeRule
  };
}
export default connect(mapStateToProps)(Form.create()(ConfigFeeRule));