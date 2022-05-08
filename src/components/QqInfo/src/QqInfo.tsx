import React from 'react';
import './index.css'
import Loading from "./Loading";

interface  PropType {
    qq:string
    width?:number
    height?:number
    ifShowQq?:boolean
}

interface QqInfo {
   name:string;
   qlogo:string
}


class QqInfo extends React.Component<PropType,any> {

  constructor(props: PropType) {
    super(props);
    this.state = {name: "",qlogo:"",loading: true,isQQ:_checkIsQq(props.qq),httpError:undefined};
  }

  static defaultProps = {
      ifShowQq:true
  }

  async componentDidMount() {
      if(this.state.isQQ){
          this.setState(await _getQqInfo(this.props.qq).catch((e)=>this.setState({httpError:e})))
          this.setState({loading:false})
      }
  }

  async componentDidUpdate(prevProps:Readonly<any>, prevState:Readonly<any>, snapshot?:any) {

    if (prevProps.qq !== this.props.qq){
        this.setState({isQQ:_checkIsQq(this.props.qq)})
        if(_checkIsQq(this.props.qq)){
            this.setState({loading:true})

            this.setState(await _getQqInfo(this.props.qq).then(()=>this.setState({httpError:undefined})).catch((e)=>this.setState({httpError:e})))
            this.setState({loading:false})
        }
    }

  }
   render() {
    const props    = this.props;
    const width    = props.width && props.width >= 100 ? props.width : 200;
    const height   = props.height ? props.height : 100;
    const imgSize  = width * 0.3 < height ? width * 0.3 : height * 0.8;
    const fontSize = width >= 200 && imgSize > 30? 20 : 13;
    const styleObj = {
      width: width,
      height: height,
      fontSize: fontSize
    }


    if (!this.state.isQQ) {
       return <div style={styleObj} className="qqInfoContainer">qq格式错误</div>
    }

    if (this.state.httpError) {
       return <div style={styleObj} className="qqInfoContainer" data-testid="httpError">{this.state.httpError}</div>
    }
    return (
          <div>
              {this.state.loading?
                  <div style={styleObj} className="qqInfoContainer" data-testid="loading">
                      <Loading width={imgSize}/>
                  </div>
                  :
                  <div style={styleObj} className="qqInfoContainer" data-testid="qqInfo">
                      <img src={this.state.qlogo} width={imgSize} height={imgSize}style={{'borderRadius': "50%"}}/>
                      <div>
                          <div className="qqName">{this.state.name}</div>
                          {props.ifShowQq?<div className="qq">{props.qq}</div>:''}
                      </div>
                  </div>
              }
          </div>


    );
  }
}


// 校验QQ号是否正确
function _checkIsQq(qq:string):boolean {
  const re = new RegExp(/^[1-9][0-9]{4,10}$/);
  return re.test(qq);
}

// 发送请求获取qq信息
function _getQqInfo(qq:string):Promise<QqInfo> {
  return  new Promise((resolve,reject)=>{
    const httpRequest = new XMLHttpRequest();
    httpRequest.open('GET', 'https://api.uomg.com/api/qq.info?qq='+qq, true);
    httpRequest.send();
    httpRequest.onreadystatechange = function () {

        if(httpRequest.readyState === 4) {
            if(httpRequest.status == 200) {
                const json: QqInfo = JSON.parse(httpRequest.responseText);
                resolve(json);
            } else {
                reject("请求错误："+ httpRequest.status)
            }
        }
    };
  })
}

export default QqInfo;