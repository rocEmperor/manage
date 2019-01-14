import React from 'react';
import { Form, Button, Row, Col, Icon, Select } from 'antd';
const Option = Select.Option;
// 小时
const hours = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'];
// 天
const days = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31'];
// 月
const month = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
// 周
const week = ['1', '2', '3', '4', '5', '6', '7'];

class Time extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      addVisible: props.addVisible,
      key_0: 1,
      key_1: 1,
      key_2: 1,
      key_3: 1,
    }

  }

  componentDidMount() {
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.props.addVisible != nextProps.addVisible) {
      this.setState({
        addVisible: nextProps.addVisible
      })
    }
  }

  /**
   * 添加开始结束时间
   * @param execType 巡检周期类型
   * @param arrData 巡检周期为 按天
   * @param arrWeekData 巡检周期为 按周
   * @param arrMonthData 巡检周期为 按月
   * @param arrYearData 巡检周期为 按年
   * @ addVisible 是否可添加开始结束时间
   * @function execTypeDay() 校验巡检周期 按天 时时间的重复性
   * @function execTypeWeekMonth() 校验巡检周期 按周按月 时时间重复性
   * @function execTypeYear() 校验巡检周期 按年 时时间重复性
   */
  addTime() {
    let { execType, arrData, arrWeekData, arrMonthData, arrYearData } = this.props;

    if (execType == 1) {
      let startTime = `startTime-${arrData.length - 1}-${arrData.length}`;
      let endTime = `endTime-${arrData.length - 1}-${arrData.length}`;

      this.props.form.validateFields([startTime, endTime], (err, values) => {
        if (err) {
          return;
        }

        let res = this.props.execTypeDay(arrData);
        if (res) {
          return false;
        }
        let arr = arrData;
        if (arr.length >= 11) {
          // this.setState({
          //   addVisible: false
          // })
          this.props.isAdd();
        }
        arr.push({
          startTime: "",
          endTime: "",
          key: this.state.key_0 + 1
        })
        this.setState({
          arrData: arr.slice(),
          key_0: this.state.key_0 + 1
        })
      })

    } else if (execType == 2) {
      this.props.form.validateFields([`start-${arrWeekData.length - 1}-${arrWeekData.length}`, `end-${arrWeekData.length - 1}-${arrWeekData.length}`, `startTime-${arrWeekData.length - 1}-${arrWeekData.length}`, `endTime-${arrWeekData.length - 1}-${arrWeekData.length}`], (err, values) => {
        if (err) {
          return;
        }
        let res = this.props.execTypeWeekMonth(arrWeekData);
        if (res) {
          return false;
        }
        let arr1 = arrWeekData;
        if (arr1.length >= 11) {
          this.props.isAdd();
        }
        arr1.push({
          start: "",
          startTime: "",
          end: "",
          endTime: "",
          key: this.state.key_1 + 1
        })
        this.setState({
          arrWeekData: arr1.slice(),
          key_1: this.state.key_1 + 1
        })
      })
    } else if (execType == 3) {
      this.props.form.validateFields([`start-${arrMonthData.length - 1}-${arrMonthData.length}`, `end-${arrMonthData.length - 1}-${arrMonthData.length}`, `startTime-${arrMonthData.length - 1}-${arrMonthData.length}`, `endTime-${arrMonthData.length - 1}-${arrMonthData.length}`], (err, values) => {
        if (err) {
          return;
        }
        let res = this.props.execTypeWeekMonth(arrMonthData);
        if (res) {
          return false;
        }
        let arr2 = arrMonthData;
        if (arr2.length >= 11) {
          this.props.isAdd();
        }
        arr2.push({
          start: "",
          startTime: "",
          end: "",
          endTime: "",
          key: this.state.key_2 + 1
        })
        this.setState({
          arrMonthData: arr2.slice(),
          key_2: this.state.key_2 + 1
        })
      })
    } else {
      this.props.form.validateFields([`startMonth-${arrYearData.length - 1}-${arrYearData.length}`, `endMonth-${arrYearData.length - 1}-${arrYearData.length}`, `startDay-${arrYearData.length - 1}-${arrYearData.length}`, `endDay-${arrYearData.length - 1}-${arrYearData.length}`, `startTime-${arrYearData.length - 1}-${arrYearData.length}`, `endTime-${arrYearData.length - 1}-${arrYearData.length}`], (err, values) => {
        if (err) {
          return;
        }
        let res = this.props.execTypeYear(arrYearData);
        if (res) {
          return false;
        }
        let arr3 = arrYearData;
        if (arr3.length >= 11) {
          this.props.isAdd();
        }
        arr3.push({
          startMonth: "",
          startDay: "",
          startTime: "",
          endMonth: "",
          endDay: "",
          endTime: "",
          key: this.state.key_3 + 1
        })
        this.setState({
          arrYearData: arr3.slice(),
          key_3: this.state.key_3 + 1
        })
      })
    }

  }

  /**
   * delete common
   * @param {*} type 巡检周期为按天、按周、按月、按年,即arrData、arrWeekData、arrMonthData、arrYearData的副本
   * @param {*} key 标志巡检周期按天/按周/按月/按年的key_0、key_1、key_2、key_3
   * @param {*} data 巡检周期为按天、按周、按月、按年,即arrData、arrWeekData、arrMonthData、arrYearData
   * @param {*} index removeTime参数index
   */
  removeCommon(type, key, data, index) {
    type.del(index);
    this.setState({
      data: type.slice(),
      key: key + 1
    })
  }

  /**
   * delete time
   * @param {*} index arrData/arrWeekData/arrMonth/arrYearData遍历中index
   * @function removeCommon() delete common
   * @param execType 巡检周期类型
   * @param addVisible 是否可添加开始结束时间
   */
  removeTime(index) {
    let { execType } = this.props;
    let { arrData, arrWeekData, arrMonthData, arrYearData } = this.props;
    const arr = arrData;
    const arr1 = arrWeekData;
    const arr2 = arrMonthData;
    const arr3 = arrYearData;
    if (arr.length <= 11 || arr1.length <= 11 || arr2.length <= 11 || arr3.length <= 11) {
      this.setState({
        addVisible: true,
      })
    }
    Array.prototype.del = function (index) {
      if (isNaN(index) || index >= this.length) {
        return false;
      }
      for (let i = 0, n = 0; i < this.length; i++) {
        if (this[i] != this[index]) {
          this[n++] = this[i];
        }
      }
      this.length -= 1;
    };
    if (execType == 1) {
      this.removeCommon(arr, this.state.key_0, arrData, index);
    } else if (execType == 2) {
      this.removeCommon(arr1, this.state.key_1, arrWeekData, index);
    } else if (execType == 3) {
      this.removeCommon(arr2, this.state.key_2, arrMonthData, index);
    } else {
      this.removeCommon(arr3, this.state.key_3, arrYearData, index);
    }
  }

  /**
   * change common
   * @param {*} type 巡检周期为按天、按周、按月、按年,即arrData、arrWeekData、arrMonthData、arrYearData的副本
   * @param {*} index change参数index
   * @param {*} value change参数value
   * @param {*} e 获取表单输入的值
   * @param {*} data 巡检周期为按天、按周、按月、按年,即arrData、arrWeekData、arrMonthData、arrYearData
   * @param {*} exec_type 巡检周期类型
   */
  changeCommon(type, index, value, e, data, exec_type) {
    type[index][`${value}`] = e;
    this.setState({
      data: type.slice(),
    })
  }
  /**
   * change
   * @param {*} type 巡检周期类型
   * type = 1 按天 
   * type = 2 按周
   * type = 3 按月
   * type = 4 按年
   * @param {*} value 表单值的类型
   * @param {*} index 索引index
   * @param {*} e 获取表单的值
   */
  change(type, value, index, e) {
    let { arrData, arrWeekData, arrMonthData, arrYearData } = this.props;
    if (type == 1) {
      const arr = arrData;
      this.changeCommon(arr, index, value, e, arrData, type);
    } else if (type == 2) {
      const arr1 = arrWeekData;
      this.changeCommon(arr1, index, value, e, arrWeekData, type);
    } else if (type == 3) {
      const arr2 = arrMonthData;
      this.changeCommon(arr2, index, value, e, arrMonthData, type);
    } else {
      const arr3 = arrYearData;
      this.changeCommon(arr3, index, value, e, arrYearData, type);
    }
  }

  /**
   * 
   * @param {*} execType 巡检周期类型
   * 1 按天  2 按周 3 按月 4 按年
   * @param arrData 巡检周期类型为 按天 data
   * @param arrWeekData 巡检周期类型为 按周 data
   * @param arrMonthData 巡检周期类型为 按月 data
   * @param arrYearData 巡检周期类型为 按年 data
   * @param hours 00-23时
   * @param week 1-7 
   * @param days 1-31天
   */
  timeChange(execType) {
    let { arrData, arrWeekData, arrMonthData, arrYearData } = this.props;
    const { getFieldDecorator } = this.props.form;
    if (execType == 1) {
      return arrData.map((value, index) => {
        return (<Row key={index}>
          <Col span={8}>
            <Form.Item label="">
              {getFieldDecorator(`startTime-${index}-${value.key}`, {
                initialValue: value.startTime,
                onChange: this.change.bind(this, execType, 'startTime', index),
                rules: [{ required: true, message: '请选择开始时间' }],
              })(
                <Select style={{ width: '120px' }} placeholder="请选择开始时间">
                  {hours.map((value) => { return <Option key={value} value={value}>{value}</Option> })}
                </Select>
              )}
              <span> 时至 </span>
              {getFieldDecorator(`endTime-${index}-${value.key}`, {
                initialValue: value.endTime,
                onChange: this.change.bind(this, execType, 'endTime', index),
                rules: [{ required: true, message: '请选择结束时间' }],
              })(
                <Select style={{ width: '120px' }} placeholder="请选择结束时间">
                  {hours.map((value) => { return <Option key={value} value={value}>{value}</Option> })}
                </Select>
              )}
              <span> 时 </span>
            </Form.Item>
          </Col>
          {
            arrData.length != 1 ?
              <Col span={3}>
                <a onClick={this.removeTime.bind(this, index)} style={{ marginTop: '12px', display: 'inline-block' }}>删除</a>
              </Col> : null
          }
        </Row>)
      })
    } else if (execType == 2) {
      return arrWeekData.map((value, index) => {
        return (<Row key={index}>
          <Col span={16}>
            <Form.Item label="">
              <span> 周 </span>
              {getFieldDecorator(`start-${index}-${value.key}`, {
                initialValue: value.start,
                onChange: this.change.bind(this, execType, 'start', index),
                rules: [{ required: true, message: '请输入开始周' }],
              })(
                <Select style={{ width: '120px' }} placeholder="请选择开始周">
                  {week.map((value) => { return <Option key={value} value={value}>{value}</Option> })}
                </Select>
              )}
              <span> </span>
              {getFieldDecorator(`startTime-${index}-${value.key}`, {
                initialValue: value.startTime,
                onChange: this.change.bind(this, execType, 'startTime', index),
                rules: [{ required: true, message: '请选择开始时间' }],
              })(
                <Select style={{ width: '120px' }} placeholder="请选择开始时间">
                  {hours.map((value) => { return <Option key={value} value={value}>{value}</Option> })}
                </Select>
              )}
              <span> 时至周 </span>
              {getFieldDecorator(`end-${index}-${value.key}`, {
                initialValue: value.end,
                onChange: this.change.bind(this, execType, 'end', index),
                rules: [{ required: true, message: '请输入周' }],
              })(
                <Select style={{ width: '120px' }} placeholder="请选择结束周">
                  {week.map((value) => { return <Option key={value} value={value}>{value}</Option> })}
                </Select>
              )}
              <span> </span>
              {getFieldDecorator(`endTime-${index}-${value.key}`, {
                initialValue: value.endTime,
                onChange: this.change.bind(this, execType, 'endTime', index),
                rules: [{ required: true, message: '请选择结束时间' }],
              })(
                <Select style={{ width: '120px' }} placeholder="请选择结束时间">
                  {hours.map((value) => { return <Option key={value} value={value}>{value}</Option> })}
                </Select>
              )}
              <span> 时 </span>
            </Form.Item>
          </Col>
          {
            arrWeekData.length != 1 ?
              <Col span={3}>
                <a onClick={this.removeTime.bind(this, index)} style={{ marginTop: '12px', display: 'inline-block' }}>删除</a>
              </Col> : null
          }
        </Row>)
      })
    } else if (execType == 3) {
      return arrMonthData.map((value, index) => {
        return (<Row key={index}>
          <Col span={16}>
            <Form.Item label="">
              {getFieldDecorator(`start-${index}-${value.key}`, {
                initialValue: value.start,
                onChange: this.change.bind(this, execType, 'start', index),
                rules: [{ required: true, message: '请输入开始号' }],
              })(
                <Select style={{ width: '120px' }} placeholder="请选择号">
                  {days.map((value) => { return <Option key={value} value={value}>{value}</Option> })}
                </Select>
              )}
              <span> 号 </span>
              {getFieldDecorator(`startTime-${index}-${value.key}`, {
                initialValue: value.startTime,
                onChange: this.change.bind(this, execType, 'startTime', index),
                rules: [{ required: true, message: '请选择开始时间' }],
              })(
                <Select style={{ width: '120px' }} placeholder="请选择开始时间">
                  {hours.map((value) => { return <Option key={value} value={value}>{value}</Option> })}
                </Select>
              )}
              <span> 时至 </span>
              {getFieldDecorator(`end-${index}-${value.key}`, {
                initialValue: value.end,
                onChange: this.change.bind(this, execType, 'end', index),
                rules: [{ required: true, message: '请输入结束号' }],
              })(
                <Select style={{ width: '120px' }} placeholder="请结束号">
                  {days.map((value) => { return <Option key={value} value={value}>{value}</Option> })}
                </Select>
              )}
              <span> 号 </span>
              {getFieldDecorator(`endTime-${index}-${value.key}`, {
                initialValue: value.endTime,
                onChange: this.change.bind(this, execType, 'endTime', index),
                rules: [{ required: true, message: '请选择结束时间' }],
              })(
                <Select style={{ width: '120px' }} placeholder="请选择结束时间">
                  {hours.map((value) => { return <Option key={value} value={value}>{value}</Option> })}
                </Select>
              )}
              <span> 时 </span>
            </Form.Item>
          </Col>
          {
            arrMonthData.length != 1 ?
              <Col span={3}>
                <a onClick={this.removeTime.bind(this, index)} style={{ marginTop: '12px', display: 'inline-block' }}>删除</a>
              </Col> : null
          }
        </Row>)
      })
    } else {
      return arrYearData.map((value, index) => {
        return (<Row key={index}>
          <Col span={21}>
            <Form.Item label="">
              {getFieldDecorator(`startMonth-${index}-${value.key}`, {
                initialValue: value.startMonth,
                onChange: this.change.bind(this, execType, 'startMonth', index),
                rules: [{ required: true, message: '请输入开始月' }],
              })(
                <Select style={{ width: '115px' }} placeholder="请选择开始月份">
                  {month.map((value) => { return <Option key={value} value={value}>{value}</Option> })}
                </Select>
              )}
              <span> 月 </span>
              {getFieldDecorator(`startDay-${index}-${value.key}`, {
                initialValue: value.startDay,
                onChange: this.change.bind(this, execType, 'startDay', index),
                rules: [{ required: true, message: '请输入开始号' }],
              })(
                <Select style={{ width: '115px' }} placeholder="请选择开始号">
                  {days.map((value) => { return <Option key={value} value={value}>{value}</Option> })}
                </Select>
              )}
              <span> 号 </span>
              {getFieldDecorator(`startTime-${index}-${value.key}`, {
                initialValue: value.startTime,
                onChange: this.change.bind(this, execType, 'startTime', index),
                rules: [{ required: true, message: '请选择开始时间' }],
              })(
                <Select style={{ width: '115px' }} placeholder="请选择开始时间">
                  {hours.map((value) => { return <Option key={value} value={value}>{value}</Option> })}
                </Select>
              )}
              <span> 时至 </span>
              {getFieldDecorator(`endMonth-${index}-${value.key}`, {
                initialValue: value.endMonth,
                onChange: this.change.bind(this, execType, 'endMonth', index),
                rules: [{ required: true, message: '请输入结束月' }],
              })(
                <Select style={{ width: '115px' }} placeholder="请选择结束月份">
                  {month.map((value) => { return <Option key={value} value={value}>{value}</Option> })}
                </Select>
              )}
              <span> 月 </span>
              {getFieldDecorator(`endDay-${index}-${value.key}`, {
                initialValue: value.endDay,
                onChange: this.change.bind(this, execType, 'endDay', index),
                rules: [{ required: true, message: '请输入结束号' }],
              })(
                <Select style={{ width: '115px' }} placeholder="请选择结束号">
                  {days.map((value) => { return <Option key={value} value={value}>{value}</Option> })}
                </Select>
              )}
              <span> 号 </span>
              {getFieldDecorator(`endTime-${index}-${value.key}`, {
                initialValue: value.endTime,
                onChange: this.change.bind(this, execType, 'endTime', index),
                rules: [{ required: true, message: '请选择结束时间' }],
              })(
                <Select style={{ width: '115px' }} placeholder="请选择结束时间">
                  {hours.map((value) => { return <Option key={value} value={value}>{value}</Option> })}
                </Select>
              )}
              <span> 时 </span>
            </Form.Item>
          </Col>
          {
            arrYearData.length != 1 ?
              <Col span={3}>
                <a onClick={this.removeTime.bind(this, index)} style={{ marginTop: '12px', display: 'inline-block' }}>删除</a>
              </Col> : null
          }
        </Row>)
      })
    }
  }

  render() {
    return (<div>
      {
        this.props.execType ?
          <Row>
            <Col span={3}>
              <p style={{ textAlign: 'right', color: 'rgb(0, 0, 0)', marginRight: '5px', marginTop: '10px' }}><span style={{ color: '#f04134' }}>*</span>开始结束时间:</p>
            </Col>
            <Col span={21}>
              <div>
                {this.timeChange(this.props.execType)}
              </div>
              {
                this.state.addVisible == true ? <Col span={24}><Button type="ghost" className="add mb1" onClick={this.addTime.bind(this)}><Icon type="plus" />新增开始结束时间</Button></Col> : null
              }

            </Col>
          </Row> : null
      }
    </div>)
  }
}
export default Time;