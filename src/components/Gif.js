import React, { Component } from 'react';
import SuperGif from 'libgif';
import PropTypes from 'prop-types';

class Gif extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isReady: false,
    };

    this.element = React.createRef();
    this.timeoutId = null;
  }

  onEnd = () => {
    if (this.props.duration === 'once') {
      this.props.onEnd();
    }
  }

  componentDidMount() {
    this.wrapper = new SuperGif({
      gif: this.element.current,
      auto_play: this.props.playing,
      progressbar_height: 0,
      loop_mode: this.props.loop,
      on_end: this.onEnd,
      max_width: this.props.width,
    });
    this.wrapper.load(() => this.setState({isReady: true}));
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.playing === this.props.playing || !this.state.isReady) {
      if (this.props.playing && !this.timeoutId &&
        this.props.duration === '5sec') {
        this.timeoutId =
          setTimeout(() => {
            this.props.onEnd();
            this.timeoutId = null;
          }, 5000);
      }
      return;
    }
    if (this.props.playing) {
      this.wrapper.move_to(0);
      this.wrapper.play();
      if (this.props.duration === '5sec' && !this.timeoutId) {
        this.timeoutId = setTimeout(() => {
          this.props.onEnd();
          this.timeoutId = null;
        }, 5000);
      }
    } else {
      this.wrapper.pause();
      clearTimeout(this.timeoutId);
    }
  }

  render() {
    if (!this.props.src) {
      return '';
    }
    const src = this.props.src.slice(0, -"giphy.gif".length) + '200w.gif';
    return (
      <div style={this.props.style} className={this.props.className}>
        <img ref={this.element} src={src} alt={this.props.alt}
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
  duration: 'once',
};

Gif.propTypes = {
  autoPlay: PropTypes.bool,
  src: PropTypes.string,
  style: PropTypes.object,
  loop: PropTypes.bool,
  width: PropTypes.number,
  height: PropTypes.number,
  duration: PropTypes.string,
};

export default Gif;
