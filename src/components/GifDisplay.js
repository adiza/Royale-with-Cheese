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
        style={{left: this.props.gif.positionX,
          width: this.props.width,
          top: this.props.gif.positionY,
          visibility: this.props.playing ? 'visible' : 'hidden',
        }}
        playing={this.props.playing} duration={this.props.gif.duration}
        width={this.props.width} loop={this.props.gif.duration!=='once'}
        onEnd={this.props.onEnd}
      />
    );
  }
};

GifDisplay.propTypes = {
  playing: PropTypes.bool,
  gif: PropTypes.object.isRequired,
  width: PropTypes.number.isRequired,
}

export default GifDisplay;
