import React, { Component } from 'react';
import './Results.css';
import PropTypes from 'prop-types';

class Results extends Component{
  render() {
    return (
      <div className="Results">
        {this.props.searchResults.map((item, index) => (
          <img className="search-result-gif"
            key={index} src={item.images.fixed_height_small.url}
            onClick={() => this.props.onGifClick(item)} />
          )
        )}
      </div>
    )
  }
};

Results.propTypes = {
  onGifClick: PropTypes.func.isRequired,
};

export default Results;
