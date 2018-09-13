import React, { Component } from 'react';
import './App.css';
import Board from './Board';
import Consumer, { AppProvider } from "./appContext";

class App extends Component {

  getWinnerMessage(game) {
    switch(game.winner) {
      case 'remise':
      return <h2>It is a draw!</h2>;
      case 'cross':
      case 'circle':
      return <h2 className={'app-message--' + game.winner}>Player <span>{game.winner}</span> has won!</h2>;
      default:
      return <h2 className={'app-message--' + game.turn}>It's player <span>{game.turn}</span> turn</h2>;
    }
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Tic Tac Toe</h1>
        </header>
        <AppProvider>
          <Board />
          <Consumer>
            {game => <div>
                {this.getWinnerMessage(game)}
                <button onClick={() => game.resetGame()}>Reset</button>
              </div>
            } 
          </Consumer>
        </AppProvider>
      </div>
    );
  }
}

export default App;
