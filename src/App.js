import React, { Component } from 'react';
import './App.css';
import { Switch, Route, Redirect } from 'react-router-dom'

import Game from './Game';
import Start from './Start';
import Toasts from './Toasts/Toasts';

import PropTypes from 'prop-types';
import githubLogo from './assets/img/github-logo.svg';

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
        <h1 className="App-title">Tic tac toe, baby!</h1>
        <Switch>
          <Route exact path={`${process.env.PUBLIC_URL}/`} component={Start}/>
          <Route path={`${process.env.PUBLIC_URL}/game`} component={Game}/>
          <Redirect to='/' />
        </Switch>
        <Toasts />
        <footer className="App-footer">
          <h5>
            <small>This is a project by <a href="mailto:info@nacken.ru">Ru Nacken</a><br />
            The goal is to get the hang of React<br />
            <a href="https://github.com/rnacken/tictactoe" target="_blank">
              <img src={githubLogo} width="30" height="30" alt="github-logo" title="Github" />
            </a>
          </small>
        </h5>
        </footer>
      </div>
    );
  }
}

App.propTypes = {
  ctx: PropTypes.object
}

export default App;
