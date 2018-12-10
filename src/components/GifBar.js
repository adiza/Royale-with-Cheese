import React from 'react';
import './GifBar.css';

class GifBar extends React.Component {
  render() {
    return (
      <div className="gif-bar">
        { this.props.showMarkers ?
            this.props.gifs.map((gif) =>
              <div className="gif-marker" key={gif.url+gif.timeFraction}
                style={{marginLeft: gif.timeFraction*100 + "%"}} />)
          : ''
        }
      </div>);
  }
};

export default GifBar;
