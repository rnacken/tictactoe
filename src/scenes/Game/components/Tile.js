import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Consumer from '../../../context/appContext';

import './Tile.css';


class Tile extends Component {

  render() {

    return (
      <div className="Tile">
        <Consumer>
          {game => {
            const tileValue = this.props.tile.value;
            const tileGameEnd = this.props.tile.end;
            return <div className={"tile-content tile-content--" + tileValue + " tile-content--game-end-" + tileGameEnd}
              onClick={() => game.clickTile(this.props.tile)}>
            </div>
          }}
        </Consumer>
      </div>
    );
  }
}

Tile.proptypes = {
  tile: PropTypes.shape({
    value: PropTypes.number,
    end: PropTypes.bool
  })
}

export default Tile;
