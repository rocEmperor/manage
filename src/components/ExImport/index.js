'use strict';
import React from 'react';
import { Form, Button, Modal, Steps, Progress, Upload, Icon, message, Select } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
const Step = Steps.Step;
import { getUrl } from '../../utils/util';
let timer = false;
let submit = false;
import md5 from 'crypto-js/md5';

class ExImport extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      confirmLoading: false,
      loading:false,
      communitySelect: '',
      fileListArr: [],
      stepNum: 0,
      step1: "block",
      step2: "hide",
      progressNum: 0,
      textShow: 0,
      progressState: "",
      error_url: "",
      success: "",
      totalsNum: "",
      current: 1,
      showStep1: false,
      fileUrl: '',
      fileState: '',
      fileLen: '',
      pay_channel: '',//如果是账单管理批量收款时，选择的收费方式
    };
  }
  //选择小区
  communitySelect(val) {
    this.setState({
      communitySelect: val
    })
  }
  //下载模板
  downloadFile() {
    this.props.downUrl();
  }
  //确认上传
  handleImport() {
    if (this.props.id == 'billmanageMore') {
      this.props.form.validateFields(['pay_channel'], (err, values) => {
        if (err) {
          return;
        } else {
          if (this.state.fileListArr.length == '0') {
            message.error('请上传文件！')
            return;
          }
          submit = true;
          setTimeout(() => {
            window.clearTimeout(timer);
            submit = false;
          }, 50);
          this.setState({
            stepNum: 1,
            step1: "hide",
            step2: "block",
          })
        }
      })
    } else {
      if (this.state.fileListArr.length == '0') {
        message.error('请上传文件！');
        return;
      }
      submit = true;
      setTimeout(() => {
        window.clearTimeout(timer);
        submit = false;
      }, 50);
      this.setState({
        stepNum: 1,
        step1: "hide",
        step2: "block",
      })
    }
    // this.props.handleImport();
  }
  //关闭弹框
  hideModal() {
    setTimeout(() => {
      this.props.form.resetFields();
      this.setState({
        communitySelect: "",
        fileListArr: [],
        stepNum: 0,
        progressState: "",
        step1: "block",
        step2: "hide",
        textShow: 0,
        progressNum:0
      });
    }, 1000)

    //将父属性的visible设置为false
    this.props.callback();
  }
  //上传文件之前的钩子，参数为上传的文件，若返回 false 则停止上传。支持返回一个 Promise 对象，Promise 对象 reject 时则停止上传，resolve 时开始上传
  beforeUpload(file) {
    this.setState({
      error_url: '',
      success: '',
      totalsNum: '',
      fileListArr: [{
        uid: 1,
        name: file.name
      }],
      file: file
    });
    return new Promise((resolve) => {
      timer = setInterval(() => {
        if (submit) {
          if (this.state.fileListArr.length > 0) {
            resolve(file);
          } else {
            // message.error('请添加文件！', 3);
            return false;
          }
        }
      }, 50);
    });
  }
  //删除已上传文件
  fileRemove() {
    this.setState({
      fileListArr: [],
    });
    setTimeout(() => {
      window.clearTimeout(timer);
      submit = false;
    }, 50);
  }
  onProgress(step, file) {
    this.setState({
      // textShow: 1,
      progressNum: Math.round(75)
    })
  }
  handleExport() {
    this.props.export();
  }
  handleChange(value) {
    this.setState({
      pay_channel: value
    })
  }
  // 上传文件时
  uploadChange(info) {
    if (info.file.status == 'done') {
      if (info.file.response.code == 20000) {
        this.setState({
          fileListLen: info.fileList.length,
          fileListArr: info.fileList,
          stepNum: 2,
          fileUrl: info.file.response ? info.file.response.data.file_path : '',
          fileState: info.file.response ? info.file.response.code : '',
          fileLen: info.fileList.length,
          fileList: info.file.status,
        });
        message.success('文件已成功上传！');
      } else {
        message.error(info.file.response.error.errorMsg);
        return;
      }
    } else if (info.file.status == 'error') {
      message.error('很遗憾...这次上传失败了。');
    }
  }
  onSuccess(ret) {
    if (ret.code != 20000) {
      message.error(ret.error.errorMsg);
    }
    this.setState({
      textShow: 1,
      stepNum: 2,
      progressState: "success",
      error_url: ret.data ? ret.data.error_url : 0,
      success: ret.data ? ret.data.success : 0,
      totalsNum: ret.data ? ret.data.totals : 0,
      progressNum: Math.round(100)
    })
  }
  onError(err) {
    this.setState({
      textShow: 1,
      stepNum: 2,
      progressState: "error",
      progressNum: Math.round(100)
    })
    message.error('数据导入失败，请重新导入。', 3);
  }
  createData() {
    const { id, importType, period_id } = this.props;
    let dataList = {};
    if (id !== 'billmanageMore') {
      dataList.community_id = sessionStorage.getItem("communityId");
    } else {
      dataList.community_id = sessionStorage.getItem("communityId");
      dataList.pay_channel = this.state.pay_channel;
    }
    if (importType && importType === 'publicAccount') {
      dataList.period_id = period_id;
    }
    return dataList;
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const { visible, id } = this.props;
    const _cookie = sessionStorage.getItem("QXToken");
    const appSecret = 'HU6%12(w';
    //四位随机数(1000-9999)
    let rand = parseInt(Math.random() * 8999 + 1000, 10).toString();
    let timestamp = new Date().getTime().toString();
    // let dataString = (id != 'billmanageMore' ? { "community_id": sessionStorage.getItem("communityId") } : { "community_id": sessionStorage.getItem("communityId"), pay_channel: this.state.pay_channel })
    let md5String = JSON.stringify({
      "data": this.createData(), "rand": rand, "timestamp": timestamp, "token": _cookie
    });
    //验签算法pay_channel
    let sign = md5(md5(md5String).toString() + appSecret).toString();
    const uploadProps = {
      action: getUrl() + this.props.importUrl,
      accept: '.xls,.xlsx',
      name: 'file',
      disabled: false,
      fileList: this.state.fileListArr,
      beforeUpload: this.beforeUpload.bind(this),
      onRemove: this.fileRemove.bind(this),
      onProgress: this.onProgress.bind(this),
      onSuccess: this.onSuccess.bind(this),
      onError: this.onError.bind(this),
      onChange: this.uploadChange.bind(this),
      data: {
        "community_id": sessionStorage.getItem("communityId"),
        token: _cookie,
        data: JSON.stringify(this.createData())
      },
      headers: {
        // 'Content-Type': 'multipart/form-data',
        "Zj-Custom-Rand": rand,
        "Zj-Custom-Timestamp": timestamp,
        "Zj-Custom-Sign": sign
      }
    };
    return (
      <Modal title={id == 'dataRepair' ? '数据订正' : '批量导入'} visible={visible} maskClosable={true} onCancel={this.hideModal.bind(this, 4)} footer={this.state.textShow == 0 ?
        (<Button type="primary" loading={this.state.loading} onClick={this.handleImport.bind(this)}>开始导入</Button>)
        : <Button type="primary" onClick={this.hideModal.bind(this, 4)}>关闭</Button>} confirmLoading={this.state.confirmLoading}>
        <Steps size="small" current={this.state.stepNum}>
          <Step title="上传文档" />
          <Step title="导入数据" />
          <Step title="完成" />
        </Steps>
        <section className="section">
          <div className={this.state.step1}>
            {
              id == 'dataRepair' ? <div className="modal-layer">
                <p>1.请先导出{this.props.resident?'住户':'房屋'}数据。</p>
                <div className="padding">
                  <a onClick={this.handleExport.bind(this)}>导出数据 <Icon type="download" /></a>
                </div>
              </div> :
                <div className="modal-layer">
                  <p>1.请按照数据模板的格式准备要导入的数据</p>
                  <div className="padding" onClick={this.downloadFile.bind(this)}>
                    <a>下载数据模版 <Icon type="download" /></a>
                  </div>
                </div>
            }


            {
              id == 'dataRepair' ?
                <div className="modal-layer">
                  <p>2.请在导出的excel表格中填充对应异常数据。</p>
                  <p className="padding">请注意: </p>
                  <p className="padding">(1)数据订正仅用于修复异常数据,若新增{this.props.resident ? '住户' : '房屋'}请使用导入数据功能。</p>
                  <p className="padding">(2)原有{this.props.resident ? '住户' : '房屋'}信息必填字段(如幢、单元、室号等)不可修改，只可修改{this.props.resident ? '住户标签、住户照片、工作单位' : '楼段系数、楼道号、电梯编号'}等非必填字段。</p>
                  <p className="padding">(3)数据订正后以新导入的数据为准。</p>
                </div> : <div className="modal-layer">
                  <p>2.请注意：数据重复时不导入</p>
                </div>
            }
            {
              id == 'billmanageMore' ?
                <div className="modal-layer">
                  <p>2.请选择收款方式</p>
                  <Form>
                    <FormItem>
                      {getFieldDecorator('pay_channel', {
                        rules: [{
                          required: true,
                          message: '请选择收款方式'
                        }],
                      })(
                        <Select placeholder="请选择收款方式" style={{ width: '150px' }} onChange={this.handleChange.bind(this)}>
                          {this.props.list.map((value, index) => {
                            return <Option key={index} value={value.key}>{value.value}</Option>
                          })}
                        </Select>
                      )}
                    </FormItem>
                  </Form>
                </div> : null
            }
            <div className="modal-layer">
              <p>3.请选择需要导入的文件</p>
              <div className="padding">
                <Upload {...uploadProps}>
                  <Button type="ghost">
                    <Icon type="upload" /> 上传文件
                  </Button>
                </Upload>
              </div>
            </div>
          </div>
          <div className={this.state.step2}>
            <div className="modal-layer">
              <Progress percent={this.state.progressNum} status={this.state.progressState ? this.state.progressState : 'active'} />
              <div className="padding">{this.state.textShow == 0 ? '正在导入数据，请耐心等候...' : `导入完成！共${this.state.totalsNum ? this.state.totalsNum : 0}条，成功上传${this.state.success ? this.state.success : 0}条`}</div>
            </div>
            <div className="modal-layer">
              {
                this.state.textShow == 0 ?
                  (<div>
                    <p>提示：</p>
                    <div className="padding">1.导入数据期间请不要关闭此窗口</div>
                    <div className="padding">2.导入数据需要一段时间，如出现中断，请重新导入。</div>
                  </div>) : ''
              }

            </div>
            <div className="modal-layer">
              {
                this.state.error_url ? (
                  <div className="padding">
                    <p>下载错误报告，查看失败原因。</p>
                    <a href={this.state.error_url} download="">错误报告下载 <Icon type="download" /></a>
                  </div>
                ) : ''
              }

            </div>
          </div>

        </section>
      </Modal>
    )

  }

}
ExImport = Form.create()(ExImport);
export default ExImport;
