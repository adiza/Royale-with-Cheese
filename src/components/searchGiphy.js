import React, { Component } from 'react';
import $ from 'jquery';
//const giphy_api_key = "api_key=PrDuQjBTO5H7jg1eO1xj6sx5zGCsi4Y6";

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      currentText: " ",
      data: null,
      value: 0,
      items: [],
    }
        //this.performSearch()

  }
    componentDidMount(){
      var url = 'api.giphy.com/v1/gifs/search?api_key=PrDuQjBTO5H7jg1eO1xj6sx5zGCsi4Y6&q=cheeseburgers&limit=2';
      fetch(url).then((response) => /*response.json()*/ console.log(response[data]))
          .then(function(data) { /* do stuff with your JSON data */})
          .catch((error) => console.log(error));
  }

  performSearch() {
    console.log("Perform search using giphy")
    const urlString = "api.giphy.com/v1/gifs/search?api_key=PrDuQjBTO5H7jg1eO1xj6sx5zGCsi4Y6&q=cheeseburgers&limit=2";
    $.ajax({
      url: urlString,
      success: (searchResults) => {

        console.log(typeof(searchResults))
        console.log("this is the string " + searchResults + "duh")
      },
      error:(xhr, status, err) => {
        console.error("Failed to fetch data")
      }
    })    
  }






  handleClick() {
    console.log(this.state.currentText);
  }


  changeText(currentText) {
  this.setState({currentText});
  //console.log({currentText});
  }


  render() {
    
    return (
      <div>

        <div className="search-box">
              <input type="text" placeholder={"Search for giphies"} /*onChange={}*/ />
              <button onClick={this.state.handleClick} className="btn btn-primary">Search</button>
        </div>
      </div>





    );
  }
}

export default App;

