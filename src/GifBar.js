import React from 'react';
import './App.css';

class GifBar extends React.Component {
  render() {
    return (
      <div className={this.props.className}>
        {this.props.gifs.map((gif) => <img className="smallGif" src={gif.url} key={gif.url} />)}
      </div>);
  }
};

export default GifBar;
