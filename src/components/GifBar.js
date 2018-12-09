import React from 'react';
import Gif from './Gif';
import './GifBar.css';

class GifBar extends React.Component {
  render() {
    return (
      <div className="gifBar">
        { this.props.gifs.map((gif) =>
          <Gif className="smallGif" src={gif.url} key={gif.url+gif.timeFraction}
            width={75} height={50}
            style={{marginLeft: gif.timeFraction*100 + "%"}}
          />)
        }
        <button type="button" className="btn btn-primary add-gif-button"
          onClick={this.props.onAddGif}>
          Add gif
        </button>
      </div>);
  }
};

export default GifBar;
