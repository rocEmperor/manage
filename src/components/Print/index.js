'use strict';
import React from 'react';
import { Modal, Table } from 'antd';
import './index.less';

class Print extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      
    }    
    
  }
  // 验证模板有效性
  // validateFn() {
  //   let result = false;
  //   const { dataSource } = this.props;
  //   for (let key in dataSource) {
  //     if (key === 'top' && !dataSource[key]) {
  //       result = true;
  //     }
  //     if (key === 'down' && !dataSource[key]) {
  //       result = true;
  //     }
  //     if (key === 'list' && !dataSource[key]) {
  //       result = true;
  //     }
  //     if (key === 'table' && !dataSource[key]) {
  //       result = true;
  //     }
  //   }
  //   return result
  // }
  
  handleOk() {
    // if (this.validateFn()) {
    //   message.error('请完善模版');
    //   return false;
    // }
    const { dataSource } = this.props;
    this.props.number && this.props.number();
    let height = 0;
    for (let i = 0; i < dataSource.length; i++) {
      if ((height + document.getElementsByClassName("print_module" + i)[0].offsetHeight) > 1040) {
        const len = Math.ceil((1040 - height) / 18);
        let elementBr = document.createElement('div')
        elementBr.id = "idBr"
        let strbr = '';
        for (let j = 0; j < len; j++) {
          strbr += '<div></br></div>';
        }
        elementBr.innerHTML = strbr;
        document.getElementsByClassName("print_module" + (i - 1))[0].appendChild(elementBr);
        height = document.getElementsByClassName("print_module" + i)[0].offsetHeight;
      } else {
        height += document.getElementsByClassName("print_module" + i)[0].offsetHeight;
      }
    }
    let printData = document.getElementById("div_print").innerHTML;     // 获得 div 里的所有 html 数据
    let element = document.createElement("div");
    element.className = "message";
    element.id = "print"
    element.innerHTML = printData
    // element.appendChild(printData);
    document.body.appendChild(element);
    document.getElementById('root').style.display = "none";
    let el = document.getElementsByClassName('ink-models')[0].parentNode.childNodes;
    el[0].style.display = "none";
    el[1].style.display = "none";
    document.getElementsByTagName('body')[0].style.overflow = "visible";
    document.getElementsByTagName('body')[0].style.height = document.getElementById("print").offsetHeight + "px"
    window.print();
    element.innerHTML = "";
    document.getElementById('print').id = "";
    document.getElementById('root').style.display = "block";
    el[0].style.display = "";
    el[1].style.display = "";
    document.getElementsByTagName('body')[0].style.overflow = "hidden";
    document.getElementsByTagName('body')[0].style.height = "";
    this.props.hide();
    const m = document.getElementById("idBr");
    if(m){
      m.parentNode.removeChild(m);
    }
    return false;
  }
  handleCancel() {
    this.props.hide()
  }
  // 催款单按单元打印
  promptPrintByUnit() {
    const { dataSource } = this.props;
    const columns = [];
    dataSource ? dataSource.map((item, index) => {
      if (index == 0) {
        item.table ? item.table.map((items, indexs) => {
          const obj = {
            title: items.name,
            dataIndex: items.field_name,
            key: items.field_name,
          }
          columns.push(obj);
        }) : null
      }
    }) : null

    let minheader = false;
    dataSource? dataSource.map((item, index) => {
      item.top ? item.top.map((items, indexs)=>{
        if (items.field_name == 'img') {
          minheader = true
        }
      }):null
    }) : null

    
    return (
      <div id="div_prints">
        {dataSource.map((item, index) => {
          return <div key={index} className={"print_module" + index}>
            <div className="topImg">
              {
                item && item.top?
                  item.top.map((item,index)=>{
                    return item.field_name=='img' && item.value != '' ? <img src={item.value} />:null
                  })
                  :null
              }
            </div>
            <div className={minheader == true ? "printTitles" :"printTitle"} style={{ fontSize: 18 }} >
              {
                item && item.top ?
                  item.top.map((item, index) => {
                    return item.field_name == 'title' ? item.value : null
                  })
                  : null
              }
            </div>
            <div className="number">
              {
                item && item.top ?
                  item.top.map((item, index) => {
                    return item.field_name == 'number' ? "编号："+item.value : null
                  })
                  : null
              }
            </div>
            <div className="topArea">
              {
                item && item.top ?
                  item.top.map((item, index) => {
                    return item.field_name != 'number' && item.field_name != 'title' && item.field_name != 'img' ? <p key={index} className={item.width == 1 ? 'percent30' : item.width == 3 ? 'percent100' : (item.width == 2 ? 'percent50' : '')}>{item.name + ':' + item.value}</p> : null
                  })
                  : null
              }
            </div>
            <Table dataSource={item.list} columns={columns} pagination={false} className="mb1" rowKey="id"/>
            <div className="topArea">
              {
                item && item.down ?
                  item.down.map((item, index) => {
                    return item.field_name != 'note'? <p key={index} className={item.width == 1 ? 'percent30' : item.width == 3 ? 'percent100' : (item.width == 2 ? 'percent50' : '')}>{item.name + ':' + item.value}</p> : null
                  })
                  : null
              }
            </div>
            <div className="topArea">
              {
                item && item.down ?
                  item.down.map((item, index) => {
                    return item.field_name == 'note' ? <p key={index} className="percent100">{item.name + ':' + item.value}</p> : null
                  })
                  : null
              }
            </div>
          </div>
        })}
      </div>
    )
  }

  render() {
    const { visible } = this.props;
    return (
      <Modal
        wrapClassName="ink-models"
        title="打印预览"
        visible={visible}
        onOk={this.handleOk.bind(this)}
        onCancel={this.handleCancel.bind(this)}
        okText="打印"
      >
        <div id="div_print" style={{ margin: 0, fontFamily:'Microsoft Yahei'}} className="print_box_class">
          {this.promptPrintByUnit()}
        </div>
      </Modal>
    );
  }
}
export default Print;
