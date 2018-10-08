import React, { Component } from 'react';
import './Board.css';
import Tile from './Tile';
import Consumer from './context/appContext';

class Board extends Component {

  render() {
    return (
      <div className="Board">
        <Consumer>
        {ctx => {
          return (ctx.state.game.tiles.map(item => <Tile key={item.id} tile={item}></Tile>));
        }}
        </Consumer>
      </div>
    );
  }
}

export default Board;
