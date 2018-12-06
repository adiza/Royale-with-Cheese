import React, { Component } from 'react';
//import YouTube from 'react-youtube';
//import ReactDOM from 'react-dom';
import SearchGiphy from './components/searchGiphy.js'
//import './App.css';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      initialState: "Search for giphies",
      currentText: " "
    }
  }


  changeText(currentText) {
  this.setState({currentText});
  //console.log({currentText});
  }


  render() {
    const videoId = this.props.urlParams.get("id");
    if (videoId === null) {
      return (
        <div className="App">
          Please enter video id in the url.
          Like this: <a href='?id=dQw4w9WgXcQ'>?id=dQw4w9WgXcQ</a>.
        </div>
      );
    }
    else {
    return (

      <h1> Hello </> /*
      <div className="App container">




        
        <div className="videoFrame">
          <YouTube videoId={"dQw4w9WgXcQ"+'?wmode=opaque'} opts={{width: '100%', height: '100%'}}/>
          <div className="gifPlayer">
          </div>
        </div> 
    </div>*/



          );
       }
    }
  }

export default App;
