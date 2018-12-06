import React, { Component } from 'react';
//import './Results.css';

class Results extends Component{
  render() {
    return (
      <div className="Results">
        {this.props.searchResults.map((item, index) => (
            <div key={index}>
              <img
                className="img-thumbnail"
                src={item.images.fixed_height_small.url}
              />
              <p>Source: <a href={item.source}>{item.source}</a></p>
            </div>
          )
        )}
      </div>
    )
  }
};

export default Results;
