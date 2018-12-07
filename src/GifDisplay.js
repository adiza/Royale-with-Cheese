import React from 'react';
import './App.css';

class GifDisplay extends React.Component {
  render() {
    if (!this.props.url) {
      return "";
    }
    return <img className="gifPlayer" src={this.props.url} alt="gif" />;
  }
};

export default GifDisplay;
