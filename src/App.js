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
      currentGifUrl: null,
      gifs: [],
      videoId: this.props.urlParams.get("id"),
    };
  }

  componentDidMount() {
    this.setState({intervalId: setInterval(this.timer, 100)});
    this.fetchGifs((gifs) => this.setState({gifs}));
  }

  fetchGifs = (callback) => {
    callback([
      {url: 'https://media.giphy.com/media/2bV8SBlxOiU2NityCb/giphy.gif', time: 10.3},
      {url: 'https://media.giphy.com/media/Bo0ZNexSCyy9JyOXbW/giphy.gif', time: 20},
      {url: 'https://media.giphy.com/media/l4tUX3sa1D9ndNcQg/giphy.gif', time: 50}
    ]);
  }

  timer = () => {
    this.player.internalPlayer
      .getCurrentTime()
      .then((time) => {
        this.setState({currentVideoTime: time})
        this.state.gifs.forEach((gif) => {
          if (Math.abs(time - gif.time) < 0.15) {
            this.setState({currentGifUrl: gif.url});
          }
        });
      });
  }

  updateCurrentGif = (time) => {

  }

  render() {
    if (this.state.videoId === null) {
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
            <YouTube videoId={this.state.videoId} opts={{width: '100%', height: '100%'}}
              ref={(player) => (this.player = player)} />
            <div>
              <GifDisplay url={this.state.currentGifUrl}/>
            </div>
          </div>
          <GifBar className="gifBar" gifs={this.state.gifs} />
        </div>
      );
    }
  }
}

export default App;
