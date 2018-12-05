import React, { Component } from 'react';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      initialState: "Search for giphies",
      currentText: " "
    }
  }

  changeText(currentText) {
  this.setState({currentText});
  //console.log({currentText});
  }


  render() {
    
    return (
      <div className="App container">


        <div class="search-box">
              <input type="text" placeholder={this.state.initialState} /*onChange={this.changeText.bind(this, 'currentText')}*/ />
              <button /*onClick={this.changeText.bind(this, 'currentText')}*/ className="btn btn-primary">Search</button>
            </div>
          <h1>Hello, world!</h1>


      </div>



    );
  }
}

export default App;
