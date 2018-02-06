import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import mySocket from "socket.io-client";

class App extends Component {

constructor(props) {
  super(props);
  this.state = {
    myImg: require("./imgs/img1.png"),
    myImg2: require("./imgs/img2.png"),
    allusers: [],
    myId: null
  }
  

  this.handleImg = this.handleImg.bind(this);

}

  componentDidMount() {
    this.socket = mySocket("http://localhost:6969");
    this.socket.on("createimage", (data) => {
      this.setState ({
        allusers: data
      })
    })

    this.socket.on("yourid", (data) => {
      this.setState({
        myId: data
      })
      
    })
    this.socket.on("usermove", (data) => {
      this.refs["u" + data.id].style.left = data.x + "px";
      this.refs["u" + data.id].style.top = data.y + "px";
      this.refs["u" + data.id].src = data.img;
    })
    
    this.refs.thedisplay.addEventListener("mousemove", (ev) => {

      if (this.state.myId === null) {
        return false;
      }
      // this.refs.myImg.style.left = (ev.pageX-100)+"px";
      // this.refs.myImg.style.top = (ev.pageY-100)+"px";
      this.refs["u"+this.state.myId].style.left = (ev.pageX-100)+"px";
      this.refs["u"+this.state.myId].style.top = (ev.pageY-100)+"px";


      // this.refs."u"+.this.state.myId would break it

      this.socket.emit("mymove", {
        x: ev.pageX - 100,
        y: ev.pageY - 100,
        id: this.state.myId,
        img: this.refs["u"+this.state.myId].src
      });


    })
      
  };

  handleImg(evt) {
    this.refs["u"+this.state.myId].src  = evt.target.src
  }

  render() {
    var auImgs = this.state.allusers.map((obj, i) => {
      return (
        <img ref={"u"+obj} key={i}   className = "allImgs" src={this.state.myImg} />
      )
    })


    


    return (
      <div>
        <div ref="thedisplay" className = "bigDiv" >
          {auImgs}
        </div>
        <div className = "controls">
          {this.state.myId}
          <img src={this.state.myImg} onClick={this.handleImg}/>
          <img src={this.state.myImg2} onClick={this.handleImg} height={100}/>
        </div> 
      </div>
    );
  }
}

export default App;
