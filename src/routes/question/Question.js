import React from 'react';
import { connect } from 'dva';
import { Form, Breadcrumb, Card } from 'antd';

function Question(props) {
  const { data } = props;
  return (<div>
    <Breadcrumb separator=">">
      <Breadcrumb.Item>常见问题</Breadcrumb.Item>
    </Breadcrumb>
    <Card style={{ marginBottom: '20px' }}>
      <h1 style={{ marginBottom: '20px' }}> 常见问题（FAQ） </h1>
      {data.length
        ? data.map((value, index) =>
          <div key={index}>
            <h4 style={{ marginBottom: '10px', marginTop: '20px' }}
            >问: {value.question}</h4>
            <p>答: {value.answer}</p>
            <div style={{ borderBottom: '1px solid #e9e9e9', marginTop: '10px' }} />
          </div>)
        : null
      }
    </Card>
  </div>)
}
function mapStateToProps(state) {
  return {
    ...state.Question
  };
}
export default connect(mapStateToProps)(Form.create()(Question));
