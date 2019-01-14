import React from 'react';
import { connect } from 'dva';
import { Form, Row, Col, Button, Breadcrumb, Table, Select, Card, Input, Modal, Icon, Popconfirm } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
import { noData } from '../../utils/util';
import { getCommunityId, author } from '../../utils/util';

function Tags(props) {
  let { dispatch, form, list, totals, params, loading, visible, info, labelType, is_reset } = props;
  
  if (is_reset == true) {
    form.resetFields();
    dispatch({
      type: 'TagsModel/concat',
      payload: {
        is_reset: false,
      }
    });
  }
  const { getFieldDecorator } = form;
  
  // 布局
  const formItemLayout = {
    labelCol: {
      span: 6
    },
    wrapperCol: {
      span: 16
    },
  }

  function reload(params) {
    dispatch({
      type: 'TagsModel/getList',
      payload: params,
    });
  }

  /**
  * 查询
  */
  function handleSubmit() {
    form.validateFields(['label_type','name'],(err, values) => {
      const param = values;
      param.page = 1;
      param.rows = 10;
      param.community_id = values.community_id || getCommunityId();
      reload(param);
    })
  }

  /**
   * 重置
   */
  function handleReset() {
    form.resetFields();
    form.validateFields((err, values) => {
      const param = {
        page: 1,
        rows: 10,
        community_id: getCommunityId(),
        name: "",
        label_type: "",
      }
      reload(param);
    })
  }

  function mark(record) {
    form.resetFields(['model_label_type', 'model_name']);
    dispatch({
      type: 'TagsModel/concat',
      payload: {
        visible: true,
        info: record,
      }
    })
  }

  function deleteTags(record) {
    dispatch({
      type: 'TagsModel/labelDelete',
      payload: {
        id: record.id,
      }
    })
  }

  /**
   * 切换表格页码
   * @param  {Number} page
   */
  function handlePaginationChange(page, size) {
    const param = { ...params, page };
    reload(param);
  }

  function hideModal() {
    dispatch({
      type: 'TagsModel/concat',
      payload: {
        visible: false,
        info:'',
      }
    });
  }

  function showModal() {
    form.resetFields(['model_label_type', 'model_name']);
    dispatch({
      type: 'TagsModel/concat',
      payload: {
        visible: true,
      }
    });
  }

  function handleOk(e) {
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      if(info){
        dispatch({
          type: 'TagsModel/labelEdit',
          payload: {
            id:info.id,
            community_id: getCommunityId(),
            label_type: values.model_label_type,
            name: values.model_name,
          }
        })
      }else{
        dispatch({
          type: 'TagsModel/labelAdd',
          payload: {
            community_id: getCommunityId(),
            label_type: values.model_label_type,
            name: values.model_name,
          }
        })
      }
    });
  }
  
  // 表格分页配置
  const pagination = {
    current: params.page,
    onChange: handlePaginationChange,
    total: parseInt(totals),
    showTotal: totals => `共${totals}条`,
    defaultCurrent: 1
  }
  
  // 表格列配置
  const columns = [{
    title: '标签名称',
    dataIndex: 'name',
    key: 'name',
    render: noData,
  }, {
    title: '分类',
    dataIndex: 'label_type_name',
    key: 'label_type_name',
    render: noData,
  },{
    title: '操作',
    dataIndex: 'desc',
    render: (text, record) => {
      return <div>
        {author('edit') ? <a className="mr1" onClick={mark.bind(this, record)}>编辑</a> : null}
        {author('delete') ? <Popconfirm title="确定要删除这个标签数据么？" onConfirm={deleteTags.bind(this, record)}>
          <a className="table-operating" style={{ marginLeft: '10px' }}>删除</a>
        </Popconfirm> : null}
      </div>
    }
  }];

  return (
    <div>
      <Breadcrumb separator=">">
        <Breadcrumb.Item>小区管理</Breadcrumb.Item>
        <Breadcrumb.Item>标签管理</Breadcrumb.Item>
      </Breadcrumb>
      <Card className="section">
        <Form>
          <Row>
            <Col span={6}>
              <FormItem label="标签分类" {...formItemLayout}>
                {getFieldDecorator('label_type')(
                  <Select placeholder="请选择标签分类" notFoundContent="没有数据">
                    <Option value="">全部</Option>
                    {labelType ? labelType.map((value, index) => { return <Option key={index} value={value.id}>{value.name}</Option> }):null}
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label="标签名称" {...formItemLayout}>
                {getFieldDecorator('name')(
                  <Input type="text" placeholder="请输入标签名称" />
                )}
              </FormItem>
            </Col>
            <Col style={{ float: 'right', paddingRight: '2%' }}>
              <Button type="primary" className="mr1" onClick={handleSubmit}>查询</Button>
              <Button type="ghost" onClick={handleReset}>重置</Button>
            </Col>
          </Row>
        </Form>
      </Card>
      <Card>
        {author('add') ? <Button type="primary" onClick={showModal}><Icon type="plus" />新增标签</Button> :null}
        <Table className="mt1" dataSource={list} columns={columns} loading={loading} rowKey={record => record.id} pagination={pagination} />
      </Card>
      <Modal title={info?'编辑标签':'新增标签'} visible={visible} onOk={handleOk.bind(this)} onCancel={hideModal.bind(this)}>
        <Form>
          <Row>
            <Col className="mb1">
              <FormItem label="标签类型" {...formItemLayout}>
                {getFieldDecorator('model_label_type', {
                  rules: [{ required: true, message: '请选择标签类型'}],
                  initialValue: info?parseInt(info.label_type):undefined
                })(
                  <Select placeholder="请选择标签类型" notFoundContent="没有数据">
                    {labelType ? labelType.map((value, index) => { return <Option key={index} value={value.id}>{value.name}</Option> }):null}
                  </Select>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col className="mb1">
              <FormItem label="标签名称" {...formItemLayout}>
                {getFieldDecorator('model_name', {
                  rules: [{ required: true, type: "string", pattern: /^.{0,15}$/, message: '请输入标签名称（1-15位任意字符）', whitespace: true }],
                  initialValue: info.name
                })(
                  <Input type="text" placeholder="请输入标签名称" maxLength={15} />
                )}
              </FormItem>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
}

function mapStateToProps(state) {
  return {
    ...state.TagsModel,
    loading: state.loading.models.TagsModel,
  };
}
export default connect(mapStateToProps)(Form.create()(Tags));
