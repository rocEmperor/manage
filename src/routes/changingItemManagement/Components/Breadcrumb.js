import React from 'react'
import { Breadcrumb } from 'antd'

function NewBreadcrumb () {
  return (
    <Breadcrumb separator=">">
      <Breadcrumb.Item>计费管理</Breadcrumb.Item>
      <Breadcrumb.Item>计费公式管理</Breadcrumb.Item>
    </Breadcrumb>
  )
}

export default NewBreadcrumb
