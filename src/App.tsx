import React from 'react';
import './App.css';
import QqInfo from "./components/QqInfo";
import debounce from 'lodash/debounce'

class App extends React.Component<any,any> {


  constructor(props: any) {
    super(props);
    this.state = {qq: "",searchQq:""};
  }

  handleQQChange = debounce(e => {
      this.setState({qq:e.target.value})
  },1000)

  render() {
    return (
        <div>
          <h1>QQ号查询</h1>
          <label htmlFor="qq">QQ:</label><input type="text" placeholder="请输入qq号" name="qq"  onChange={(e)=>this.handleQQChange(e)}/>
          {this.state.qq?<QqInfo qq={this.state.qq} />:<span></span>}
        </div>
    );
  }
}

export default App;
