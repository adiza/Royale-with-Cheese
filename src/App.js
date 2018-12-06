import React, { Component } from 'react';
import YouTube from 'react-youtube';
import ReactDOM from 'react-dom';
import SearchGiphy from './components/searchGiphy.js'
import './App.css';
import GifDisplay from './GifDisplay';
import GifBar from './GifBar';

class App extends Component {
  
  constructor(props) {
    super(props);
    this.state = { 
      url: "https://media.giphy.com/media/D43M5jtwc4upq/giphy.gif",
      initialState: "Search for giphies",
      currentText: " "
    };
    this.changeDisplay = this.changeDisplay.bind(this);
    this.changeText = this.changeText.bind(this);
  }

  changeDisplay(newUrl) {
    this.setState({url: newUrl});
  }

  changeText(newCurrentText) {
  this.setState({currentText: newCurrentText});
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
        <div className="App container">
          <SearchGiphy /> 
          <div className="videoFrame">
            <YouTube videoId={videoId+'?wmode=opaque'} opts={{width: '100%', height: '100%'}}/>
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
