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
          videoIds: Array.from(new Set(
            json.map((video) => video.videoId).filter(x => x))),
          loading: false,
        });
      });
  }

  hideList = (e) => {
    e.preventDefault();
    if (this.props.onHide) {
      this.props.onHide();
    }
  }

  render() {
    return (
      <div className='videos-list'
        style={{visibility: !this.props.visible && 'hidden'}}>
        <button href="#" onClick={this.hideList} className="hide-link">
          Hide
        </button>
        {this.state.loading && <div className="results-loading">Loading</div>}
        {this.state.videoIds.map((videoId) =>
          <VideosListElement videoId={videoId} />)
        }
      </div>
    );
  }
}

export default VideosList;
