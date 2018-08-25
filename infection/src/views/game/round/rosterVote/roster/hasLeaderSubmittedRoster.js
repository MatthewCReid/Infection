import React from 'react';

import Roster from './roster';
import RosterVote from '../rosterVote';

const HasLeaderSubmittedRoster = ({
  game,
  handleSelectRosterEntryClick,
  handleSubmitRoster,
  handleRosterVote,
}) =>
  game.leaderSubmitRoster
    ? <RosterVote
      rosterApproved={game.rosterApproved}
      missionRoster={game.missionRoster}
      leader={game.leader}
      handleRosterVote={handleRosterVote}
      votedOnRoster={game.votedOnRoster}
      allUsersVotedOnRoster={game.allUsersVotedOnRoster}
      usersVoteRecord={game.usersVoteRecord}
    ></RosterVote>
    : <Roster
      game={game}
      handleSelectRosterEntryClick={handleSelectRosterEntryClick}
      handleSubmitRoster={handleSubmitRoster}
    ></Roster>


export default HasLeaderSubmittedRoster;