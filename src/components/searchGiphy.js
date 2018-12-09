import React, { Component } from 'react';
import Results from './Results.js'
import PropTypes from 'prop-types';
import './searchGiphy.css';

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
    this.queryInput = React.createRef();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.open == this.props.open || !this.props.open) {
      return;
    }
    this.queryInput.current.focus();
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
    this.setState({ searchTimeoutId: setTimeout(this.handleSearch, 1500) });
  }

  render() {
    if (!this.props.open) {
      return '';
    }
    return (
      <div className="giphy-search">
        <h5 className="search-title">
          {this.state.query ? "Search results" : "Previously used gifs" }
        </h5>
        <Results searchResults={this.state.results} onGifClick={this.props.onGifClick}/>

        <div className="search-box">
          <input type="text" placeholder={"enter a search term"} value={this.state.query}
            onChange={this.handleChange} ref={this.queryInput} className="query-input"/>
        </div>
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
