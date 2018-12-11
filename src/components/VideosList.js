import React, { Component } from 'react';
import './VideosList.css';
import VideosListElement from './VideosListElement';
import { SERVER_ADDRESS } from '../constants';

class VideosList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      videoIds: []
    };
  }

  componentDidMount() {
    fetch(SERVER_ADDRESS+'/videos')
      .then(response => response.json())
      .then(json => {
        this.setState({
          videoIds: Array.from(new Set(json.map((video) => video.videoId))),
          loading: false,
        });
      });
  }

  hideList = (e) => {
    e.preventDefault();
    console.log('click');
    if (this.props.onHide) {
      this.props.onHide();
    }
  }

  render() {
    return (
      <div className='videos-list'>
        <button href="#" onClick={this.hideList} className="hide-link">
          Hide
        </button>
        {this.state.videoIds.map((videoId) =>
          <VideosListElement videoId={videoId} />)
        }
      </div>
    );
  }
}

export default VideosList;
