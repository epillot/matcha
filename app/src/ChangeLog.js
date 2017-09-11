import React, { Component } from 'react';
import Chip from 'material-ui/Chip';
import { red500, lightGreen500 } from 'material-ui/styles/colors';

export default class extends Component {

  constructor(props) {
    super(props);
    this.state = {
      logged: props.logged,
      timer: Date.now() - props.ts
    }
    this.mounted = true;
    this.setTimeCounter = this.setTimeCounter.bind(this);
  }

  componentDidMount() {
    if (!this.props.logged) this.setTimeCounter();

    global.socket.on('changelog', ({ id, status: logged, ts }) => {
      if (this.mounted && this.props.id === id) {
        let state = {logged};
        if (!logged) {
          state.timer = Date.now() - ts;
          this.setTimeCounter();
        } else clearInterval(this.timeCounter);
        this.setState(state);
      }
    });
  }

  setTimeCounter() {
    this.timeCounter = setInterval(() => {
      this.setState(state => (
        {timer: state.timer + 60000}
      ));
    }, 60000);
  }

  getOfflineSince(timer) {
    let offset = Math.floor(timer / 1000 / 60);
    if (offset <= 1) return '1mn';
    if (offset < 60) return offset + 'mn';
    offset = Math.floor(offset / 60);
    if (offset === 1) return '1h';
    if (offset < 24) return offset + 'h';
    offset = Math.floor(offset / 24);
    if (offset === 1) return '1day';
    return offset + 'days';
  }

  componentWillUnmount() {
    this.mounted = false;
    if (this.timeCounter) clearInterval(this.timeCounter);
  }

  render() {
    const { logged, timer } = this.state;
    const color = logged ? lightGreen500 : red500;
    return (
      <div>
        <Chip backgroundColor={color}>
          {logged ? 'ONLINE' : `OFFLINE (${this.getOfflineSince(timer)})`}
        </Chip>

      </div>
    );
  }

}
