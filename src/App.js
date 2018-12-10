import React, { Component } from 'react';
import YouTube from 'react-youtube';
import './App.css';
import ReactDOM from 'react-dom';
import SearchGiphy from './components/searchGiphy.js'
import GifDisplay from './components/GifDisplay';
import GifBar from './components/GifBar';
import {Rnd} from 'react-rnd';

const SERVER_ADDRESS = "http://gif-backend.herokuapp.com";
const VIDEO_INFO_ADDRESS = "http://noembed.com/embed?url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3D";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      gifs: [],
      videoId: this.props.urlParams.get("id"),
      videoInfo: null,
      videoDuration: null,
      videoPlaying: false,
      newGif: null,
      newGifX: 0, newGifY: 0,
      previouslyUsedGifs: JSON.parse(localStorage.getItem("usedGifs")) || [],
      showGifSearch: false,
      showAddGif: false,
      showGifBar: true,
    };

    this.player = React.createRef();
    this.searchDiv = React.createRef();

    document.addEventListener('mousedown', this.handleDocumentClick, false);
    document.addEventListener('keydown', this.handleEsc, false);
    window.addEventListener('resize', this.onWindowResize, false);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleDocumentClick, false);
    document.removeEventListener('keydown', this.handleEsc, false);
    window.removeEventListener('resize', this.onWindowResize, false);
    clearInterval(this.intervalId);
  }

  componentDidMount() {
    if (this.state.videoId) {
      fetch(SERVER_ADDRESS+'/videos', {
        method: 'post', cache: 'no-cache', cors: 'cors',
        headers: { "Content-Type": "application/json; charset=utf-8", },
        body: JSON.stringify({videoId: this.state.videoId}),
      });
      fetch(VIDEO_INFO_ADDRESS+this.state.videoId)
        .then(response => response.json())
        .then(json => this.setState({videoInfo: json}));
    }
  }

  handleEsc = (event) => {
    if (event.key === "Escape") {
      this.setState({showGifSearch: false});
    }
  }

  handleDocumentClick = (event) => {
    if (!this.state.videoId) {
      return;
    }
    if (!this.showGifSearch || this.searchDiv.current.contains(event.target)) {
      return;
    }
    this.setState({showGifSearch: false});
  }

  serverGifToLocal = (gif) => {
    return {
      url: gif.gifId,
      timeFraction: gif.timestamp,
      fracX: gif.fracX, fracY: gif.fracY,
    };
  }

  fetchGifs = () => {
    return fetch(SERVER_ADDRESS+'/gifs?videoId='+this.state.videoId)
      .then((response) => response.json())
      .then((json) => json.gifs.map(this.serverGifToLocal));
  }

  getVideoDuration = (callback) => {
    return this.player.current.internalPlayer.getDuration();
  }

  onPlayerReady = () => {
    this.intervalId = setInterval(this.timer, 100);
    Promise
      .all([this.fetchGifs(), this.getVideoDuration()])
      .then(([gifs, duration]) => {
        this.setState({
          gifs: (this.computeGifPositions(gifs)
            .sort((a, b) => (a.timeFraction - b.timeFraction))),
          videoDuration: duration,
        })
      });
  }

  onPlayerStateChange = (event) => {
    if (event.data === 1) { // playing
      this.setState({videoPlaying: true});
      clearTimeout(this.gifBarTimeoutId);
      this.gifBarTimeoutId = setTimeout(
        () => this.setState({showGifBar: false}), 4000);
    } else {
      this.setState({showGifBar: true, videoPlaying: false});
      clearTimeout(this.gifBarTimeoutId);
    }
  }

  onMouseMove = (event) => {
    if (!this.state.videoPlaying) {
      return;
    }
    clearTimeout(this.gifBarTimeoutId);
    this.setState({showGifBar: true});
    this.gifBarTimeoutId = setTimeout(
        () => this.setState({showGifBar: false}), 2000);
  }

  timer = () => {
    try {
    this.player.current.internalPlayer
      .getCurrentTime()
      .then((time) => {
        this.setState({currentVideoTime: time})
        this.setState(({gifs, videoDuration}) => {
          let anythingChanged = false;
          const newGifs = gifs.map((gif) => {
            if (Math.abs(time - gif.timeFraction*videoDuration) < 0.15) {
              anythingChanged = true;
              return Object.assign(gif, {playing: true})
            }
            return gif;
          })
          if (anythingChanged) { return { gifs: newGifs }; }
        });
      });
    } catch (e) {
      clearInterval(this.intervalId);
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

  toggleGifSearch = () => {
    this.setState(({showGifSearch}) => ({showGifSearch: !showGifSearch}));
  }
  closeGifSearch = () => { this.setState({showGifSearch: false}); }
  handleCancel = () => { this.setState({newGif: null, showGifSearch: false}); }

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

  getRealVideoDimensions = () => {
    const videoRect = ReactDOM.findDOMNode(this.player.current).children[0]
      .getBoundingClientRect();
    const scale = Math.min(videoRect.width / this.state.videoInfo.width,
      videoRect.height / this.state.videoInfo.height);
    return { width: scale*this.state.videoInfo.width,
      height: scale*this.state.videoInfo.height };
  }

  computeGifPositions = (gifList) => {
    const realDimensions = this.getRealVideoDimensions();
    const videoRect = ReactDOM.findDOMNode(this.player.current).children[0]
      .getBoundingClientRect();
    return gifList.map(gif => {
      const positionX = Math.min(
        gif.fracX*realDimensions.width+videoRect.width/2,
        videoRect.width-100);
      const positionY = Math.min(
        gif.fracY*realDimensions.height+videoRect.height/2,
        videoRect.height-100);
      return {...gif, positionX, positionY};
    });
  }

  updateGifPositions = () => {
    this.setState(({gifs}) => ({ gifs: this.computeGifPositions(gifs) }));
  }

  onWindowResize = () => {console.log('ha'); this.updateGifPositions(); }

  saveNewGif = () => {
    const gif = this.state.newGif;
    const url = `https://media.giphy.com/media/${gif.id}/giphy.gif`;
    const time = this.state.currentVideoTime;
    const videoId = this.state.videoId;
    const realDimensions = this.getRealVideoDimensions();
    const fracX = this.state.newGifX / realDimensions.width - 0.5;
    const fracY = this.state.newGifY / realDimensions.height - 0.5;
    const toSave = {url, time, videoId, fracX, fracY,
      positionX: this.state.newGifX,
      positionY: this.state.newGifY,
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
        <div className="header">
          <h1>Gifgif</h1>
          {this.state.newGif ?
            <button type="button" className="btn btn-primary save-gif-button"
              onClick={this.saveNewGif}>
              Save
            </button> 
              : ''
          }
          {this.state.showGifSearch || this.state.newGif ?
              <button type="button" className="btn btn-danger add-gif-button"
                onClick={this.handleCancel}>
                Cancel
              </button> :
              <button type="button" className="btn btn-primary add-gif-button"
                onClick={this.toggleGifSearch}>
                Add gif
              </button>
          }
        </div>
        <div className="videoFrame" onMouseMove={this.onMouseMove}>
          <YouTube videoId={this.state.videoId}
            opts={{width: '100%', height: '100%', playerVars: {autoplay: 1}}}
            ref={this.player} onReady={this.onPlayerReady}
            onStateChange={this.onPlayerStateChange} />
          {this.state.newGif ?
              <Rnd enableResizing={false} height="100px" bounds="parent"
                enableUserSelectHack={false}
                onDragStop={(e, d) => { this.setState({newGifX: d.x, newGifY: d.y}) }}>
                <img src={this.state.newGif.images.fixed_height_small.url} />
              </Rnd>
              : ''
          }
          <GifBar gifs={this.state.gifs} showMarkers={this.state.showGifBar}/>
          <div ref={this.searchDiv}>
            <SearchGiphy onGifClick={this.addNewGif}
              previouslyUsedGifs={this.state.previouslyUsedGifs}
              open={this.state.showGifSearch} closeGifSearch={this.closeGifSearch}/>
          </div>
          {this.state.gifs.map(gif =>
            <GifDisplay gif={gif} key={gif.url+gif.timeFraction}
              playing={gif.playing} onEnd={() => this.gifEnded(gif)}/>)}
        </div>
      </div>
    );
  }
}

export default App;
