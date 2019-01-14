import React from 'react';
import { connect } from 'dva';
import { Form, Breadcrumb, Card, Button, Table, Popconfirm, Modal, Row, Col, Select, Radio, Input } from 'antd';
import { author } from '../../../utils/util';
const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;

function RepairType(props) {
  const { dispatch, loading, form, list, info, level, levelList, visible, show_parent, params } = props;
  const { getFieldDecorator } = form;
  //布局
  const formItemLayout = {
    labelCol: {
      span: 8
    },
    wrapperCol: {
      span: 16
    },
  }
  //表格
  const tableProps = {
    columns: [{
      title: '编号',
      dataIndex: 'cid',
      key: 'cid',
    }, {
      title: '类别名称',
      dataIndex: 'name',
      key: 'name',
    }, {
      title: '是否关联房屋',
      dataIndex: 'is_relate_room',
      key: 'is_relate_room',
      render: (text, record) => {
        return (<span>{text == 1 ? "关联" : "不关联"}</span>)
      }
    }, {
      title: '类别属性',
      dataIndex: 'level',
      key: 'level',
      render: (text, record) => {
        return (<div>
          <span>{text == 1 ? "一级类目" : ""}</span>
          <span>{text == 2 ? "二级类目" : ""}</span>
          <span>{text == 3 ? "三级类目" : ""}</span>
        </div>
        )
      }
    }, {
      title: '上级类别',
      dataIndex: 'parent_name.name',
      key: 'parent_name.name',
    }, {
      title: '操作',
      dataIndex: 'repair_type_desc',
      key: 'repair_type_desc',
      render: (text, record) => {
        return <div>
          {record.status == 2 && author('edit')  ? <a className="mlr1" onClick={showModel.bind(this, record)}>编辑</a> : null}
          <Popconfirm title={record.status == 1 ? "确定要隐藏该类别？" : "确定要显示该类别？"} onConfirm={changeStatus.bind(this, record)}>
            {author('showHide') ?<a className="mlr1" style={{ marginLeft: 10 }}>{record.status == 1 ? "隐藏" : "显示"}</a>:null}
          </Popconfirm>
        </div>
      }
    }],
    dataSource: list,
    pagination: false,
    rowKey: record => record.id,
    loading: loading
  }

  function show() {
    dispatch({
      type: 'RepairType/concat',
      payload: {
        visible: true,
      }
    })
  }
  function showModel(record) {
    dispatch({
      type: 'RepairType/concat',
      payload: {
        visible: true,
        info: record,
      }
    })
    dispatch({
      type: 'RepairType/getRepairTypeLevelList',
      payload: {
        level: record.level,
        community_id: params.community_id,
      }, callback(val) {
      }
    })
    if (record.level != 1) {
      dispatch({
        type: 'RepairType/concat',
        payload: {
          show_parent: true,
        }
      })
    } else {
      dispatch({
        type: 'RepairType/concat',
        payload: {
          show_parent: false,
        }
      })
    }
  }
  function changeStatus(record) {
    dispatch({
      type: 'RepairType/getRepairTypeStatus',
      payload: {
        id: record.id,
        status: record.status == 1 ? 2 : 1
      }
    })
  }
  //
  function submit() {
    let arr = show_parent ? ['name', 'level', 'parent_id'] : ['name', 'level', 'is_relate_room'];
    form.validateFields(arr, (errors, values) => {
      if (errors) {
        return;
      }
      if (info == '') {
        dispatch({
          type: 'RepairType/getRepairTypeAdd',
          payload: {
            is_relate_room: show_parent == false ? values.is_relate_room : '',
            level: values.level,
            name: values.name,
            parent_id: show_parent == false ? 0 : values.parent_id,
            community_id: params.community_id,
          }, callback(val) {
            form.resetFields();
          }
        })
      } else {
        dispatch({
          type: 'RepairType/getRepairTypeEdit',
          payload: {
            is_relate_room: show_parent == false ? values.is_relate_room : '',
            level: values.level,
            name: values.name,
            parent_id: show_parent == false ? 0 : values.parent_id,
            community_id: params.community_id,
            id: info.id,
          }, callback(val) {
            form.resetFields();
          }
        })
      }
    })
  }
  //
  function modalHide() {
    dispatch({
      type: 'RepairType/concat',
      payload: {
        visible: false,
        info: '',
      }
    })
    form.resetFields();
  }
  //
  function selectChange(val) {
    if (val == 1) {
      dispatch({
        type: 'RepairType/concat',
        payload: {
          show_parent: false,
        }
      })
    } else {
      dispatch({
        type: 'RepairType/concat',
        payload: {
          show_parent: true,
        }
      })
      form.resetFields();
    }
    dispatch({
      type: 'RepairType/getRepairTypeLevelList',
      payload: {
        level: val,
        community_id: params.community_id,
        id: info == '' ? '' : info.id,
      }, callback(val) {
        // form.setFieldsValue({ 'parent_id': undefined });
      }
    })
  }

  return (<div>
    <Breadcrumb separator="/">
      <Breadcrumb.Item>报修管理</Breadcrumb.Item>
      <Breadcrumb.Item>报修类别</Breadcrumb.Item>
    </Breadcrumb>
    <Card className="mt1">
      {author('add') ?<Button type="primary" className="mr1" style={{ marginLeft: '10px' }} onClick={show.bind(this)} >新增类别</Button>:null}
      <Table className="mt1" {...tableProps} />
    </Card>
    <Modal
      title={info == '' ? "新增类别" : "编辑类别"}
      visible={visible}
      onOk={submit.bind(this)}
      onCancel={modalHide.bind(this)}>
      <Form>
        <Row>
          <Col span={24}>
            <FormItem label="类别名称" {...formItemLayout}>
              {getFieldDecorator('name', { rules: [{ type: 'string', pattern: /^[^ ]{1,15}$/, required: true, message: "请输入类别名称（最多15个字符）" }], initialValue: info ? info.name : '' })(<Input placeholder="请输入类别名称" maxLength="15" />)}
            </FormItem>
          </Col>
        </Row>

        <Row>
          <Col span={24}>
            <FormItem label="类别属性" {...formItemLayout}>
              {getFieldDecorator('level', { rules: [{ required: true, message: "请选择类别属性" }], initialValue: info ? info.level : undefined })(
                <Select placeholder="请选择类别属性" notFoundContent="没有数据" onChange={selectChange.bind(this)}>
                  {level.map((value, index) => { return <Option key={index} value={value.key + ''}>{value.value}</Option> })}
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>
        {show_parent == false ?
          <Row>
            <Col span={24}>
              <FormItem label="是否关联房屋信息" {...formItemLayout}>
                {getFieldDecorator('is_relate_room', { rules: [{ required: true, message: "请选择是否关联房屋信息" }], initialValue: info ? info.is_relate_room + '' : '' })(
                  <RadioGroup>
                    <Radio value="1">关联</Radio>
                    <Radio value="2">不关联</Radio>
                  </RadioGroup>
                )}
              </FormItem>
            </Col>
          </Row>
          : null}
        {show_parent == true ?
          <Row>
            <Col span={24}>
              <FormItem label="上级类别" {...formItemLayout}>
                {getFieldDecorator('parent_id', { rules: [{ required: true, message: "请选择上级类别" }], initialValue: info && info.level != 1 ? info.parent_id : undefined })(
                  <Select placeholder="请选择上级类别" notFoundContent="没有数据">
                    {levelList.map((value, index) => { return <Option key={index} value={value.id}>{value.name}</Option> })}
                  </Select>
                )}
              </FormItem>
            </Col>
          </Row>
          : null}
      </Form>
    </Modal>
  </div>)
}
function mapStateToProps(state) {
  return {
    ...state.RepairType,
    loading: state.loading.models.RepairType
  };
}
export default connect(mapStateToProps)(Form.create()(RepairType));
