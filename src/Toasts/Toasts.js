import React from 'react';
import {
  CSSTransition,
  TransitionGroup,
} from 'react-transition-group';
import Consumer from './../context/appContext';
import Toast from "./Toast";
import './Toasts.css';

const Toasts = () => (
  <Consumer>
    {ctx => (
      <TransitionGroup className="toasts" id="toasts-list">
      {ctx.state.toasts.map(toast =>
        <CSSTransition
          key={toast.id}
          timeout={500}
          classNames="toast-animation">
          <Toast {...toast} key={toast.id} />
        </CSSTransition>
      )}
    </TransitionGroup>
    )}
  </Consumer>
)


export default Toasts;
