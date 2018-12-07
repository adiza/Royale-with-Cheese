import React, { Component } from 'react';
import YouTube from 'react-youtube';
import ReactDOM from 'react-dom';
import SearchGiphy from './components/searchGiphy.js'
import GIFPlayer from './components/GIFPlayer.js';
import './App.css';
import GifDisplay from './GifDisplay';
import GifBar from './GifBar';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      url: "https://media.giphy.com/media/D43M5jtwc4upq/giphy.gif",
    };
    this.changeDisplay = this.changeDisplay.bind(this);
  }

  changeDisplay(newUrl) {
    this.setState({url: newUrl});
  }

  componentDidMount() {
    this.setState({intervalId: setInterval(this.timer, 1000)});
  }

  timer = () => {
    this.player.internalPlayer.getCurrentTime()
      .then((time) => this.setState({currentVideoTime: this.time}));
    //this.setState({currentVideoTime: this.player.internalPlayer.getCurrentTime()});
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
        <div className="App container">
          <SearchGiphy currentTime={this.state.currentVideoTime}/> 
          <div className="videoFrame">
            <YouTube videoId={videoId} opts={{width: '100%', height: '100%'}}
              ref={(player) => (this.player = player)} />
            <div>
              <GifDisplay url={this.state.url}/>
            </div>
          </div>
          <GifBar className="gifBar" onHover={this.changeDisplay} />
        </div>
      );
    }
  }
}

export default App;
