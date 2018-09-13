import React, { Component } from 'react';
import './Board.css';
import Tile from './Tile';
import Consumer from './appContext';

class Board extends Component {

  render() {
    return (
      <div className="Board">
        <Consumer>
        {game => {
          return (game.tiles.map((item, i) => <Tile key={i} tile={item}></Tile>));
        }}
        </Consumer>
      </div>
    );
  }
}

export default Board;
