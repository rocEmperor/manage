'use strict';
import React from 'react';
// import { connect } from 'react-redux';
import { Form, Checkbox, Row } from 'antd';

class Menus extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      checkedAll: false,
      indeterminate: false,
      menuChecked: {},
    };
  }

  UNSAFE_componentWillReceiveProps (nextProps) {
    if ((this.props.allMenus != nextProps.allMenus) || (this.props.infoMenu != nextProps.infoMenu)) {
      let menuChecked = this.getCheckedObj(nextProps.allMenus);
      let infoMenuChecked = this.getCheckedObj(nextProps.infoMenu);
      Object.keys(infoMenuChecked).map(key => {
        menuChecked[key] = true;
      });
      let menuSize = Object.keys(menuChecked).length;
      let infoMenuSize = Object.keys(infoMenuChecked).length;
      if (menuSize > 0 && menuSize == infoMenuSize) {
        this.setState({
          checkedAll: true,
        });
      }else{
        this.setState({
          checkedAll: false,
        });
      }
      if (infoMenuSize > 0 && menuSize != infoMenuSize) {
        this.setState({
          indeterminate: true,
        });
      }else{
        this.setState({
          indeterminate: false,
        });
      }

      this.setState({
        menuChecked: menuChecked,
      });
    }
  }

  //二维数组转化为一维对象
  getCheckedObj(arr) {
    let obj = {};
    if (arr === undefined) {
      return {};
    }
    arr.map(vv => {
      obj[vv.id] = false;
      if (Array.isArray(vv.children)) {
        vv.children.map(v => {
          obj[v.id] = false;
        });
      }
    });
    return obj;
  }

  all(e) {
    let menuChecked = this.state.menuChecked;
    Object.keys(menuChecked).map(key => {
      menuChecked[key] = e.target.checked ? true : false;
    });
    this.setState({
      menuChecked: menuChecked,
      checkedAll: e.target.checked ? true : false,
      indeterminate: false,
    });
    this.props.callback(this.props.id, menuChecked);
  }

  handleChange(n, e) {
    let menus = this.props.allMenus;
    let menuChecked = this.state.menuChecked;
    if (n.indexOf('-') > -1) {
      //二级选中
      let arr = n.split('-');
      let a = arr[0], b = arr[1];
      menuChecked[b] = e.target.checked ? true : false;

      //检查一级的全选情况
      let oneChecked = false;
      menus.map(vv => {
        if (vv.id == a) {
          if (Array.isArray(vv.children)) {
            vv.children.map(v => {
              if (menuChecked[v.id] == true) {
                oneChecked = true;
              }
            })
          }
        }
      })
      menuChecked[a] = oneChecked ? true : false;
    } else {
      menuChecked[n] = e.target.checked ? true : false;
      menus.map(vv => {
        if (vv.id == n) {
          if (Array.isArray(vv.children)) {
            vv.children.map(v => {
              menuChecked[v.id] = e.target.checked ? true : false;
            })
          }
        }
      });
    }
    this.setState({
      menuChecked: menuChecked,
    });
    if (this.hasSelectAll(menuChecked)) {
      this.setState({
        indeterminate: false,
        checkedAll: true
      });
    } else {
      if (this.hasSelectNull(menuChecked)) {
        this.setState({
          indeterminate: false,
          checkedAll: false
        });
      } else {
        this.setState({
          indeterminate: true,
          checkedAll: false
        });
      }
    }
    this.props.callback(this.props.id, menuChecked);
  }
  hasSelectAll (menuChecked) {
    let result = true;
    let value = Object.values(menuChecked);
    if (value.indexOf(false) !== -1) {
      result = false;
    }
    return result;
  }
  hasSelectNull (menuChecked) {
    let result = true;
    let value = Object.values(menuChecked);
    if (value.indexOf(true) !== -1) {
      result = false;
    }
    return result;
  }
  render() {
    const { allMenus } = this.props;
    const { getFieldDecorator } = this.props.form;
    return (
      <div>
        {allMenus
          ? <Checkbox
            indeterminate={this.state.indeterminate}
            disabled={this.props.disabled ? true : false}
            checked={this.state.checkedAll}
            onChange={this.all.bind(this)}
          >
            全选
          </Checkbox>
          : null}
        {allMenus ? allMenus.map((item, index) => {
          return (
            <div key={index}>
              <Row className="mt1" key={`row-${item.id}`}>
                {getFieldDecorator(`menu-${index}`, {})(
                  <Checkbox
                    disabled={this.props.disabled ? true : false}
                    checked={this.state.menuChecked[item.id]}
                    key={item.id}
                    onChange={this.handleChange.bind(this, `${item.id}`)}>
                    {item.name}</Checkbox>
                )}
              </Row>
              <Row style={{ marginLeft: 40 }} key={`rows-${index}`}>
                {Array.isArray(item.children) ? item.children.map((items, indexs) => {
                  return getFieldDecorator(`btn-${item.id}-${items.id}`, {})(
                    <Checkbox
                      checked={this.state.menuChecked[items.id]}
                      disabled={this.props.disabled ? true : false}
                      key={items.id} onChange={this.handleChange.bind(this, `${item.id}-${items.id}`)}>
                      {items.name}</Checkbox>
                  )
                }) : ''}
              </Row>
            </div>
          )
        }) : null}
      </div>
    );
  }
}
Menus = Form.create()(Menus);
export default Menus;
