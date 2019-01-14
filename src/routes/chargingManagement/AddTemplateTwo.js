import React from 'react';
import { connect } from 'dva';
import { Form, Breadcrumb, Card, Select, Button, Row, Col, Tag, Table, Modal, Input } from 'antd';
const { TextArea } = Input;
import './template.less'
import { Link } from 'react-router-dom';
import { noData } from '../../utils/util';
const FormItem = Form.Item;
const Option = Select.Option;

function AddTemplateTwo(props) {
  let { dispatch, form, visiableAdd, type, down, table, top, downType, tableType, topType, 
    addNotes, showTitle, showLogo, showNumber, showNote, id, addWidth, detail, imgsrc,note} = props;
  
  if(type==2){
    dispatch({
      type: "AddTemplateTwoModel/concat",
      payload: {
        addWidth: false
      }
    })
  }
    
  const { getFieldDecorator } = form;

  /**
   * 新增/编辑 表单提交
   */
  function handleSubmit(e) {
    window.location.href = "#/printTemplate";
  }
  /**
   * 返回
   */
  function handleBack() {
    history.go(-1);
  }

  function log(id){
    dispatch({
      type: "AddTemplateTwoModel/templateConfigDelete",
      payload: {
        id:id
      }
    })
  }
  function addList(i){
    dispatch({
      type: "AddTemplateTwoModel/concat",
      payload: {
        visiableAdd:true,
        type:i
      }
    })
  }

  function handleCancel(i){
    dispatch({
      type: "AddTemplateTwoModel/concat",
      payload: {
        visiableAdd:false,
        type:i,
        addNotes:false,
        addWidth:true,
      }
    })
    form.resetFields();
  }

  function handleOk(type){
    let note='',width:'';
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      if (type != 2 || addNotes){
        width=values.width;
      }
      if(addNotes){
        note=values.note;
      }
      if(type==1 || type==3){
        values.field_name = new Array(values.field_name)
      }
      
      let arr = [];
      for (let i = 0; i < values.field_name.length ; i++){
        const obj = {
          field_name: values.field_name[i]
        };
        arr.push(obj);
      }
      dispatch({
        type: "AddTemplateTwoModel/templateConfigAdd",
        payload: {
          field_name_list: arr,
          type: type,
          width: width,
          note:note,
          template_id:id
        },
        callback: () => {
          form.resetFields();
        }
      })
    })
  }


  function handleChange(val){
    if(val == 'note' ){
      dispatch({
        type: "AddTemplateTwoModel/concat",
        payload: {
          addNotes: true,
          addWidth:false,
        }
      })
    }else if(val=='title' || val=='img' || val=='number' ){
      dispatch({
        type: "AddTemplateTwoModel/concat",
        payload: {
          addWidth: false,
          addNotes: false,
        }
      })
    }else{
      dispatch({
        type: "AddTemplateTwoModel/concat",
        payload: {
          addNotes:false,
          addWidth: true,
        }
      })
    }
  }

  for(let i = 0;i <top.length;i++){
    if(top[i].field_name == 'title'){
      dispatch({
        type: "AddTemplateTwoModel/concat",
        payload: {
          showTitle:true
        }
      })
    } else if (top[i].field_name == 'number'){
      dispatch({
        type: "AddTemplateTwoModel/concat",
        payload: {
          showNumber:true
        }
      })
    } else if (top[i].field_name == 'img') {
      dispatch({
        type: "AddTemplateTwoModel/concat",
        payload: {
          showLogo: true,
          imgsrc: top[i].logo_img,
        }
      })
    }
  }

  for(let j = 0;j <down.length;j++){
    if(down[j].field_name == 'note'){
      dispatch({
        type: "AddTemplateTwoModel/concat",
        payload: {
          showNote:true,
          note: down[j].note,
        }
      })
    }
  }


  // 布局
  const formItemLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 16 },
  };

  let columns = [];
  for (let i = 0; i < table.length ; i++){
    let obj = {
      title: table[i].name,
      dataIndex: table[i].field_name,
      key: table[i].field_name,
      render: noData
    }
    columns.push(obj);
  }

  const data = [{
    bill_amount: "",
    discount_amount: "",
    end: "",
    end_at: "",
    formula: "",
    house_info: "",
    pay_amount: "",
    pay_item: "",
    start: "",
    start_at: "",
    use: "",
    id:1,
  }, {
    bill_amount: "",
    discount_amount: "",
    end: "",
    end_at: "",
    formula: "",
    house_info: "",
    pay_amount: "",
    pay_item: "",
    start: "",
    start_at: "",
    use: "",
    id:2,
  }, {
    bill_amount: "",
    discount_amount: "",
    end: "",
    end_at: "",
    formula: "",
    house_info: "",
    pay_amount: "",
    pay_item: "",
    start: "",
    start_at: "",
    use: "",
    id:3,
  }];

  return (
    <div>
      <Breadcrumb separator=">">
        <Breadcrumb.Item><Link to="/printTemplate">票据模版管理</Link></Breadcrumb.Item>
        <Breadcrumb.Item>{detail ? '查看模版' :'编辑模版'}</Breadcrumb.Item>
      </Breadcrumb>
      <Row>
        <Col span={6}>
          <Card className="section" title="页眉区" extra={ detail? '' : <a onClick={addList.bind(this, 1)}>添加</a>}>
            {top.map((item,index)=>{
              return <Tag closable={detail ? false :true} onClose={log.bind(this, item.id)} className="mb1 mr1 mt1" key={item.id}>{item.name}</Tag>
            })}
          </Card>
          <Card className="section" title="表格区" extra={detail ? '' : <a onClick={addList.bind(this, 2)}>添加</a>}>
            {table.map((item, index) => {
              return <Tag closable={detail ? false : true} onClose={log.bind(this, item.id)} className="mb1 mr1 mt1" key={item.id}>{item.name}</Tag>
            })}
          </Card>
          <Card className="section" title="页脚区" extra={detail ? '' : <a onClick={addList.bind(this, 3)}>添加</a>}>
            {down.map((item, index) => {
              return <Tag closable={detail ? false : true} onClose={log.bind(this, item.id)} className="mb1 mr1 mt1" key={item.id}>{item.name}</Tag>
            })}
          </Card>
        </Col>
        <Col span={18}>
          <Card className="section preview" title="预览区" style={{marginLeft:'20px'}}>
            <div style={{border:'1px dashed #ccc'}}>
              <div className="header">
                {showTitle?<h1>这是标题</h1>:null}
                {showLogo && imgsrc != ''?<div className="logo"><img src={imgsrc}/></div>:null}
                {showNumber?<div className="number">NO：<span style={{color:'red'}}>[编号]</span></div>:null}
              </div>
              <div className="top">
                {top.map((item,index)=>{
                  return (item.field_name != 'title' && item.field_name != 'number' && item.field_name != 'img') ? <p key={index} className={item.width == 1 ? 'percent30' : (item.width == 3 ? 'percent100' : (item.width == 2 ? 'percent50' : ''))}>{item.name}:[{item.name}]</p> : null;
                })}
              </div>
              <div className="content">
                <Table columns={columns} dataSource={data} pagination={false} rowKey={record => record.id}/>
              </div>
              <div className="top">
                {down.map((item, index) => {
                  return item.field_name != 'note'? <p key={index} className={item.width == 1 ? 'percent30' : item.width == 3 ? 'percent100' : (item.width == 2 ? 'percent50' : '')}>{item.name}:[{item.name}]</p> : null;
                })}
              </div>
              {showNote ? <p className="percent100" style={{ padding:"15px 30px 0 30px"}}>说明:{note}</p>:null}
            </div>
          </Card>
        </Col>
      </Row>
      {!detail ?
        <div>
          <Button type="primary" onClick={handleSubmit.bind(this)} style={{ marginLeft: '30%' }}>提交</Button>
          <Button className="ml1" type="ghost" onClick={handleBack.bind(this)}>返回</Button>
        </div>
        :null
      }
      <Modal title={type == 1 ? '设置页眉' : type == 2 ? '设置表格' : '设置页脚'} visible={visiableAdd} onOk={handleOk.bind(this, type)} onCancel={handleCancel.bind(this, 1)}>
        <Form>
          <FormItem {...formItemLayout} label="显示内容" >
            {getFieldDecorator('field_name', {
              rules: [{ required: true, message: '请选择显示内容!' }],
            })(
              <Select placeholder="请选择显示内容" onChange={handleChange.bind(this)} mode={type == 2 ?'multiple':''}>
                {type == 1 ? topType.map((value,index)=>{
                  return <Option  key={index} value={value.field_name}>{value.name}</Option>
                })
                  : type == 2 ? tableType.map((value,index)=>{
                    return <Option  key={index} value={value.field_name}>{value.name}</Option>
                  })
                    : downType.map((value,index)=>{
                      return <Option  key={index} value={value.field_name}>{value.name}</Option>
                    })
                }
              </Select>
            )}
          </FormItem>
          {addWidth ?
            <FormItem {...formItemLayout} label="宽度" >
              {getFieldDecorator('width', {
                rules: [{ required: true, message: '请选择宽度!' }],
              })(
                <Select placeholder="请选择宽度">
                  <Option value="1">33.3%</Option>
                  <Option value="2">50%</Option>
                  <Option value="3">100%</Option>
                </Select>
              )}
            </FormItem>
            :null
          }
          {addNotes ?
            <FormItem label="说明内容" {...formItemLayout}>
              {getFieldDecorator('note', {
                rules: [{ required: true, message: '请输入100字以内说明内容!', pattern: /^.{0,100}$/, }],
              })(
                <TextArea rows={4} placeholder="请输入说明内容"/>
              )}
            </FormItem>
            :null}
        </Form>
      </Modal>
    </div>
  );
}

function mapStateToProps(state) {
  return { ...state.AddTemplateTwoModel, loading: state.loading.models.AddTemplateTwoModel };
}
export default connect(mapStateToProps)(Form.create()(AddTemplateTwo));
