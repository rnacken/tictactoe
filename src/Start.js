import React, { Component } from 'react';
import {
  CSSTransition,
  TransitionGroup,
} from 'react-transition-group';
import Consumer from './context/appContext';
import './Start.css';

class Start extends Component {

  showCurrentPlayers(ctx) {
    if (ctx.state.players.length === 0) {
      return <h4>Currently no players online, register at the top</h4>
    }
    const playerList = ctx.state.players.map(item => <CSSTransition
      key={item.id}
      timeout={500}
      classNames="player-list-animation"><li  className="player-list__item">
      <span className="player-list__item__name">{item.displayName}</span>
      {this.showChallengeStatus(ctx, item)}</li></CSSTransition>);
    return <TransitionGroup component="ul" className="player-list">{playerList}</TransitionGroup>;
  }
  showChallengeStatus(ctx, player) {
    if (!ctx.state.player) {
      return <div className="player-list__item__status player-list__item__status--unregistered">Register first</div>
    }
    const sentChallenge = Object.values(player.challengers || {}).find(item => item === ctx.state.player.id);
    const receivedChallenge = ctx.state.player ?
      Object.values(ctx.state.player.challengers || {}).find(item => item === player.id) :
      false;

    if (player.isMe) {
      return <div className="player-list__item__status player-list__item__status--is-me">This is you</div>
    } else if (player.game) {
      return <div className="player-list__item__status player-list__item__status--is-playing">
        <button disabled="disabled">Is playing</button>
      </div>;
    } else if (receivedChallenge) {
      return <div className="player-list__item__status player-list__item__status--challenged-me">
        <span>You are challenged!</span>
        <button onClick={() => ctx.acceptChallenge(player)}>accept!</button>
      </div>;
    } else if (sentChallenge) {
      return <div className="player-list__item__status player-list__item__status--is-challenged">
        <span>You challenged this player</span><button onClick={() => ctx.cancelChallenge(player)}>cancel</button>
      </div>;
    } else {
      return <div className="player-list__item__status player-list__item__status--unchallenged">
        <button onClick={() => ctx.sendChallenge(player)}>challenge!</button>
      </div>
    }
  }

  render() {
    return (
      <div className="Start">
        <Consumer>
          {ctx =>
            <React.Fragment>
              <h3>Current players:</h3>
              {this.showCurrentPlayers(ctx)}
            </React.Fragment>
          }
        </Consumer>
      </div>
    );
  }
}

export default Start;
