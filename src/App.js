import React from 'react';
import './App.css';
import moment from "moment";

class Timer extends React.Component {
  render(){
    return (
      <div clasName="timer">
      <h2 id="timer-label">{this.props.mode==="Session"?"Session":"Break"}</h2>
      <h1 id="time-left">{this.props.time}</h1>
      </div>
    )
  }
}

class Controls extends React.Component {
  render () {
    return (
      <div className="Controls">
        <button id="start_stop" onClick={this.props.pauseResume}>
        {this.props.active===true?<span>&#10074;&#10074;</span>:<span>&#9658;</span>}
        </button>
        <button id="reset" onClick={this.props.handleReset}>&#8635;</button>
      </div>
    )}
}

class SetTimer extends React.Component {
  render () {
    return (
      <div className="SetTimer">
      <div id={`${this.props.type}-label`}>
        {`${this.props.type[0].toUpperCase()+this.props.type.slice(1)} Length`}
      </div>
      <div className="SetTimer-controls">
        <button id={`${this.props.type}-increment`} onClick={()=>this.props.handleSetTimer(true, `${this.props.type}Length`)}>
          &uarr;
        </button>
        <div id={`${this.props.type}-length`}>
          {this.props.length/*===0?1:this.props.length*/}
        </div>
        <button id={`${this.props.type}-decrement`} onClick={()=>this.props.handleSetTimer(false, `${this.props.type}Length`)}>
          &darr;
        </button> 
      </div>
      </div>
    )
  }
}

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      breakLength:5,
      sessionLength:25,
      mode: "Session",
      time: 25*60*1000,
      active: false,
    }
  }

  handleSetTimer = (inc,type) => {
        if (this.state.active) return
         this.setState(state=>({
           [type]:state[type] + (inc&&state[type]===60?0:inc?1:state[type]===1?0:-1),
           time:!(type==="sessionLength")?state.time:(state[type]+(inc&&state[type]===60?0:inc?1:state[type]===1?0:-1))*60*1000
          }))
  }

  pauseResume = () => {
    if (this.state.active){
      this.setState({active:false})
      clearInterval(this.pomodoro)
    } else {
        this.setState({active:true})
        this.pomodoro = setInterval(
        ()=>this.setState(state=>({time:state.time-1000}))
        ,1000)
    }
  }

  handleReset = () => {
    clearInterval(this.pomodoro)
    this.setState({
      breakLength:5,
      sessionLength:25,
      mode: "Session",
      time: 25*60*1000,
      active: false,
    })
    this.sound.pause()
    this.sound.currentTime = 0
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.time===0 && prevState.mode==="Break"){
      this.setState({mode:"Session",time:this.state.sessionLength*60*1000})
      this.sound.play()
    } 
    if (prevState.time===0 && prevState.mode==="Session") {
      this.setState({mode:"Break",time:this.state.breakLength*60*1000})
      this.sound.play()
    }
  }
  render() {
  return (
    <div className="App">
      <h1>Pomodoro Clock App</h1>
      <div className="settings">
        <SetTimer type="break" length={this.state.breakLength} handleSetTimer={this.handleSetTimer}/>
        <SetTimer type="session" length={this.state.sessionLength} handleSetTimer={this.handleSetTimer}/>
      </div>
      <div>
        <Timer mode={this.state.mode} time={this.state.time/60/1000===60?"60:00":moment(this.state.time).format("mm:ss")}/>
      </div>
      <div>
      <Controls pauseResume={this.pauseResume} active={this.state.active} handleReset={this.handleReset}/>
      </div>
      <audio id="beep" src="http://starmen.net/mother2/soundfx/skyrunner.wav" ref={elem=>this.sound=elem}></audio>
    </div>
  )};
}


export default App;
