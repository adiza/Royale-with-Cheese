import React, { Component } from 'react';
import Results from './Results.js'
import PropTypes from 'prop-types';

const searchGifs = (query, callback) => {
  // http://api.giphy.com/v1/gifs/search?q=funny+cat&api_key=dc6zaTOxFJmzC
  const giphyApi = {
    baseUrl: 'http://api.giphy.com',
    searchEndpoint: '/v1/gifs/search',
    publicApiKey: 'PrDuQjBTO5H7jg1eO1xj6sx5zGCsi4Y6'
  }
  const url = giphyApi.baseUrl + giphyApi.searchEndpoint +
    '?api_key=' + giphyApi.publicApiKey +
    '&q=' + query;
  fetch(url)
    .then((response) => response.json())
    .then((json) => callback(json['data']));
};

class SearchGiphy extends Component {
  constructor(props) {
    super(props);
    this.state = {
      query: '',
      results: [],
      searchTimeoutId: null,
    }
  }

  handleSearch = () => {
    searchGifs(this.state.query, (gifs) => {
      // redefine our app's state to include populated response
      this.setState({ results: gifs });
    });
  }

  handleChange = (event) => {
    this.setState({ query: event.target.value });
    if (this.searchTimeoutId) {
      clearTimeout(this.searchTimeoutId);
    }
    this.setState({ searchTimeoutId: setTimeout(this.handleSearch, 500) });
  }

  render() {
    return (
      <div className="giphy-search">
        <Results searchResults={this.state.results} onGifClick={this.props.onGifClick}/>

        <div className="search-box">
          <input type="text" placeholder={"enter a search term"} value={this.state.query} onChange={this.handleChange}/>
          <button type="button" className="btn btn-primary" onClick={this.props.closeGif}> CLOSE </button>
        </div>
      </div>
    );
  }
}

SearchGiphy.propTypes = {
  onGifClick: PropTypes.func.isRequired,
};

export default SearchGiphy;
