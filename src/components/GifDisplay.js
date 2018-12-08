import React from 'react';
import Gif from './Gif';

class GifDisplay extends React.Component {
  render() {
    if (!this.props.url) {
      return "";
    }
    return (
      <Gif className="gifPlayer" src={this.props.url} alt="gif"
        autoPlay={true} width={150} loop={false} onEnd={this.props.onEnd}
      />
    );
  }
};

export default GifDisplay;
