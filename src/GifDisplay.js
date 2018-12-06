import React from 'react';
import './App.css';

class GifDisplay extends React.Component {

	render() {
		return <img className="gifPlayer" src={this.props.url} alt="gif" />;
	}

};

export default GifDisplay;
