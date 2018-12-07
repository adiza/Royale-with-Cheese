import React, { Component } from 'react';
import Results from './Results.js'

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

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentText: " ",
      data: null,
      query: '',
      value: null,
      results: [],
      searched: true
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(event) {
    event.preventDefault();
    searchGifs(this.state.query, (gifs) => {
      console.log('gifs from search resposne', gifs);
      // redefine our app's state to include populated response
      this.setState({
        results: gifs,
        searched: true // flip the switch
      });
    });
  }

  handleChange(event){
    this.setState({query: event.target.value});
    console.log("this is the updated query:", event.target.value);
  }

  changeText(currentText) {
    this.setState({currentText});
  }

  render() {
    return (
      <div>
        <div className="search-box">
          <input type="text" placeholder={"enter a search term"} value={this.state.value} onChange={this.handleChange}/>
          <button onClick={this.handleClick} className="btn btn-primary">Search</button>
        </div>

        <Results searchResults={this.state.results}/>
      </div>
    );
  }
}

export default App;
