'use strick';
import React from 'react';
const UE = window.UE;
class Ueditor extends React.Component {
  // 设置默认的属性值
  constructor(props) {
    super(props);
    this.state = {
      id:''
    };
  }
  // 调用初始化方法
  componentDidMount() {
    UE.delEditor(this.props.id);
    const editor = UE.getEditor(this.props.id);
    this.setState({id:this.props.id})
    editor.ready(() => {
      editor.execCommand('serverparam', () => {
        return {
          token: 'value',
        };
      });
      const content = this.props.content ? this.props.content : '<p></p>';
      editor.setContent(content);
    });
    editor.addListener('contentChange', () => {
      // editor.execCommand('removeFormat');
      this.props.getValues(editor.getContent(), this.props.id );
    });
  }

  // 获取编辑器的内容
  getContent() {
    if (this.editor) {
      return this.editor.getContent();
    }
    return '';
  }
  /**
   * 写入内容｜追加内容
   * @param {Boolean} isAppendTo    [是否是追加]
   * @param {String}  appendContent [内容]
   */
  setContent(appendContent, isAppendTo) {
    if (this.editor) {
      this.editor.setContent(appendContent, isAppendTo);
    }
  }
  // 获取纯文本
  getContentTxt() {
    if (this.editor) {
      return this.editor.getContentTxt();
    }
    return '';
  }
  // 获得带格式的纯文本
  getPlainTxt() {
    if (this.editor) {
      return this.editor.getPlainTxt();
    }
    return '';
  }
  // 判断是否有内容
  hasContent() {
    if (this.editor) {
      return this.editor.hasContents();
    }
    return false;
  }
  render() {
    return (
      <div>
        <script id={this.props.id} name="content" type="text/plain" />
      </div>
    );
  }
}
module.exports = Ueditor;
