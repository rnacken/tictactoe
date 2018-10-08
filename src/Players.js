import React from 'react';
import Consumer from "./context/appContext";

const Players = () => {

  const getPlayerName = (ctx, playerKey) => {
    const playerId = ctx.state.game[playerKey];
    const player = ctx.state.players.find(item => item.id === playerId);
    if (player) {
      return <span className={"players__player players__player--" + playerKey}>{player.displayName}</span>;
    }
  }

  return (
    <div className="Players">
      <Consumer>
        {ctx =>
          <h4>{getPlayerName(ctx, 'player1')}<span className="players__versus">&nbsp;versus&nbsp;</span>{getPlayerName(ctx, 'player2')}</h4>
        }
      </Consumer>
    </div>
  )
}

export default Players;
