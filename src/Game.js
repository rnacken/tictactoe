import React, { Component } from 'react';
import Board from './Board';
import Players from './Players';
import Consumer from "./context/appContext";
import './Game.css';

class Game extends Component {

  wonGame(ctx) {
    return (ctx.state.game.player1IsMe && ctx.state.game.winner === 1) ||
      (!ctx.state.game.player1IsMe && ctx.state.game.winner === 2);
  }

  getWinnerMessage(ctx) {
    if (!ctx.state.game) {
      return null;
    }
    switch(ctx.state.game.winner) {
      case 3:
      return <h2>It is a draw!</h2>;
      case 1:
      case 2:
      return this.wonGame(ctx) ?
        <h2 className={'app-message--' + ctx.state.game.winner}>You won!</h2> :
        <h2>You lost...</h2>;
      default:
      return (ctx.state.game.player1IsMe && ctx.state.game.turn === 1) ||
        (!ctx.state.game.player1IsMe && ctx.state.game.turn === 2)?
        <h2 className={'app-message--' + ctx.state.game.turn}>It is your turn</h2> :
        <h2 className={'app-message--' + ctx.state.game.turn}>It is opponents turn</h2>;
    }
  }

  render() {
    return (
      <div className="Game">
        <Players />
        <Board />
        <Consumer>
          {ctx => <React.Fragment>
            {this.getWinnerMessage(ctx)}
            {!ctx.state.game.winner && <button onClick={ctx.concedeGame}>concede</button>}
            {ctx.state.game.winner >= 1 && !this.wonGame(ctx) && <button onClick={ctx.revancheGame}>revanche</button>}&nbsp;
            {ctx.state.game.winner >= 1 && <button onClick={ctx.exitGame}>exit</button>}
          </React.Fragment>}
        </Consumer>
      </div>
    );
  }
}

export default Game;
