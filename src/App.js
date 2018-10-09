import React, { Component } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom'
import PropTypes from 'prop-types';

import Game from './scenes/Game/';
import Start from './scenes/Start/';
import Toasts from './Toasts/Toasts';

import githubLogo from './assets/img/github-logo.svg';
import './App.css';


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
        <main className="App-main">
          <h1 className="App-title">Tic tac toe, baby!</h1>
          <Switch>
            <Route exact path={`${process.env.PUBLIC_URL}/`} component={Start}/>
            <Route path={`${process.env.PUBLIC_URL}/game`} component={Game}/>
            <Redirect to='/' />
          </Switch>
          <Toasts />
        </main>
        <footer className="App-footer">
          <h5>
            <small>This is a project by <a href="mailto:info@nacken.ru">nacken.ru</a><br />
            The goal is to get the hang of React (+ router, transitions) and Firebase<br /><br />
            <a href="https://github.com/rnacken/tictactoe" target="_blank" rel="noopener noreferrer">
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
