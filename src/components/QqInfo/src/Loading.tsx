import React from 'react';
import LoadingGif from './loading.gif'
import './index.css'

function Loading(props:any) {

    const width = props.width?props.width:30;
    return (<div className="loadingContainer">
        <img src={LoadingGif} width={width}/>
    </div>)
}

export default Loading;