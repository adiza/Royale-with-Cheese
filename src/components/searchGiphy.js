import React, { Component } from 'react';
import Results from './Results.js'
import PropTypes from 'prop-types';
import './searchGiphy.css';

const searchGifs = (query, callback) => {
  // http://api.giphy.com/v1/gifs/search?q=funny+cat&api_key=dc6zaTOxFJmzC
  const giphyApi = {
    baseUrl: 'http://api.giphy.com',
    searchEndpoint: '/v1/gifs/search',
    publicApiKey: 'PrDuQjBTO5H7jg1eO1xj6sx5zGCsi4Y6',
  }
  const url = giphyApi.baseUrl + giphyApi.searchEndpoint +
    '?api_key=' + giphyApi.publicApiKey +
    '&q=' + query;
  fetch(url, {cors: 'cors', cache: 'no-cache'})
    .then((response) => response.json())
    .then((json) => callback(json['data']));
};

class SearchGiphy extends Component {
  constructor(props) {
    super(props);
    this.state = {
      query: '',
      loading: false,
      results: [],
    }
    this.queryInput = React.createRef();
    this.searchTimeoutId = null;
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.open === this.props.open || !this.props.open) {
      return;
    }
    this.queryInput.current.focus();
  }

  componentWillUnmount() {
    clearInterval(this.intervalId);
  }

  handleSearch = () => {
    searchGifs(this.state.query, (gifs) => {
      // redefine our app's state to include populated response
      this.setState({ results: gifs, loading: false });
    });
  }

  handleChange = (event) => {
    this.setState({ query: event.target.value });
    if (this.searchTimeoutId === null) {
      clearTimeout(this.searchTimeoutId);
    }
    if (event.target.value !== '') {
      this.searchTimeoutId = setTimeout(this.handleSearch, 1500);
      this.setState({ loading: true, });
    } else {
      this.setState({ loading: false });
    }
  }

  render() {
    if (!this.props.open) {
      return '';
    }
    return (
      <div className="giphy-search">
        <div className="search-box">
          <input type="text" placeholder={"enter a search term"} value={this.state.query}
            onChange={this.handleChange} ref={this.queryInput} className="query-input"/>
        </div>
        <Results searchResults={this.state.query ?
            this.state.results : this.props.previouslyUsedGifs }
          onGifClick={this.props.onGifClick}/>
        <h5 className="search-title">
          Choose a gif
          {this.state.loading ? <span className="loading">  loading</span> : ""}
        </h5>

      </div>
    );
  }
}

SearchGiphy.propTypes = {
  open: PropTypes.bool.isRequired,
  onGifClick: PropTypes.func.isRequired,
  closeGifSearch: PropTypes.func,
};

export default SearchGiphy;
