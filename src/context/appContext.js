import React, { Component } from "react";
import database, { auth } from './firebase.js';
import history from './../history';

const { Provider, Consumer } = React.createContext();
export default Consumer;

const idleDuration = 3000 // seconds
let playersLoaded = false;

let toastCounter = 0;
let loggedIn = false;

const initialState = {
  myName: '',
  players: [],
  player: null,
  game: {
    turn: 1,
    tiles: [
      { id: 'lt', x: 0, y: 0 },
      { id: 'mt', x: 1, y: 0 },
      { id: 'rt', x: 2, y: 0 },

      { id: 'lm', x: 0, y: 1 },
      { id: 'mm', x: 1, y: 1 },
      { id: 'rm', x: 2, y: 1 },

      { id: 'lb', x: 0, y: 2 },
      { id: 'mb', x: 1, y: 2 },
      { id: 'rb', x: 2, y: 2 }
    ]
  },
  toasts: []
};

export class AppProvider extends Component {

    state = initialState;

    constructor(props) {
      super(props);
      history.push('/');  // set route to home
    }

    componentDidMount() {
      this.checkLoggedIn();
      this.subscribePlayers();
    }

    componentDidUpdate(prevProps, prevState) {
      if (prevState.player && this.state.player) {
        // check if you are challenged by a new player
        if (this.state.player.challengers) {
          const challengersNow = Array.isArray(this.state.player.challengers) ?
          this.state.player.challengers : Object.values(this.state.player.challengers);
          const challengersThen = prevState.player.challengers ? (Array.isArray(prevState.player.challengers) ?
          prevState.player.challengers : Object.values(prevState.player.challengers)) : [];

          const uniqueChallengersNow = challengersNow.filter(challenger => !challengersThen.includes(challenger));

          if (this.state.players) {
            for (let newChallenger of uniqueChallengersNow) {
              const challenger = this.state.players.find(item => item.id === newChallenger);
              if (challenger) {
                this.addToast(`You are challenged by ${challenger.displayName}`);
              }
            }
          }
        }
        // check if entered a game
        if (this.state.player.game) {
          if (this.state.player.game !== prevState.player.game) {
            this.addToast(`You entered the game!`);
          }
        }
      }

    }

    updateMyName(event) {
      this.setState({
        myName: event.target.value
      });
    }

    clickTile(clickedTile) {
      const myTurn = (this.state.game.turn === 1 && this.state.game.player1IsMe) || (this.state.game.turn === 2 && !this.state.game.player1IsMe);
      if (myTurn && !clickedTile.value && !this.state.game.winner) {
        const newTiles = this.state.game.tiles.map(item => {
          if (item.x === clickedTile.x && item.y === clickedTile.y){
            item.value = this.state.game.turn;
          }
          return item;
        });
        database.ref(`games/${this.state.player.game}`).update({
          ...this.state.game,
          tiles: newTiles,
          turn: (this.state.game.turn === 1)? 2 : 1
        });
      }
    }

    checkWinCondition(tiles) {
      const lines = 3;
      const directions = ['x', 'y'];
      const players = [1, 2];
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
        this.endGame(3, tiles);
      }
    }

    endGame(player, tiles) {
      // tiles
      this.setState({
        game: {
          ...this.state.game,
          winner: player,
          tiles: tiles
        }
      });
    }

    login(e) {
      e.preventDefault();
      console.log('fghsj')
      // check if myName is not already taken
      if (this.state.players && this.state.players.filter(item => item.displayName === this.state.myName).length > 0) {
        this.addToast(`Name ${this.state.myName} already taken`);
        this.setState({ myName: '' });
      } else {
        auth.signInAnonymously().then((user) => {
          this.setPlayer({...user, displayName: this.state.myName});
          auth.currentUser.updateProfile({
            displayName: this.state.myName
          });
          loggedIn = true;
        }).catch(function(error) {
          // todo: catch err
        });
      }
    }

    logout() {
      if (this.state.player && this.state.player.id) {
        this.concedeGame();
        this.removePlayer(this.state.player.id); // remove from database
        // remove locally
        this.setState({
          player: null,
          players: this.state.players.filter(item => item.id !== this.state.player.id)
        });
      } else {
        this.setState({
          player: null
        });

      }
      history.push('/');
      auth.currentUser.delete();
      auth.signOut().then(() => {
        //this.subscribePlayers();  
        loggedIn = false;
      });
    }

    addPlayerToList(player) {
      // check if user is already in the list: update it.
      const playerInList = this.state.players.find(item => item.displayName === player.displayName)
      if (this.state.players && playerInList) {
        // existing user
        this.setState({
          player: { ...this.state.player, playerInList, isMe: null }
        })
      } else {
        // new user
        database.ref('players/').push(player);
      }
    }

    removePlayer(id) {
      if (this.state.player) {
        database.ref(`players/${id}`).remove();
      }
    }

    subscribePlayers() {
      const playersRef = database.ref('players/');
      playersRef.on('value', (snapshot) => {
        const players = snapshot.val();
        let newPlayers = [];
        for (let player in players) {
          newPlayers.push({
            id: player,
            displayName: players[player].displayName,
            updated: players[player].updated || new Date().getTime(),
            challengers: players[player].challengers || null,
            game: players[player].game || null
          });
        }
        this.setState({
          players: newPlayers
        }, () => {
          playersLoaded = true;
          if (this.state.player) {
            this.checkIdlePlayers(this.state.players);
            // check if I am still in the list, or was idle for too long
            let playerId = null;
            const playersWithIsMeProp = this.state.players.map(item => {
              if (this.state.player.displayName === item.displayName) {
                playerId = item.id;
                item.isMe = true;
              }
              return item;
            });
            if (playerId) {
              const player = this.state.players.find(item => item.id === playerId);
              this.setState({
                players: playersWithIsMeProp,
                player
              }, () => {
                if (this.state.player.game) {
                  //playersRef.off(); // stop listening to player-updates
                  this.startGame();
                }
              });
            } else {
              // player was idle for too long; logout
              this.addToast(`You were logged out after being inactive`);
              this.logout();
            }
          } else {
            // not yet a player / clicked log out
            if (loggedIn) {
              this.logout();
              this.addToast(`You logged out`);
            }
          }
        });
      });
    }

    checkLoggedIn() {
      auth.onAuthStateChanged(user => {
        if (user) {
          loggedIn = true;
          this.setPlayer(user);
        } else {
          this.logout();
        }
        //history.push('/');
        // todo: check for game here?
      });
    }

    setPlayer(player) {
      const newPlayer = {
        displayName: player.displayName || this.state.myName,
        updated: new Date().getTime(),
        challengers: [],
        isMe: true
      }
      this.setState({ player: {...this.state.player, ...newPlayer} }, () => {
        if (this.state.players && playersLoaded && !this.state.players.find(item => item.displayName === this.state.player.displayName)) {
          // if user is not already in the list
          this.addPlayerToList(this.state.player);
        }
        // Todo: check if user is already in a game.
        if (this.state.player.game) {
          history.push('/game');
        }
      });
    }

    checkIdlePlayers(players) {
      for (let item of players) {
        if ((item.updated || 0) + idleDuration * 1000 < new Date().getTime()) {
          this.removePlayer(item.id);
        }
      }
    }

    checkIdleGames(players) {
      const gamesRef = database.ref('games/');
      gamesRef.once('value', (snapshot) => {
        const games = snapshot.val();
        for (let game in games) {
          let playerCount = 0;
          for (let player of [games[game].player1, games[game].player2]) {
            if (players.find(item => item.id === player && item.game === game)) {
              playerCount += 1;
            }
          }
          if (playerCount < 2) {
            // remove game
            database.ref(`games/${game}`).remove();
          }
        }
      });
    }

    sendChallenge(targetPlayer) {
      if (!targetPlayer.challengers || !Object.values(targetPlayer.challengers || {}).find(item => item === this.state.player.id)) {
        // not yet challenged by this user
        for (let item of this.state.players) {
          if (item.id === targetPlayer.id) {
             database.ref(`players/${item.id}/challengers`).push(this.state.player.id);
          }
        }
        this.addToast(`You challenged ${targetPlayer.displayName}!`);
      }
    }

    acceptChallenge(targetPlayer) {
      // determine cross/cirlce player
      const playerStarts = (Math.floor(Math.random() * 2) === 0);

      const game = database.ref(`games/`).push({
        ...initialState.game,
        player1: playerStarts? this.state.player.id : targetPlayer.id,
        player2: playerStarts? targetPlayer.id : this.state.player.id,
      });
      // update db.users with game key
      database.ref(`players/${targetPlayer.id}`).update({
        ...targetPlayer,
        challengers: null,
        game: game.key,
        updated: new Date().getTime()
      });
      database.ref(`players/${this.state.player.id}`).update({
        ...this.state.player,
        challengers: null,
        game: game.key,
        updated: new Date().getTime()
      });
      history.push('/game');
    }

    cancelChallenge(targetPlayer) {
      for (let item of this.state.players) {
        if (targetPlayer.id === item.id) {
          let challengerKey = false;
          item.challengers = Object.keys(item.challengers || {}).filter(key => {
            if (item.challengers[key] !== this.state.player.id) {
              // keep it
              return true;
            } else {
              // ditch it, but keep the key, for the database
              challengerKey = key;
              return false;
            }
          });
          if (challengerKey) {
            this.addToast(`You canceled your challenge of ${targetPlayer.displayName}!`)
            database.ref(`players/${item.id}/challengers/${challengerKey}`).remove();
          }
        }
      }
    }

    startGame() {
      if (this.state.player.game) {
        const gameRef = database.ref(`games/${this.state.player.game}`);
        gameRef.on('value', (snapshot) => {
          if (this.state.player && this.state.player.id) {
            const game = snapshot.val();
            if (game) {
              this.setState({
                game: {
                  ...initialState.game,
                  ...game,
                  player1IsMe: (game.player1 === this.state.player.id)
                }
              }, () => {
                this.checkIdleGames(this.state.players);
                this.checkWinCondition(this.state.game.tiles);
              })
              history.push('/game');
            } else {
              // remove game-state from database
              database.ref(`players/${this.state.player.id}/game`).remove();
              // if user is still in game-view, this should not update, since the listener is off
            }
          }
        });
      }
    }

    concedeGame() {
      if (this.state.player && this.state.player.game) {
        this.addToast(`You conceded...`)
        database.ref(`games/${this.state.player.game}`).update({
          ...this.state.game,
          player1IsMe: null,
          winner: this.state.game.player1IsMe ? 2 : 1,
          conceded: true
        });
      }
    }

    exitGame() {
      if (this.state.player && this.state.player.id) {
        database.ref(`players/${this.state.player.id}`).update({
          ...this.state.player,
          game: null
        });
        this.subscribePlayers();
        history.push('/');
      }
    }

    revancheGame() {
      this.addToast(`You asked for a revanche match!`);
      const randomTurn = Math.floor(Math.random() * 2) + 1;
      database.ref(`games/${this.state.player.game}`).update({
        turn: randomTurn, // random choose 1 or 2
        tiles: initialState.game.tiles,
        winner: null
      });
    }

    addToast(text) {
      const id = toastCounter;
      this.setState({
        toasts: this.state.toasts.concat({
          text,
          id
        })
      }, () => {
        window.setTimeout(() => {
          this.removeToast(id);
        }, 2000);
      });
      toastCounter++;
    }

    removeToast(id) {
      this.setState({
        toasts: this.state.toasts.filter(item => item.id !== id)
      });
    }

    render() {
      return (
          <Provider value={{
            state: this.state,
            updateMyName: event => this.updateMyName(event),
            clickTile: clickedTile => this.clickTile(clickedTile),
            login: e => this.login(e),
            logout: () => this.logout(),
            sendChallenge: targetPlayer => this.sendChallenge(targetPlayer),
            acceptChallenge: targetPlayer => this.acceptChallenge(targetPlayer),
            cancelChallenge: targetPlayer => this.cancelChallenge(targetPlayer),
            exitGame: () => this.exitGame(),
            revancheGame: () => this.revancheGame(),
            concedeGame: () => this.concedeGame(),
            addToast: text => this.addToast(text),
            removeToast: id => this.removeToast(id)
            }}>
              {this.props.children}
          </Provider>
    );
  }
}
