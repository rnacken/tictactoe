import React, { Component } from "react";

const { Provider, Consumer } = React.createContext();
export default Consumer;

const initialState = {
  winner: false,
  turn: 'circle',
  tiles: [{ x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: 2, y: 0 },

    { x: 0, y: 1 },
    { x: 1, y: 1 },
    { x: 2, y: 1 },

    { x: 0, y: 2 },
    { x: 1, y: 2 },
    { x: 2, y: 2 }]
  };

export class AppProvider extends Component {
    state = {
      ...initialState,
      clickTile: (clickedTile) => this.clickTile(clickedTile),
      resetGame: () => this.resetGame()
    };

    resetGame() {
      console.log('reset');
      initialState.tiles.map(item => {
        item.value = false;
        item.end = false;
        return item;
      });
      this.setState(initialState);
    }

    clickTile(clickedTile) {
      if (!clickedTile.value && !this.state.winner) {
        const newTiles = this.state.tiles.map(item => {
          if (item.x === clickedTile.x && item.y === clickedTile.y){
            item.value = this.state.turn;
          }
          return item;
        });
        this.setState({
          tiles: newTiles,
          turn: (this.state.turn === 'circle')? 'cross' : 'circle'
        });

        this.checkWinCondition(this.state.tiles);
      }
    }

    checkWinCondition(tiles) {
      const lines = 3;
      const directions = ['x', 'y'];
      const players = ['circle', 'cross'];
      // check for win-conditions horizontal/vertical
      for (let direction of directions) {
        for (let i=0; i<lines; i++) {
          for (let player of players) {
            let playedTiles = tiles.filter(item => item.value === player
              && item[direction] === i);
            if (playedTiles.length >= 3) {
              playedTiles.map(item => item.end = true);
              this.endGame(player, tiles);
              return true;
            }
          }
        }
      }
      // check for diagonal win
      const diagonals = [0, 2];
      for (let diagonal of diagonals) {
          for (let player of players) {
            let playedTiles = tiles.filter(item => item.value === player
              && item.x === Math.abs(item.y - diagonal));
            if (playedTiles.length >= 3) {
              playedTiles.map(item => item.end = true);
              this.endGame(player, tiles);
              return true;
            }
        }
      }

      if (tiles.filter(item => item.value).length >= 9) {
        // all tiles are clicked, but no line of 3 - remise!
        this.endGame('remise', tiles);
      }
    }

    endGame(player, tiles) {
      // tiles
      this.setState({
        winner: player,
        tiles: tiles
      });
    }

    render() {
        return (
            <Provider value={this.state}>
                {this.props.children}
            </Provider>
        );
    }
}
