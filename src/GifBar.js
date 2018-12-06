import React from 'react';
import './App.css';

class GifBar extends React.Component {
	
	constructor(props) {
		super(props);
		this.handleHover = this.handleHover.bind(this);
	}

	handleHover(e) {
		const url = e.target.src;
		this.props.onHover(url);
	}

	render() {
		return (
			<div className={this.props.className}>
			  <img className="smallGif" onMouseOver={this.handleHover} src="https://media.giphy.com/media/2bV8SBlxOiU2NityCb/giphy.gif" />
			  <img className="smallGif" onMouseOver={this.handleHover} src="https://media.giphy.com/media/Bo0ZNexSCyy9JyOXbW/giphy.gif" />
			  <img className="smallGif" onMouseOver={this.handleHover} src="https://media.giphy.com/media/l4tUX3sa1D9ndNcQg/giphy.gif" />
			</div>);
	}
};

export default GifBar;
