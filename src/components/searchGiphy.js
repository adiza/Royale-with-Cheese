import React, { Component } from 'react';
import $ from 'jquery';
import Results from '../Results.js'
//const giphy_api_key = "api_key=PrDuQjBTO5H7jg1eO1xj6sx5zGCsi4Y6";

  const searchGifs = (query) => {
  // http://api.giphy.com/v1/gifs/search?q=funny+cat&api_key=dc6zaTOxFJmzC
  const giphyApi = {
    baseUrl: 'http://api.giphy.com',
    searchEndpoint: '/v1/gifs/search',
    publicApiKey: 'PrDuQjBTO5H7jg1eO1xj6sx5zGCsi4Y6'
  }

  return $.ajax({
    url: giphyApi.baseUrl + giphyApi.searchEndpoint,
    method: 'GET',
    data: {
      api_key: giphyApi.publicApiKey,
      q: query
    }
  }).then((response) =>
    response['data']
  );
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
/*
  componentDidMount() {

    searchGifs('h').then((gifs) => {
      console.log('gifs from search resposne', gifs);
      // redefine our app's state to include populated response
      this.setState({
        results: gifs,
        searched: true // flip the switch
      });
    });
  }
  */
    //componentDidMount(){
      //var url = 'api.giphy.com/v1/gifs/search?api_key=PrDuQjBTO5H7jg1eO1xj6sx5zGCsi4Y6&q=cheeseburgers&limit=2';
      //fetch(url).then((response) => /*response.json()*/ console.log(response['data']))
         // .then(function(data) { })
         // .catch((error) => console.log(error));
 // }
  


  
   performSearch() {
    console.log("Perform search using giphy")
    const urlString = "api.giphy.com/v1/gifs/search?api_key=PrDuQjBTO5H7jg1eO1xj6sx5zGCsi4Y6&q=cheeseburgers&limit=2";
    $.ajax({
      url: urlString,
      success: (searchResults) => {

        console.log(typeof(searchResults))
        console.log("this is the string " + searchResults['data'] + "duh")
      },
      error:(xhr, status, err) => {
        console.error("Failed to fetch data")
      }
    })    
  }






  handleClick(event) {
    event.preventDefault();
    //console.log('searched!', ${this.state.query});
    searchGifs(this.state.query).then((gifs) => {
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
  //console.log({currentText});
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

