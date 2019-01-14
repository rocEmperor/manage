import React from 'react';
import { connect } from 'dva';
import { Form, Breadcrumb, Row, Col, Card, Select, Input, Button, Popconfirm, Table} from 'antd';
import { Link } from 'react-router-dom';
import { author } from '../../utils/util';
const FormItem = Form.Item;
const Option = Select.Option;
import './index.css'

function TemplateManage(props) {
  const { form, dispatch, totals, params, is_reset, list} = props;
  const { getFieldDecorator, } = form;

  if (is_reset == true) {
    form.resetFields();
    dispatch({
      type: 'TemplateManagementModel/concat',
      payload: {
        is_reset: false,
      }
    });
  }

  function reload(params) {
    dispatch({
      type: 'TemplateManagementModel/getTemplateList',
      payload: params,
    });
  }

  function handSearch(){
    form.validateFields((err, values) => {
      const param = values;
      param.page = 1;
      param.rows = 10;
      param.community_id = sessionStorage.getItem("communityId");
      reload(param);
    })
  }

  function handleReset(){
    form.resetFields();
    form.validateFields((err, values) => {
      const param = {
        page: 1,
        rows: 10,
        name:'',
        type:'',
        community_id: sessionStorage.getItem("communityId"),
      }
      reload(param);
    })
  }

  function templateDelete(id){
    dispatch({
      type: 'TemplateManagementModel/templateDelete',
      payload: {
        id:id
      },
      callback:()=>{
        dispatch({
          type: 'TemplateManagementModel/getTemplateList',
          payload: params,
        });
      }
    });
  }

  function pageChange(page){
    const param = { ...params, page };
    reload(param);
  }

  function add(){

  }

  const formItemLayout = { labelCol: { span: 6 }, wrapperCol: { span: 16 } };

  const columns = [{
    title: '模版名称',
    dataIndex: 'name',
    key: 'name',
  }, {
    title: '模版类型',
    dataIndex: 'type_desc',
    key: 'type_desc',
  }, {
    title: '纸张类型',
    dataIndex: 'paper_size_desc',
    key: 'paper_size_desc',
  }, {
    title: '打印布局',
    dataIndex: 'layout_desc',
    key: 'layout_desc',
  }, {
    title: '备注',
    dataIndex: 'note',
    key: 'note',
    render: (text, record) => {
      if (text) {
        return (<span>{text.length > 10 ? text.substring(0, 10) + '...' : text}</span>)
      } else {
        return (<span>-</span>)
      }
    },
  }, {
    title: '操作',
    dataIndex: 'operation',
    render: (text, record) => {
      let iLink = `/addTemplateOne?id=` + record.id + `&template_type=` + record.type;
      let aLink = `/addTemplateTwo?id=` + record.id + `&template_type=` + record.type +`&detail=detail`;
      return <div>
        {author('details') ? <Link to={aLink}>查看</Link> :null}
        {author('edit') ? <Link to={iLink} className="ml1">编辑</Link>:null}
        {author('delete') ? <Popconfirm title="确认要删除么？" onConfirm={templateDelete.bind(this,record.id)} okText="确认" cancelText="取消">
          <a href="" className="ml1">删除</a>
        </Popconfirm>:null}
      </div>
    }
  }];

  const PaginationProps = {
    total: Number(totals),
    defaultPageSize: 10,
    current: params.page,
    onChange: pageChange.bind(this),
    showTotal: (total) => `共有 ${Number(totals)} 条`,
  }


  return (
    <div>
      <Breadcrumb separator=">">
        <Breadcrumb.Item>计费管理</Breadcrumb.Item>
        <Breadcrumb.Item>票据模板管理</Breadcrumb.Item>
      </Breadcrumb>
      <Card className="section">
        <Form>
          <Row>
            <Col span={6}>
              <FormItem {...formItemLayout} label="模版类型" required>
                {getFieldDecorator('type')(
                  <Select placeholder= "请选择模版类型">
                    <Option value="-1">全部</Option>
                    <Option value="1">通知单模版</Option>
                    <Option value="2">收据模版</Option>
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem {...formItemLayout} label="模版名称" >
                {getFieldDecorator('name')(
                  <Input placeholder="请输入模版名称" />
                )}
              </FormItem>
            </Col>
            <Col span={5} offset={1}>
              <Button type="primary" onClick={handSearch.bind(this)}>查询</Button>
              <Button className="ml1" type="ghost" onClick={handleReset.bind(this)}>重置</Button>
            </Col>
          </Row>
        </Form>
      </Card>
      <Card className="section">
        {author('add') ?<Link to={`/addTemplateOne`}><Button type="primary" className="mb1" onClick={add.bind(this)}>新增模版</Button></Link>:null}
        <Table columns={columns} dataSource={list} pagination={PaginationProps} rowKey={record=>record.id}/>
      </Card>
    </div>
  )
}

function mapStateToProps(state) {
  return {
    ...state.TemplateManagementModel,
  }
}
export default connect(mapStateToProps)(Form.create()(TemplateManage));