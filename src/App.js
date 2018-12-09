import React, { Component } from 'react';
import YouTube from 'react-youtube';
import './App.css';
import ReactDOM from 'react-dom';
import SearchGiphy from './components/searchGiphy.js'
import GifDisplay from './components/GifDisplay';
import GifBar from './components/GifBar';
import {Rnd} from 'react-rnd';

const SERVER_ADDRESS = "http://gif-backend.herokuapp.com";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      gifs: [],
      videoId: this.props.urlParams.get("id"),
      videoDuration: null,
      newGif: null,
      newGifX: 0, newGifY: 0,
      previouslyUsedGifs: JSON.parse(localStorage.getItem("usedGifs")) || [],
    };

    this.player = React.createRef();
    this.gifPlayer = React.createRef();
    this.searchDiv = React.createRef();

    document.addEventListener('mousedown', this.handleDocumentClick, false);
    document.addEventListener('keydown', this.handleEsc, false);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleDocumentClick, false);
    document.removeEventListener('keydown', this.handleEsc, false);
  }

  componentDidMount() {
    fetch(SERVER_ADDRESS+'/videos', {
      method: 'post', cache: 'no-cache', cors: 'cors',
      headers: { "Content-Type": "application/json; charset=utf-8", },
      body: JSON.stringify({videoId: this.state.videoId}),
    });
  }

  handleEsc = (event) => {
    if (event.key === "Escape") {
      this.setState({showGifSearch: false});
    }
  }

  handleDocumentClick = (event) => {
    if (!this.showGifSearch || this.searchDiv.current.contains(event.target)) {
      return;
    }
    this.setState({showGifSearch: false});
  }

  addRelativeTimes = (gifs, duration) => {
    return gifs.map((gif) => Object.assign(
      {timeFraction: gif.time/duration},
      gif));
  }

  fetchGifs = () => {
    fetch(SERVER_ADDRESS+'/gifs?videoId='+this.state.videoId)
      .then((response) => console.log(JSON.stringify(response.json())));
    const result = [
      {url: 'https://media.giphy.com/media/2bV8SBlxOiU2NityCb/giphy.gif',
        time: 10.1, fracX: 0.1, fracY: 0.5},
      {url: 'https://media.giphy.com/media/2bV8SBlxOiU2NityCb/giphy.gif',
        time: 10.3, fracX: 0.5, fracY: 0.1},
      {url: 'https://media.giphy.com/media/Bo0ZNexSCyy9JyOXbW/giphy.gif',
        time: 20, fracX: 0.1, fracY: 0.1},
      {url: 'https://media.giphy.com/media/l4tUX3sa1D9ndNcQg/giphy.gif',
        time: 50, fracX: 0.2, fracY: 0.2}
    ];
    return new Promise((resolve, reject) => resolve(result));
  }

  getVideoDuration = (callback) => {
    return this.player.current.internalPlayer.getDuration();
  }

  onPlayerReady = () => {
    this.setState({intervalId: setInterval(this.timer, 100)});
    Promise
      .all([this.fetchGifs(), this.getVideoDuration()])
      .then(([gifs, duration]) => {
        this.setState({
          gifs: (this.addRelativeTimes(gifs, duration)
            .sort((a, b) => (a.time - b.time))),
          videoDuration: duration,
        })
      });
  }

  timer = () => {
    try {
    this.player.current.internalPlayer
      .getCurrentTime()
      .then((time) => {
        this.setState({currentVideoTime: time})
        this.setState(({gifs}) => {
          return {
            gifs: gifs.map((gif) => {
              if (Math.abs(time - gif.time) < 0.15) {
                return Object.assign(gif, {playing: true})
              }
              return gif;
            })
          }
        });
      });
    } catch (e) {
      clearInterval(this.state.intervalId);
    }
  }

  gifEnded = (gif) => {
    this.setState(({gifs}) => {
      const gif_index = gifs.indexOf(gif);
      if (gif_index === -1) {
        return gifs;
      }
      return {gifs: [
        ...gifs.slice(0, gif_index),
        Object.assign(gif, {playing: false}),
        ...gifs.slice(gif_index+1)
      ]};
    });
  }

  showGifSearch = () => { this.setState({showGifSearch: true}); }
  closeGifSearch = () => { this.setState({showGifSearch: false}); }

  addNewGif = (gif) => {
    this.setState(({previouslyUsedGifs}) => {
      if (previouslyUsedGifs.includes(gif)) {
        return { newGif: gif, showGifSearch: false };
      } else {
        return { newGif: gif, showGifSearch: false,
          previouslyUsedGifs: [gif, ...previouslyUsedGifs]};
      }
    }, () => localStorage.setItem("usedGifs",
      JSON.stringify(this.state.previouslyUsedGifs)));
    this.player.current.internalPlayer.pauseVideo();
  }

  postNewGif = (gifInfo) => {
    fetch(SERVER_ADDRESS+'/gifs', {
      method: 'post', cache: 'no-cache', cors: 'cors',
      headers: { "Content-Type": "application/json; charset=utf-8", },
      body: JSON.stringify({videoId: gifInfo.videoId,
        gifId: gifInfo.url, gifTimestamp: gifInfo.timeFraction,
        fracX: gifInfo.fracX, fracY: gifInfo.fracY
      }),
    });
  }

  saveNewGif = () => {
    const gif = this.state.newGif;
    const url = `https://media.giphy.com/media/${gif.id}/giphy.gif`;
    const time = this.state.currentVideoTime;
    const videoId = this.state.videoId;
    const videoRect = ReactDOM.findDOMNode(this.player.current).children[0]
      .getBoundingClientRect();
    const fracX = this.state.newGifX / videoRect.width;
    const fracY = this.state.newGifY / videoRect.height;
    const toSave = {url, time, videoId, fracX, fracY,
      timeFraction: time/this.state.videoDuration
    };
    this.postNewGif(toSave);
    this.setState({
      gifs: this.state.gifs.concat([toSave]),
      newGif: null,
      newGifX: 0, newGifY: 0
    });
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
    return (
      <div className="App container">
        <div className="videoFrame">
          <YouTube videoId={this.state.videoId} opts={{width: '100%', height: '100%'}}
            ref={this.player} onReady={this.onPlayerReady} />
          {this.state.newGif ?
              <Rnd enableResizing={false} height="100px" bounds="parent"
                onDragStop={(e, d) => { this.setState({newGifX: d.x, newGifY: d.y}) }}>
                <img src={this.state.newGif.images.fixed_height_small.url} />
              </Rnd>
              : ''
          }
          <div ref={this.searchDiv}>
            <SearchGiphy onGifClick={this.addNewGif}
              previouslyUsedGifs={this.state.previouslyUsedGifs}
              open={this.state.showGifSearch} closeGifSearch={this.closeGifSearch}/>
          </div>
          {this.state.gifs.map(gif =>
            <GifDisplay gif={gif} key={gif.url+gif.timeFraction}
              playing={gif.playing} onEnd={() => this.gifEnded(gif)}/>)}
        </div>
        <GifBar gifs={this.state.gifs} onAddGif={this.showGifSearch} />
         
        {this.state.newGif ? 
          <button type="button" className="btn btn-primary"
            onClick={this.saveNewGif}>
            Save
          </button> 
         
            : ''}
      </div>
    );
  }
}

export default App;
