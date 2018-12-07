import React, { Component } from 'react';

class GIFPlayer extends Component {
  render() {
    if (!this.props.gif_url) {
      return '';
    }
    return (
      <div className="gifPlayer">
      </div>
    );
  }
};

export default GIFPlayer;
