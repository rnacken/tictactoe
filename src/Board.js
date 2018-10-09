import React, { Component } from 'react';
import './Board.css';
import Tile from './Tile';
import Consumer from './context/appContext';

class Board extends Component {

  render() {
    return (
      <div className="Board">
        <div className="Board-tiles">
          <Consumer>
          {ctx => {
            return (ctx.state.game.tiles.map(item => <Tile key={item.id} tile={item}></Tile>));
          }}
          </Consumer>
        </div>
      </div>
    );
  }
}

export default Board;
