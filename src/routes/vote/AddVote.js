import React from 'react';
import { connect } from 'dva';
import styles from './index.less'
import { getUrl } from '../../utils/util';
import Residents from './Component.js'
import { Form, Breadcrumb, Table, Input, Button, Select, Card, Icon, message, DatePicker, Modal, Radio, Upload } from 'antd';
const FormItem = Form.Item;
const createForm = Form.create;
// const dataSource = [];
const Option = Select.Option;
const RadioGroup = Radio.Group;

const formItemLayout = {
  labelCol: {
    span: 2
  },
  wrapperCol: {
    span: 18
  }
};
const formItemLayout2 = {
  wrapperCol: {
    span: 18,
    offset: 2
  }
};
function AddVote (props) {
  let { dispatch, AddVoteModel, layout, form } = props;
  let { problems, type, permission, selectedRows, selectedRowKeys, data, previewVisible, previewImage, visible, files, imageFileList } = AddVoteModel;
  let { getFieldDecorator } = form;
  function publicState (callBack, del){
    let arr = JSON.parse(JSON.stringify(problems));
    let arrs = [];
    arr.map((item, index)=>{
      let str = `title_${index}`;
      let str2 = `option_type_${index}`;
      arrs.push(str, str2);
      item.options.map((items, indexs)=>{
        if (type == 1) {
          let str1 = `option_${index}_${indexs}`;
          arrs.push(str1);
        } else {
          let str2 = `options_${index}_${indexs}`;
          let str3 = `img_${index}_${indexs}`;
          let str4 = `desc_${index}_${indexs}`;
          arrs.push(str2, str3, str4);
        }
      })
    });
    let arrys = [];
    form.validateFields(arrs, (err, values) => {
      if (!!err && del && del == 1) {
        message.error('问题内容未填写完整');
        return false;
      }
      arr.map((item, index)=>{
        let obj = {};
        obj.title = values[`title_${index}`];
        obj.option_type = values[`option_type_${index}`];
        obj.show = item.show;
        obj.options = [];
        item.options.map((items, indexs)=>{
          if (type == 1) {
            let objs = {};
            objs.title = values[`option_${index}_${indexs}`];
            obj.options.push(objs);
          } else {
            let objs = {};
            objs.title = values[`options_${index}_${indexs}`];
            objs.image_url = values[`img_${index}_${indexs}`];
            objs.option_desc = values[`desc_${index}_${indexs}`];
            obj.options.push(objs);
          }
        });
        arrys.push(obj);
      });
      callBack && callBack(arrys, arrs);
    })
  }
  function handleToggle (index, type){
    let arr = problems;
    if(type === 'block'){
      arr[index].show = 'none';
    }else{
      arr[index].show = 'block';
    }
    dispatch({type: 'AddVoteModel/concat', payload: { problems: arr }})
  }
  function handleAdd () {
    publicState(() => {
      let arr = JSON.parse(JSON.stringify(problems));
      if (type == 1) {
        let obj = {
          option_type: 1,
          options: [{ title: '' }, { title: '' }],
          title: '',
          show: 'block',
        };
        arr.push(obj);
      } else {
        let obj = {
          option_type: 1,
          options: [
            {
              title: '',
              image_url: '',
              option_desc: '',
              isUpload:true
            }, {
              title: '',
              image_url: '',
              option_desc: '',
              isUpload:true
            }
          ],
          title: '',
          show:'block'
        };
        arr.push(obj);
      }
      dispatch({type: 'AddVoteModel/concat', payload: { problems: arr }})
    }, 1);
  }
  function handleDelete (index) {
    publicState((arr, arr2) => {
      form.resetFields(arr2);
      let arrs = JSON.parse(JSON.stringify(arr));
      arrs.splice(index, 1);
      dispatch({type: 'AddVoteModel/concat', payload: { problems: arrs }})
    }, 2);
  }
  function handleTypeChange (val) {
    let problems = [
      {
        option_type: 1,
        options: [
          {
            title: '',
            image_url: '',
            option_desc: '',
            isUpload: true
          }, {
            title: '',
            image_url: '',
            option_desc: '',
            isUpload:true,
          }
        ],
        title: '',
        show: 'block'
      }
    ];
    dispatch({type: 'AddVoteModel/concat', payload: { type: val, problems: problems }})
  }
  function handlePermission (val) {
    dispatch({type: 'AddVoteModel/concat', payload: { permission: val }})
  }
  function handleShow () {
    dispatch({type: 'AddVoteModel/concat', payload: { visible: true }})
  }
  function handleOptionAdd (index) {
    publicState((arr) => {
      let arrs = JSON.parse(JSON.stringify(arr));
      if (type == 1) {
        let obj = { title: '' };
        arrs[index].options.push(obj);
      } else {
        let obj = {
          title: '',
          image_url: '',
          option_desc: '',
          isUpload: true
        };
        arrs[index].options.push(obj);
      }
      dispatch({type: 'AddVoteModel/concat', payload: { problems: arrs }})
    }, 1);
  }
  function handleOptionDel (index, indexs, type) {
    publicState((arr, arr2) => {
      form.resetFields(arr2);
      let arrs = JSON.parse(JSON.stringify(arr));
      arrs[index].options.splice(indexs, 1);
      if (type === 'image') {
        imageFileList[index].splice(indexs, 1);
        dispatch({
          type: 'AddVoteModel/concat',
          payload: {
            problems: arrs,
            imageFileList: imageFileList
          }
        })
      } else {
        dispatch({
          type: 'AddVoteModel/concat',
          payload: {
            problems: arrs
          }
        })
      }
    }, 2);
  }
  function imageRemoveFn (index, indexs) {
    let setFileList = {};
    let name = `img_${index}_${indexs}`;
    setFileList[name] = ''
    form.setFieldsValue(setFileList);
    let arr = JSON.parse(JSON.stringify(problems));
    arr[index].options[indexs].isUpload = true
    imageFileList[index][indexs].splice(0, 1);
    dispatch({
      type: 'AddVoteModel/concat',
      payload: {
        imageFileList: imageFileList,
        problems: arr
      }
    })
  }
  function handleSubmit () {
    let arr = JSON.parse(JSON.stringify(problems));
    let arrys = [];
    form.validateFields((err, values) => {
      if (err) {
        message.error('问题内容未填写完整');
        return false;
      }
      arr.map((item, index) => {
        let obj = {};
        obj.title = values[`title_${index}`];
        obj.option_type = values[`option_type_${index}`];
        obj.show = item.show;
        obj.options = [];
        item.options.map((items, indexs)=>{
          if (type == 1) {
            let objs = {};
            objs.title = values[`option_${index}_${indexs}`];
            obj.options.push(objs);
          } else {
            let objs = {};
            objs.title = values[`options_${index}_${indexs}`];
            objs.image_url = values[`img_${index}_${indexs}`][0].response.data.filepath
            objs.option_desc = values[`desc_${index}_${indexs}`];
            obj.options.push(objs);
          }
        });
        arrys.push(obj);
      });
      let obj = {};
      if (permission == 3) {
        if (selectedRows.length > 0) {
          obj.appoint_members = [];
          selectedRows.map(item => {
            let objs = {};
            objs.member_id = item.member_id;
            objs.room_id = item.room_id;
            obj.appoint_members.push(objs);
          })
        } else {
          message.error('请选择业主')
          return false;
        }
      }
      obj.community_id = layout.communityId;
      obj.vote_name = values.vote_name;
      obj.vote_type = values.vote_type;
      obj.vote_desc = values.vote_desc;
      obj.permission_type = values.permission_type;
      obj.end_time = values.end_time.format('YYYY-MM-DD HH:mm');
      obj.show_at = values.show_at.format('YYYY-MM-DD HH:mm');
      obj.problems = arrys;
      if (Date.parse(new Date(obj.end_time)) > Date.parse(new Date(obj.show_at))) {
        message.error('截止时间不能晚于公示时间');
        return false;
      }
      dispatch({
        type: 'AddVoteModel/voteAdd',
        payload: obj
      })
    })
  }
  function handlePreview (file) {
    dispatch({
      type: 'AddVoteModel/concat',
      payload: {
        previewImage: file.url || file.thumbUrl,
        previewVisible: true
      }})
  }

  function handleCancel () {
    dispatch({type: 'AddVoteModel/concat', payload: { previewVisible: false }})
  }
  function handImgChange (index, indexs, e) {
    let arr = JSON.parse(JSON.stringify(problems));
    // let resData = undefined;
    // if (e.file.response !== undefined) {
    //   resData = e.file.response.data
    // }
    if (e.fileList.length) {
      arr[index].options[indexs].isUpload = false;
      if (!imageFileList[index]) {
        imageFileList[index] = [];
      }
      if (!imageFileList[index][indexs]) {
        imageFileList[index][indexs] = []
      }
      imageFileList[index][indexs] = e.fileList;
      dispatch({
        type: 'AddVoteModel/concat',
        payload: {
          problems: arr,
          imageFileList: imageFileList
        }
      })
    } else {
      arr[index].options[indexs].isUpload = true;
      dispatch({type: 'AddVoteModel/concat', payload: { problems: arr }})
    }
    if (e.file.status === 'error') {
      message.error('很遗憾...这次上传失败了。');
    }
    if (e.file.response !== undefined) {
      // dispatch({
      //   type: 'AddVoteModel/concat',
      // payload: {
      //   business_img: resData.filepath,
      //   business_img_local: resData.localPath
      // }
      // })
    }
  }
  function normFile (e) {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  }
  function beforeUpload (file) {
    const isJPEG = file.type === 'image/jpeg';
    const isPNG = file.type === 'image/png';
    const isJPG = file.type === 'image/jpg';
    if (!isJPG && !isJPEG && !isPNG) {
      message.error('只能上传.jpeg,.jpg,.png图片');
      return false;
    }
    const isLt512k = file.size / 1024  < 512;
    if (!isLt512k) {
      message.error('请上传小于 512kb 的图片!');
      return false;
    }
    const newDate = new Date().getTime();
    const strs = file.type.split("/");
    dispatch({
      type: 'AddVoteModel/concat',
      payload: {
        name: `zhihuishequ_text/${newDate}.${strs[1]}`,
        files: file
      }})
  }
  function handleCancels() {
    dispatch({type: 'AddVoteModel/concat', payload: { visible: false }})
  }
  function handleCheck (e, selectedRows, selectedRowKeys) {
    dispatch({
      type: 'AddVoteModel/concat',
      payload: {
        visible: false,
        selectedRows: selectedRows,
        selectedRowKeys: selectedRowKeys
      }
    })
  }
  function handleResidentsDel (obj) {
    const arr = JSON.parse(JSON.stringify(selectedRows));
    const arr2 = JSON.parse(JSON.stringify(selectedRowKeys));
    let indexs = '', indexs2 = '';
    arr.map((item, index) => {
      if (item.id == obj.id) {
        indexs = index;
      }
    });
    arr2.map((item, index) => {
      if (item == obj.id) {
        indexs2 = index;
      }
    });
    arr.splice(indexs, 1);
    arr2.splice(indexs2, 1);
    dispatch({
      type: 'AddVoteModel/concat',
      payload: {
        selectedRows: arr,
        selectedRowKeys: arr2
      }
    })
  }
  function createExtra(index, item) {
    return (
      <span>
        <a style={{ marginRight: 10 }}
          onClick={() => handleToggle(index, item.show)}>
          {item.show === 'block' ? '收起' : '展开'}
        </a>
        { problems.length > 1 ? <a onClick={() => handleDelete(index)}>删除</a> : null }
      </span>
    )
  }
  const Radio1 = data.option_type && data.option_type.map((item, index) => {
    return (
      <Radio value={item.key} key={index}>
        {item.value}
      </Radio>
    )
  });
  const Options2 = data.permission_type && data.permission_type.map((item, index) => {
    return (
      <Option value={`${item.key}`} key={index}>
        {item.value}
      </Option>
    )
  });
  const Options3 = data.vote_type && data.vote_type.map((item, index) => {
    return (
      <Option value={`${item.key}`} key={index}>
        {item.value}
      </Option>
    )
  });
  const uploadButton = (
    <div>
      <Icon type="plus" />
      <div className="ant-upload-text">选择图片</div>
    </div>
  );
  const noData = (text, record) => {
    return (
      <span>{text ? text : '-'}</span>
    )
  };
  const columns = [{
    title: '姓名',
    dataIndex: 'name',
    key: 'name',
    render: noData
  }, {
    title: '手机号码',
    dataIndex: 'mobile',
    key: 'mobile',
    render: noData
  }, {
    title: '性别',
    dataIndex: 'sex',
    key: 'sex',
    render: (text, record) => {
      if (text === '1') {
        return (
          <span>男</span>
        )
      } else if (text === '2') {
        return (
          <span>女</span>
        )
      } else {
        return (
          <span>未知</span>
        )
      }
    },
  }, {
    title: '对应房屋',
    dataIndex: 'address',
    key: 'address',
    render: noData
  }, {
    title: '身份',
    dataIndex: 'identity_type_desc',
    key: 'identity_type_desc',
    render: noData
  }, {
    title: '认证状态',
    dataIndex: 'status',
    key: 'status',
    render: (text, record) => {
      if(text == 1){
        return (
          <span>未认证</span>
        )
      } else if (text == 2){
        return (
          <span>已认证</span>
        )
      } else {
        return (
          <span>已失效</span>
        )
      }
    },
  }, {
    title: '操作',
    key: 'action3',
    render: (text, record) => {
      return <a onClick={() => handleResidentsDel(record)}>删除</a>
    }
  }];
  // const disabledMinutes = () => {
  //   const hours = range(0, 20);
  //   return hours;
  // };
  // const Options2;
  return (
    <div className="page-content">
      <Breadcrumb separator="/">
        <Breadcrumb.Item><a href="javascript:history.go(-1)">投票管理</a></Breadcrumb.Item>
        <Breadcrumb.Item>新增投票</Breadcrumb.Item>
      </Breadcrumb>
      <Card>
        <FormItem className="" label="投票名称" {...formItemLayout}>
          {getFieldDecorator('vote_name', {
            rules: [{required: true, message: "请输入投票名称"}]
          })(
            <Input type="text" placeholder="请输入投票名称" style={{ width: 390 }} maxLength={50}/>
          )}
        </FormItem>
        <FormItem className="" label="截止时间" {...formItemLayout}>
          {getFieldDecorator('end_time', {
            rules: [{required: true, message: "请选择截止时间"}]
          })(
            <DatePicker showTime="true" format="YYYY-MM-DD HH:mm"/>
          )}
        </FormItem>
        <FormItem className="" label="公示时间" {...formItemLayout}>
          {getFieldDecorator('show_at', {
            rules: [{required: true, message: "请选择公示时间"}]
          })(
            <DatePicker showTime="true" format="YYYY-MM-DD HH:mm"/>
          )}
        </FormItem>
        <FormItem className="" label="投票说明" {...formItemLayout}>
          {getFieldDecorator('vote_desc', {
            rules: [{required: false, message: "请输入投票说明"}]
          })(
            <Input type="textarea" placeholder="请输入投票说明" style={{ width: 390 }} maxLength={500}/>
          )}
        </FormItem>
        <FormItem className="" label="投票类型" {...formItemLayout}>
          {getFieldDecorator('vote_type', {
            rules: [{required: true, message: "请选择投票类型"}],
            initialValue: '1'
          })(
            <Select onChange={handleTypeChange} placeholder="请选择投票类型" style={{ width: 390 }}>
              {Options3}
            </Select>
          )}
        </FormItem>
        <FormItem className="" label="投票权限" {...formItemLayout}>
          {getFieldDecorator('permission_type', {
            rules: [{required: true, message: "请选择投票权限"}],
            initialValue: '1'
          })(
            <Select onChange={handlePermission} placeholder="请选择投票权限" style={{ width: 390 }}>
              {Options2}
            </Select>
          )}
          {permission == 3
            ? <Button style={{ marginLeft: 10}} onClick={handleShow} type="primary">选择业主</Button>
            : null}
        </FormItem>
        {permission == 3 && selectedRows.length > 0
          ? <Card>
            <Table columns={columns} dataSource={selectedRows} rowKey={record => record.id} />
          </Card>
          : null}
        {problems.map((item, index) => {
          return (
            <Card style={{marginBottom: 10}} title={`问题${index + 1}`} extra={createExtra(index, item)} bodyStyle={{display: item.show}} key={index}>
              <FormItem className="" label="标题" {...formItemLayout}>
                {getFieldDecorator(`title_${index}`, {
                  rules: [{required: true, message: "请输入标题"}],
                  initialValue: item.title
                })(
                  <Input type="textarea" placeholder="请输入标题" style={{ width: 390 }} maxLength={200}/>
                )}
              </FormItem>
              <FormItem className="" label="" {...formItemLayout2}>
                {getFieldDecorator(`option_type_${index}`, {
                  rules: [{required: true, message: "请选择"}],
                  initialValue: item.option_type
                })(
                  <RadioGroup>
                    {Radio1}
                  </RadioGroup>
                )}
              </FormItem>
              {item.options.map((items, indexs)=>{
                if (type == 1) {
                  return (
                    <FormItem className="" label={`选项${indexs + 1}`} {...formItemLayout} key={`option-${indexs}`}>
                      {getFieldDecorator(`option_${index}_${indexs}`, {
                        rules: [{required: true, message: "请输入选项内容"}],
                        initialValue: items.title
                      })(
                        <Input type="textarea" placeholder="请输入选项内容" style={{ width: 390 }} maxLength={200}/>
                      )}
                      { item.options.length > 2
                        ? <a style={{ marginLeft: 10 }} onClick={() => handleOptionDel(index, indexs, 'writing')}>删除</a>
                        : null }
                    </FormItem>
                  )
                } else {
                  return (
                    <div key={indexs}>
                      <FormItem className="" label={`选项${indexs + 1}`} {...formItemLayout} key={`options-${indexs}`}>
                        {getFieldDecorator(`options_${index}_${indexs}`, {
                          rules: [{required: true, message: "请输入选项内容"}],
                          initialValue: items.title
                        })(
                          <Input type="text" placeholder="请输入选项内容" style={{ width: 390 }} maxLength={10}/>
                        )}
                        { item.options.length > 2
                          ? <a style={{ marginLeft: 10 }} onClick={() => handleOptionDel(index, indexs, 'image')}>删除</a>
                          : '' }
                      </FormItem>
                      <FormItem {...formItemLayout2}>
                        {getFieldDecorator(`img_${index}_${indexs}`, {
                          rules: [{required: true, message: '请上传图片'}],
                          valuePropName: 'fileList2',
                          normalize: normFile,
                          initialValue: items.image_url,
                          onChange:(e) => handImgChange(index, indexs, e)
                        })(
                          <Upload name="file"
                            action={getUrl()+'/qiniu/upload/image'}
                            data={{file: files}}
                            listType="picture-card"
                            fileList={imageFileList[index] && imageFileList[index][indexs] ? imageFileList[index][indexs] : []}
                            onPreview={handlePreview}
                            onRemove={() => imageRemoveFn(index, indexs)}
                            beforeUpload={beforeUpload}>
                            {items.isUpload ? uploadButton : null}
                          </Upload>
                        )}
                      </FormItem>
                      <FormItem {...formItemLayout2}>
                        {getFieldDecorator(`desc_${index}_${indexs}`, {
                          rules: [{required: true, message: "请输入选项说明"}],
                          initialValue: items.option_desc
                        })(
                          <Input type="textarea" placeholder="请输入选项说明" style={{ width: 390 }} maxLength={500}/>
                        )}
                      </FormItem>
                    </div>
                  )
                }
              })}
              {item.options.length < 30
                ? <a onClick={() => handleOptionAdd(index)}>添加选项</a>
                : null}
            </Card>
          )
        })}
        { problems.length < 10
          ? <Button onClick={handleAdd} className={styles['ink-btn']} type="dashed"><Icon type="plus" />添加问题</Button>
          : null }
        <Button style={{ margin: '10px auto',display: 'block' }}
          onClick={handleSubmit}
          type="primary">
          保存
        </Button>
      </Card>
      <Modal visible={previewVisible} footer={null} onCancel={handleCancel}>
        <img alt="example" style={{ width: '100%' }} src={previewImage} />
      </Modal>
      <Modal title="选择业主" width="80%" visible={visible} footer={null} onCancel={handleCancels}>
        <Residents
          selectedRowKeys={selectedRowKeys}
          selectedRows={selectedRows}
          handleCheck={handleCheck}
          handleCancels={handleCancels}
          dispatch={dispatch}
          layout={layout}/>
      </Modal>
    </div>
  )
}
export default connect(state => {
  return {
    AddVoteModel: state.AddVoteModel,
    layout: state.MainLayout
  }
})(createForm()(AddVote));
