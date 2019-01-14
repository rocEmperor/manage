import React from 'react';
import { connect } from 'react-redux';
import { message, Upload, Icon, Form, Button } from 'antd';
import { getUrl } from '../../utils/util';

/**
 * 文件上传
 *
 * @param {array} file 详情预览图片url
 * @param {number} size 最大能上传多少张
 * @param {function} handleImage => urls
 * @param {string} acceptType 接受上传的文件类型
 * @param {function} downloadFile => name url 下载文件
 */

class UploadFile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isUpload: true,
      initialImg: []
    }
  }

  componentDidMount() {
    if (this.props.file && this.props.file.length > 0) {
      this.setState({
        initialImg: this.props.file,
        isUpload: this.props.file.length >= this.props.size ? false : true
      })
    }
  }
  UNSAFE_componentWillReceiveProps(nextProps) {
    let thisFileJson = JSON.stringify(this.props.file);
    let nextFileJson = JSON.stringify(nextProps.file);
    if (nextProps.file && nextProps.file.length > 0) {
      if (thisFileJson != nextFileJson) {
        this.setState({
          initialImg: nextProps.file,
          isUpload: nextProps.file.length >= nextProps.size ? false : true
        })
      }
    }
  }
  /**
   * 文件下载
   * @param {object} file 
   */
  handlePreview(file) {
    if (file.url) {
      this.props.downloadFile ? this.props.downloadFile(file) : undefined;
    }
  }
  /**
   * 图片上传
   * @param {*} e 
   */
  handleChange(e) {
    let id = this.props.id;
    if (e.file.status == 'error') {
      message.error('很遗憾...这次上传失败了。');
    } else {
      this.setState({
        initialImg: e.fileList,
        isUpload: e.fileList.length > (this.props.size - 1) ? false : true
      })
    }
    if (e.file.status == 'removed') {
      this.props.handleImage(id, e.fileList);
    }
    if (e.file.status == 'done') {
      if (e.file.response.code !== 20000) {
        message.error(e.file.response.error.errorMsg);
      } else {
        this.props.handleImage(id, e.fileList);
      }
    }
  }

  render() {
    const uploadButton = (
      <Button><Icon type="upload" /> 上传文件</Button>
    );
    return (<div>
      <Upload
        name="file"
        action={getUrl() + '/qiniu/upload/file'}
        fileList={this.state.initialImg}
        accept={this.props.acceptType}
        onPreview={this.handlePreview.bind(this)}
        onChange={this.handleChange.bind(this)}
      >
        {this.state.isUpload ? uploadButton : null}
      </Upload>
    </div>)
  }
}
UploadFile = Form.create()(UploadFile);
export default connect((state) => {
  return {
    image: state.image
  }
})(UploadFile);