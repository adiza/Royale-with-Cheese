import React, { Component } from 'react';
import { VIDEO_INFO_ADDRESS } from '../constants';
import './VideosListElement.css';

class PopulatedVideoInfo extends Component {
  render() {
    return (
      <div className='video-info'
        style={{backgroundImage: 'url('+this.props.videoInfo.thumbnail_url+')'}}
        onClick={() => { window.location = '?id='+this.props.videoId; }}>
        <span>
          {this.props.videoInfo.title}
        </span>
      </div>
    );
  }
}

class VideosListElement extends Component {
  constructor(props) {
    super(props);

    this.state = {
      videoInfo: null,
      loading: true,
    };
  }

  componentDidMount() {
    fetch(VIDEO_INFO_ADDRESS + this.props.videoId)
      .then(response => response.json())
      .then(json => this.setState({videoInfo: json, loading: false}));
  }

  render() {
    if (!this.state.loading && this.state.videoInfo.error) {
      return '';
    }
    return this.state.loading ?
      <div className='video-info'>Loading</div> :
      <PopulatedVideoInfo videoInfo={this.state.videoInfo}
        videoId={this.props.videoId}/>;
  }
}

export default VideosListElement;
