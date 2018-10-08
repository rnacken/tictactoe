import React, { Component } from 'react';
import './App.css';
import { Switch, Route, Redirect } from 'react-router-dom'

import Game from './Game';
import Start from './Start';
import Toasts from './Toasts/Toasts';

import PropTypes from 'prop-types';

class App extends Component {

  render() {
    return (
      <div className="App">
        <header className="App-nav">
          {this.props.ctx.state.player ?
            <React.Fragment>
              <button className="App-nav__logout-btn" onClick={this.props.ctx.logout}>Log Out</button>
            </React.Fragment>
            :
            <React.Fragment>
              <h4>Enter your name</h4>
              <form onSubmit={(e) => this.props.ctx.login(e)}>
                <input type="text" className="App-nav__input-name" placeholder="Your name" value={this.props.ctx.state.myName} onChange={this.props.ctx.updateMyName.bind(this)} />
                <input type="submit" className="App-nav__login-btn" value="Register" />
              </form>
            </React.Fragment>
          }
        </header>
        <h1 className="App-title">Tic tac toe 2</h1>
            <Switch>
              <Route exact path='/' component={Start}/>
              <Route path='/game' component={Game}/>
              <Redirect to='/' />
            </Switch>
            <Toasts />
      </div>
    );
  }
}

App.propTypes = {
  ctx: PropTypes.object
}

export default App;
