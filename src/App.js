import React, { Component } from 'react';
import YouTube from 'react-youtube';
import './App.css';

class App extends Component {
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
    return (
      <div className="App container">
        <div className="videoFrame">
          <YouTube videoId={videoId+'?wmode=opaque'} opts={{width: '100%', height: '100%'}}/>
          <div className="gifPlayer">
          </div>
        </div>
      </div>
    );
  }
}

export default App;
