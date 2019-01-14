import React from 'react'
import '../FormulaManagement.less';

function Calculator({formulaResult, calculatorClear, calculatorBack, calculatorInput }) {
  function createClass () {
    let args = arguments;
    args = Array.from(args);
    return args.join(' ')
  }
  return (
    <div className={createClass('y-calculator')}>
      <div className={createClass('y-result')}>
        {/* <i className="y-cl-f04134">{formulaResult}</i> */}
        {/*<p>测试默认值：车位面积为 10平方，房屋收费面积 90平方</p>*/}
      </div>
      <p className={createClass('y-title')}>计算器：</p>
      <div>
        <span className={createClass('y-sm', 'y-b-r-n', 'y-cl-f04134', 'spanComStyle')} onClick={() => calculatorClear()}>
          清空
        </span>
        <span className={createClass('y-lg', 'y-b-r-n', 'spanComStyle')} onClick={() => calculatorBack()}>
          后退
        </span>
        <span className={createClass('y-sm', 'spanComStyle')} onClick={() => calculatorInput('+')}>
          +
        </span>
      </div>
      <div className={createClass('y-m-t-n-1')}>
        <span className={createClass('y-sm', 'y-b-r-n', 'spanComStyle')} onClick={() => calculatorInput('7')}>
          7
        </span>
        <span className={createClass('y-sm', 'y-b-r-n', 'spanComStyle')} onClick={() => calculatorInput('8')}>
          8
        </span>
        <span className={createClass('y-sm', 'y-b-r-n', 'spanComStyle')} onClick={() => calculatorInput('9')}>
          9
        </span>
        <span className={createClass('y-sm', 'spanComStyle')} onClick={() => calculatorInput('-')}>
          -
        </span>
      </div>
      <div className={createClass('y-m-t-n-1')}>
        <span className={createClass('y-sm', 'y-b-r-n', 'spanComStyle')} onClick={() => calculatorInput('4')}>
          4
        </span>
        <span className={createClass('y-sm', 'y-b-r-n', 'spanComStyle')} onClick={() => calculatorInput('5')}>
          5
        </span>
        <span className={createClass('y-sm', 'y-b-r-n', 'spanComStyle')} onClick={() => calculatorInput('6')}>
          6
        </span>
        <span className={createClass('y-sm', 'spanComStyle')} onClick={() => calculatorInput('*')}>
          *
        </span>
      </div>
      <div className={createClass('y-m-t-n-1')}>
        <span className={createClass('y-sm', 'y-b-r-n', 'spanComStyle')} onClick={() => calculatorInput('1')}>
          1
        </span>
        <span className={createClass('y-sm', 'y-b-r-n', 'spanComStyle')} onClick={() => calculatorInput('2')}>
          2
        </span>
        <span className={createClass('y-sm', 'y-b-r-n', 'spanComStyle')} onClick={() => calculatorInput('3')}>
          3
        </span>
        <span className={createClass('y-sm', 'spanComStyle')} onClick={() => calculatorInput('/')}>
          /
        </span>
      </div>
      <div className={createClass('y-m-t-n-1')}>
        <span className={createClass('y-sm', 'y-b-r-n', 'spanComStyle')} onClick={() => calculatorInput('0')}>
          0
        </span>
        <span className={createClass('y-sm', 'y-b-r-n', 'spanComStyle')} onClick={() => calculatorInput('(')}>
          (
        </span>
        <span className={createClass('y-sm', 'y-b-r-n', 'spanComStyle')} onClick={() => calculatorInput(')')}>
          )
        </span>
        <span className={createClass('y-sm', 'spanComStyle')} onClick={() => calculatorInput('.')}>
          .
        </span>
      </div>
      <div className={createClass('y-m-t-n-1')}>
        <span className={createClass('y-xxl', 'spanComStyle')} onClick={() => calculatorInput('H')}>
          房屋收费面积 (H)
        </span>
      </div>
    </div>
  )
}
export default Calculator
