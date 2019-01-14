'use strict';
import React from 'react';
import { Form, Checkbox, Row  } from 'antd';

class Menus extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      checkedAll: false,
      indeterminate: false,
      menuChecked: {},
    };
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if((this.props.allMenus != nextProps.allMenus) || (this.props.infoMenu != nextProps.infoMenu)) {
      let menuChecked = this.getCheckedObj(nextProps.allMenus);
      let infoMenuChecked = this.getCheckedObj(nextProps.infoMenu);

      Object.keys(infoMenuChecked).map(key=>{
        
        menuChecked[key] = true;
      });

      let menuSize = Object.keys(menuChecked).length;
      let infoMenuSize = Object.keys(infoMenuChecked).length;
      if (menuSize == infoMenuSize) {
        this.setState({
          checkedAll: true,
        });
      }
      if(infoMenuSize > 0) {
        this.setState({
          indeterminate: true,
        });
      }

      this.setState({
        menuChecked: menuChecked,
      });
      this.props.callback(this.props.id, menuChecked);
    }

  }

  //二维数组转化为一维对象
  getCheckedObj (arr) {
    let obj = {};
    if(arr === undefined) {
      return {};
    }
    arr.map(vvv=>{
      obj[vvv.key] = false;
      if (Array.isArray(vvv.children)) {
        vvv.children.map(vv=>{
          obj[vv.key] = false;
          if (Array.isArray(vv.children)) {
            vv.children.map(v => {
              obj[v.key] = false;
            });
          }
        });
      }
    });
    return obj;
  }

  all(e) {
    let menuChecked = this.getCheckedObj(this.props.allMenus);
    Object.keys(menuChecked).map(key=>{
      menuChecked[key] = e.target.checked ? true : false;
    });
    this.setState({
      menuChecked: menuChecked,
      checkedAll: e.target.checked ? true : false,
      indeterminate: false,
    });
    this.props.callback(this.props.id, menuChecked);
  }

  handleChange(n ,e) {
    let menus = this.props.allMenus;
    let menuChecked = this.state.menuChecked;
    if (n.lastIndexOf('-') > -1) {
      //二级选中/三级选中
      let arr=n.split('-');
      let a=arr[0],b=arr[1];
      
      menuChecked[n] = e.target.checked ? true : false;
      let oneChecked = false;
      let twoChecked = false;
      if (arr[2] == undefined){
        //二级选中
        twoChecked = e.target.checked ? true : false;
        menus.map(vvv => {
          if (vvv.value == a) {
            if (Array.isArray(vvv.children)) {
              vvv.children.map(vv => {
                if (vv.value == b) {
                  if (Array.isArray(vv.children)) {
                    vv.children.map(v => {
                      menuChecked[v.key] = e.target.checked ? true : false;  //操作按钮根据二级菜单的选中或取消
                    })
                  }
                }
              })
            }
          }
        });
      }else{
        //操作按钮选中
        menus.map(vvv => {
          if (vvv.value == a) {
            if (Array.isArray(vvv.children)) {
              vvv.children.map(vv => {
                if (vv.value == b) {
                  if (Array.isArray(vv.children)) {
                    vv.children.map(v => {
                      if (menuChecked[v.key] == true) {
                        twoChecked = true;
                      }
                    })
                  }
                }
              })
            }
          }
        });
      }

      menus.map(vvv => {
        if (vvv.value == a) {
          if (Array.isArray(vvv.children)) {
            vvv.children.map(vv => {
              if(Array.isArray(vv.children)){
                vv.children.map(v => {
                  if (menuChecked[v.key] == true) {
                    oneChecked = true;
                  }
                })
              }
            })
          }
        }
      })
      menuChecked[a] = oneChecked ? true : false;//二级选中时一级也同时选中
      menuChecked[a+'-'+b] = twoChecked ? true : false;//三级选中时二级也同时选中


    } else {
      //点击一级菜单
      menuChecked[n] = e.target.checked ? true : false;

      menus.map(vvv=>{
        if(vvv.key == n) {
          if (Array.isArray(vvv.children)) {
            vvv.children.map(vv=>{
              menuChecked[vv.key] = e.target.checked ? true : false; //二级菜单跟着一级菜单选中或者取消
              if (Array.isArray(vv.children)) {
                vv.children.map(v => {
                  menuChecked[v.key] = e.target.checked ? true : false; //操作按钮跟着一级菜单选中或者取消
                })
              }
            })
          }
        }
      });
    }
    //检查全选按钮情况
    let allLength = Object.keys(menuChecked).length;//所有checkbox数量
    
    
    let trueLength = Object.values(menuChecked).filter(x => x).length;//所有值为true的数量
    this.setState({
      checkedAll: trueLength == allLength ? true : false,
      indeterminate: trueLength != 0 ? true : false,
      menuChecked: menuChecked,
    });
    this.props.callback(this.props.id, menuChecked);
  }

  render() {
    const {allMenus,deviceType} = this.props;
    const { getFieldDecorator } = this.props.form;
    return (
      <div>

        <Checkbox
          disabled = {deviceType==1?true:(this.props.disabled ? true : false)}
          indeterminate={this.state.indeterminate} checked={deviceType==1?false:this.state.checkedAll} onChange={this.all.bind(this)}>全选</Checkbox>
        {allMenus.map((item,index)=>{
          return (
            <div key={index}>
              <Row className="mt1" key={`row-${index}`}>
                {getFieldDecorator(`menu-${item.key}`,{})(
                  <Checkbox
                    disabled = {deviceType==1?true:(this.props.disabled ? true : false)}
                    checked={deviceType==1?false:this.state.menuChecked[item.key]}
                    key={item.key}
                    onChange={this.handleChange.bind(this, `${item.key}`)}>
                    {item.label}</Checkbox>
                )}
              </Row>
              {
                Array.isArray(item.children) ? item.children.map((items,indexs)=>{
                  return (
                    <div key={`row-${item.key}-${indexs}`}>
                      <Row style={{marginLeft:30}} className="mt1" key={`rows-${index}`}>
                        {getFieldDecorator(`menuItem-${items.key}`,{})(
                          <Checkbox
                            disabled = {deviceType==1?true:(this.props.disabled ? true : false)}
                            checked={deviceType==1?false:this.state.menuChecked[items.key]}
                            key={items.key}
                            onChange={this.handleChange.bind(this, `${items.key}`)}>
                            {items.label}</Checkbox>
                        )}
                      </Row>
                      <Row style={{marginLeft:60}} key={`rows-${index}-${indexs}`}>
                        {Array.isArray(items.children) ? items.children.map((itm,idx)=>{
                          return getFieldDecorator(`btn-${itm.key}`,{})(
                            <Checkbox
                              disabled = {this.props.disabled ? true : false}
                              checked={this.state.menuChecked[itm.key]}
                              key={itm.key} onChange={this.handleChange.bind(this, `${itm.key}`)}>
                              {itm.label}</Checkbox>
                          )
                        }) : "" }
                      </Row>
                    </div>
                  )
                }) : ""
              }
              {/* <Row style={{marginLeft:40}} key={`rows-${index}`}>
                {Array.isArray(item.children) ? item.children.map((items,indexs)=>{
                  return getFieldDecorator(`btn-${item.id}-${items.id}`,{})(
                    <Checkbox
                      disabled = {this.props.disabled ? true : false}
                      checked={this.state.menuChecked[items.id]}
                      key={items.id} onChange={this.handleChange.bind(this, `${item.id}-${items.id}`)}>
                      {items.name}</Checkbox>
                  )
                }) : "" }
              </Row> */}
            </div>
          )
        })}
      </div>
    );
  }
}
Menus = Form.create()(Menus);
export default Menus;
