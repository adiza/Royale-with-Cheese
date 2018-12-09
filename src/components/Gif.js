import React, { Component } from 'react';
import SuperGif from 'libgif';
import PropTypes from 'prop-types';

class Gif extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isReady: false
    };

    this.element = React.createRef();
  }

  componentDidMount() {
    this.wrapper = new SuperGif({
      gif: this.element.current,
      auto_play: this.props.playing,
      progressbar_height: 0,
      loop_mode: this.props.loop,
      on_end: this.props.onEnd,
      max_width: this.props.width,
    });
    this.wrapper.load(() => this.setState({isReady: true}));
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.playing === this.props.playing || !this.state.isReady) {
      return;
    }
    if (this.props.playing) {
      this.wrapper.move_to(0);
      this.wrapper.play();
    } else {
      this.wrapper.pause();
    }
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
