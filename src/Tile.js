import React, { Component } from 'react';
import Consumer from './appContext';

import './Tile.css';


class Tile extends Component {

  render() {

    return (
      <div className="Tile">
        <Consumer>
          {game => {
            const tileValue = this.props.tile.value || '';
            const tileGameEnd = this.props.tile.end || '';
            return <div className={"tile-content tile-content--" + tileValue + " tile-content--game-end-" + tileGameEnd}
              onClick={() => game.clickTile(this.props.tile)}>
            </div>
          }}
        </Consumer>
      </div>
    );
  }
}

export default Tile;
