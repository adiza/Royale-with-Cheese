import React from 'react';
import Gif from './Gif';

class GifBar extends React.Component {
  render() {
    return (
      <div className={this.props.className}>
        { this.props.gifs.map((gif) =>
          <Gif className="smallGif" src={gif.url} key={gif.url}
            width={75} height={50}
            style={{marginLeft: gif.timeFraction*100 + "%"}} />) }
      </div>);
  }
};

export default GifBar;
