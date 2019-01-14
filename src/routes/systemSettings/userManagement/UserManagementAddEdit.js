import React from 'react';
import { connect } from 'dva';
import { Form, Breadcrumb, Card, Input, Select, Button, Row, Col, Tree, notification,Radio,TreeSelect } from 'antd';
const TreeNode = Tree.TreeNode;
const RadioGroup = Radio.Group;
import Menus from '../../../components/Menus/index';
import { checkPhone } from '../../../utils/util';
let hasSubmit = false;

function UserManagementAddEdit(props) {
  const { dispatch, form, id, detail, groupList, userMenus, groupMenuList, userCommunities, checkedKeys,unfoldList } = props;
  const { getFieldDecorator } = form;
  // 数组去重
  let hash = {};
  let userCommunitiess = userCommunities.reduce(function (item, next) {
    hash[next.name] ? '' : hash[next.name] = true && item.push(next);
    return item
  }, []);
  // 布局
  const formItemLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 14 },
    style: { maxWidth: '600px' }
  };
  function checkAddMenus(id, data) {
    dispatch({
      type: 'UserManagementAddEdit/concat',
      payload: { menuChecked: data }
    });
  }
  /**
   * 取消
   */
  function handleBack() {
    history.go(-1);
  }
  /**
   * 选择小区权限
   * @param  {Array} checkedKeys
   */
  function onChecks(checkedKeys, info) {
    let arr = [];
    checkedKeys.map((checkedKeys, index) => {
      if (checkedKeys != 'all') {
        arr.push(checkedKeys)
      }
    });
    dispatch({
      type: 'UserManagementAddEdit/concat',
      payload: { checkedKeys: arr }
    });
  }
  /**
   * 调取菜单权限
   * @param  {String} value
   */
  function changeGroup(value) {
    dispatch({
      type: 'UserManagementAddEdit/getShowManage',
      payload: {
        group_id: value||detail.group_id
      }
    });
  }
  /**
   * 新增/编辑 表单提交
   */
  function handleSave() {
    if (hasSubmit) {
      return false;
    }
    form.validateFields((errors, values) => {
      if (errors) {
        window.scrollTo(0, 0);
        return;
      }
      if (Array.isArray(checkedKeys) && checkedKeys.length === 0) {
        notification['warn']({
          key: 'communities',
          message: '提示',
          description: '请至少选择一个小区权限',
          duration: 4,
        })
      } else {
        //simple
        Array.prototype.clone = function () {
          return this.slice(0)
        }
        const newMenus = groupMenuList!=undefined?groupMenuList.clone():''
        const newCommunities = checkedKeys.clone()
        if (newMenus.indexOf("all") > 0) {
          newMenus.splice(newMenus.indexOf("all"), 1)
        }
        if (newCommunities.indexOf("all") > 0) {
          newCommunities.splice(newCommunities.indexOf("all"), 1)
        }
        if (!hasSubmit) {
          hasSubmit = true;
          if (!id) {
            dispatch({
              type: 'UserManagementAddEdit/getManageAddManage',
              payload: {
                group_id: values.group_id,
                communitys: newCommunities,
                mobile: values.mobile,
                name: values.name,
                sex: values.sex,
                is_enable:values.status
              },
              callback: () => {
                hasSubmit = false;
                window.location.href = "#/userManagement";
                window.scrollTo(0, 0);
              },
              err: () => {
                hasSubmit = false;
              }
            });
          } else {
            dispatch({
              type: 'UserManagementAddEdit/getManageEditManage',
              payload: {
                user_id: id,
                group_id: values.group_id,
                communitys: newCommunities,
                mobile: values.mobile,
                name: values.name,
                sex: values.sex,
                is_enable:values.status
              },
              callback: () => {
                hasSubmit = false;
                window.location.href = "#/userManagement";
                window.scrollTo(0, 0);
              },
              err: () => {
                hasSubmit = false;
              }
            });
          }
        }
      }
    });
  }
  return (<div>
    <Breadcrumb separator=">">
      <Breadcrumb.Item>系统设置</Breadcrumb.Item>
      <Breadcrumb.Item><a href="#/userManagement">员工管理</a></Breadcrumb.Item>
      <Breadcrumb.Item>{id ? '编辑' : '新增'}</Breadcrumb.Item>
    </Breadcrumb>
    <Form>
      <Card>
        <Form.Item label="姓名" {...formItemLayout}>
          {getFieldDecorator('name', {
            initialValue: detail.name,
            rules: [{ required: true, message: '请输入员工名！' }, { pattern: /^[0-9a-zA-Z\u4e00-\u9fa5]+$/, message: '请输入正确的员工名！' }],
          })(
            <Input type="text" placeholder="请输入姓名" />
          )}
        </Form.Item>
        <Form.Item label="性别" {...formItemLayout}>
          {getFieldDecorator('sex', {
            initialValue: detail&&detail.sex?detail.sex:"1",
            rules: [{ required: true, message: '请选择性别' }],
          })(
            <Select placeholder="请选择性别">
              <Select.Option value="1">男</Select.Option>
              <Select.Option value="2">女</Select.Option>
            </Select>
          )}
        </Form.Item>
        <Form.Item label="手机号码" {...formItemLayout}>
          {getFieldDecorator('mobile', {
            initialValue: detail.mobile,
            rules: [{ required: true, message: '请输入手机号码' }, { validator: checkPhone.bind(this), message: '请输入手机号码！' }],
          })(
            <Input type="text" placeholder="请输入手机号码" />
          )}
        </Form.Item>
        <Form.Item label="部门" {...formItemLayout}>
          {getFieldDecorator('group_id', {
            initialValue: detail.group_id,
            rules: [{ required: true, message: '请选择部门' }],
            onChange: changeGroup.bind(this),
          })(
            <TreeSelect treeDefaultExpandedKeys={unfoldList} placeholder="请选择部门" treeData={groupList}/>
          )}
        </Form.Item>
        <Form.Item label="账号状态" {...formItemLayout}>
          {getFieldDecorator('status', {
            initialValue: detail&&detail.is_enable?Number(detail.is_enable):1,
            rules: [{ required: true, message: '请选择账号状态' }],
          })(
            <RadioGroup><Radio value={1}>启用</Radio><Radio value={2}>禁用</Radio></RadioGroup>
          )}
        </Form.Item>
      </Card>
      <Row gutter={16} style={{ marginTop: "30px" }}>
        <Col span={12}>
          <Card title="菜单权限">
            <Menus allMenus={userMenus} disabled id={'menu'} infoMenu={groupMenuList} callback={checkAddMenus.bind(this)} />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="小区权限">
            <Tree
              checkable
              defaultExpandAll={true}
              defaultExpandedKeys={['all']}
              checkedKeys={checkedKeys}
              onCheck={onChecks}
            >
              <TreeNode title="全选" key="all">
                {userCommunitiess ? userCommunitiess.map((value, index) => {
                  return <TreeNode title={value.name} key={value.id}></TreeNode>
                }
                ) : null}
              </TreeNode>
            </Tree>
          </Card>
        </Col>
      </Row>
      <div style={{ marginTop: "40px" }}>
        <Button type="primary" onClick={handleSave}>保存</Button>
        <Button className="ml1" onClick={handleBack}>取消</Button>
      </div>
    </Form>
  </div >)
}
function mapStateToProps(state) {
  return {
    ...state.UserManagementAddEdit,
    loading: state.loading.models.UserManagementAddEdit
  };
}
export default connect(mapStateToProps)(Form.create()(UserManagementAddEdit));
