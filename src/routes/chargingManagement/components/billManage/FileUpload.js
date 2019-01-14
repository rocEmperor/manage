'use strick';
import React from 'react';
import { connect } from 'dva';
import {Button, Select, Form, Modal, Steps, Icon, Upload, Progress} from 'antd';
const Option = Select.Option;
const Step = Steps.Step;
import { getUrl } from '../../../../utils/util';
// import  './index.css'
// import { getApiUrl } from '../../config.js';

function FileUpLoad(props){
  const {dispatch,onCancel,visible,stepNums,type,payChannel,progressPercents,progressStates,sums,successCounts} = props;
  
  function handleCancel() {
    dispatch({
      type: 'FileUploadModel/concat',
      payload: {
        stepNums: 0,
        progressPercents: 0,
      }
    });
    onCancel();
  }
  function uploadChanges(info) {
    // this.setState({
    //   fileListLens: info.fileList.length,
    //   fileListArrs: info.fileList,
    // })
    // fileUrls = info.file.response ? info.file.response.data.file_path : '';
    // fileStates = info.file.response ? info.file.response.code : '';
    // fileLens = info.fileList.length;
    // fileListDs = {
    //   length: fileLens,
    //   url: fileUrls,
    //   state: fileStates,
    // }
    // if (info.file.status == 'done') {
    //   if (info.file.response.code != 20000) {
    //     message.error(info.file.response.error.errorMsg);
    //     return false;
    //   }
    //   uploadSuccess = true;
    //   message.success('文件已成功上传！');
    //   this.setState({
    //     taskId: info.fileList[0].response.data.task_id
    //   });

    // } else if (info.file.status == 'error') {
    //   message.error('很遗憾...这次上传失败了。');
    // }
  }


  //文件删除时 
  function fileRemove(file) {
    
  }

  // 批量收款数据导入
  function handleImports() {
    dispatch({
      type: 'FileUploadModel/concat',
      payload: {
        stepNums: stepNums+1
      }
    });
    // if (fileListDs.length == 0) {
    //   message.error('请先上传一个文件。');
    //   return;
    // }
    // if (this.state.pay_channel == '') {
    //   message.destroy();
    //   message.info("请先选择收款方式！");
    //   return;
    // }
    // let task_id = this.state.taskId;
    // if (uploadSuccess) {
    //   this.setState({
    //     collectsVisible1: true,
    //     collectsVisible2: false,
    //     collectsVisible3: true,
    //     stepNums: 1,
    //     isFooters: false
    //   })
    //   this.props.dispatch(actions.collectsBillImport({
    //     "community_id": this.props.layout.communityId,
    //     "file_path": fileUrls,
    //     "pay_channel": this.state.pay_channel,
    //     "task_id": task_id,
    //   }, () => {
    //     this.setState({
    //       collectsVisible1: true,
    //       collectsVisible2: true,
    //       collectsVisible3: false,
    //       stepNums: 2,
    //       isFooters: false
    //     })
    //     // swindow.location.reload();
    //   }));

    // } else {
    //   message.error('开始导入前，请先确定文件已上传成功!');
    //   return;
    // }
  }  
  let _cookie = document.cookie.split('token=')[1];

  const uploadPropsBill = {
    action: getUrl() + '/property/alipay-cost/pay-upload',
    accept: '.xls,.xlsx',
    name: 'file',
    disabled: false,
    fileList: [],
    onChange: uploadChanges,
    onRemove: fileRemove,
    data: {
      token: _cookie
    }
  };
  const uploadButton = (
    <Button type="ghost">
      <Icon type="upload" /> 上传文件
    </Button>
  );
  let a = true;
  return (<Modal title={type == 1?"导入账单":"批量收款"} visible={visible} onCancel={handleCancel}
    footer={stepNums == 0 ? (<Button type="primary" onClick={handleImports}>开始导入</Button>) : (stepNums == 1?<Button type="primary">导入中</Button>:<Button type="primary">关闭</Button>)}>
    <Steps size="small" current={stepNums}>
      <Step title="上传文档" />
      <Step title="导入数据" />
      <Step title="完成" />
    </Steps>
    {stepNums == 0?<div>      
      <div className="mt1">
        <p className="mtb1">1.请按照数据模板的格式准备要导入的数据</p>
        {//<Button type="primary" icon="download" onClick={this.downTemp.bind(this)} size="small">下载数据模版</Button>
        }
        <a href={getUrl() + `/property/alipay-cost/get-pay-excel?token=${_cookie}`} download="">下载数据模版 <Icon type="download" /></a>
        {type==1?null:<p className="mtb1">2.请选择收款方式</p>}
        {type==1?null:<Select placeholder="请选择" style={{ width: 120 }}>
          {payChannel.map((value, index) => { return <Option key={index} value={value.key.toString()}>{value.value}</Option> })}
        </Select>}
        <p className="mtb1">{type==1?2:3}.请选择需要导入的文件</p>
        <Upload {...uploadPropsBill}>{a ? null : uploadButton}</Upload>
      </div>
    </div>:null}
    {stepNums == 1?<div>
      <Progress percent={progressPercents} status={progressStates ? progressStates : 'active'} />
      <p className="mb1">正在导入数据，请耐心等候</p>
      <p>提示：</p>
      <p className="ml1">1.导入数据期间请不要关闭此窗口</p>
      <p className="ml1">2.导入数据需要一段时间，如出现中断，请重新导入。</p>
    </div>:null}    
    {stepNums == 2?<div>
      <Progress percent={progressPercents} status={progressStates ? progressStates : 'active'} />
      <p>导入完成，共 {sums} 条，成功上传 {successCounts} 条。</p>
    </div>:null}
  </Modal>
  )
}

function mapStateToProps(state) {
  return {
    ...state.FileUploadModel,
  };
}
export default connect(mapStateToProps)(Form.create()(FileUpLoad));
