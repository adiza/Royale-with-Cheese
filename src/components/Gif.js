import React, { Component } from 'react';
import SuperGif from 'libgif';
import PropTypes from 'prop-types';

class Gif extends Component {
  constructor(props) {
    super(props);

    this.element = React.createRef();
  }

  componentDidMount() {
    this.element.current.width = 10;
    this.element.current.height = 10;
    this.wrapper = new SuperGif({
      gif: this.element.current,
      auto_play: this.props.autoPlay,
      progressbar_height: 0,
      loop_mode: this.props.loop,
      on_end: this.props.onEnd,
      max_width: this.props.width,
    });
    this.wrapper.load();
  }

  render() {
    if (!this.props.src) {
      return '';
    }
    return (
      <div style={this.props.style} className={this.props.className}>
        <img ref={this.element} src={this.props.src} alt={this.props.alt}
          width={this.props.width} height={this.props.height} />
      </div>
    )
  }
}

Gif.defaultProps = {
  autoPlay: false,
  src: null,
  style: {},
  loop: false,
  width: null,
  height: null,
};

Gif.propTypes = {
  autoPlay: PropTypes.bool,
  src: PropTypes.string,
  style: PropTypes.object,
  loop: PropTypes.bool,
  width: PropTypes.number,
  height: PropTypes.number,
};

export default Gif;
