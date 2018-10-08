import React, { Component } from 'react';

class Toast extends Component {

  showToast() {
    if (this.props.text) {
      return <p className="toast__content">{this.props.text}</p>;
    }
  }

  render() {
    return (<div className="toast">
      {this.showToast()}
    </div>);
  }

  shouldComponentUpdate() {
    return false;
  }
}

export default Toast;
