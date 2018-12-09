import React from 'react';
import Gif from './Gif';

class GifDisplay extends React.Component {
  render() {
    if (!this.props.gif) {
      return "";
    }
    return (
      <Gif className="gifPlayer" src={this.props.gif.url} alt="gif"
        style={{marginLeft: this.props.gif.fracX*100 + '%',
          marginTop: this.props.gif.fracY*100 + '%'}}
        autoPlay={true} width={150} loop={false} onEnd={this.props.onEnd}
      />
    );
  }
};

export default GifDisplay;
