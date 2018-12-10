import React from 'react';
import Gif from './Gif';
import PropTypes from 'prop-types';

class GifDisplay extends React.Component {
  render() {
    if (!this.props.gif) {
      return "";
    }
    return (
      <Gif className="gif-player" src={this.props.gif.url} alt="gif"
        style={{left: this.props.gif.fracX*100 + '%',
          top: this.props.gif.fracY*100 + '%',
          visibility: this.props.playing ? 'visible' : 'hidden',
        }}
        playing={this.props.playing}
        width={150} loop={false} onEnd={this.props.onEnd}
      />
    );
  }
};

GifDisplay.propTypes = {
  playing: PropTypes.bool,
  gif: PropTypes.object.isRequired,
}

export default GifDisplay;
