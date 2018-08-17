import React, { Component} from 'react';

import Roles from '../../views/withProps/roles';
import Round from './../../views/withProps/round';
import socket from '../../socket';

class Game extends Component {
  constructor(props) {
    super(props);

    this.checkGameStatus = this.checkGameStatus.bind(this);

    this.state = {
      username: 
      // this.props.username,
        'Paul',
      infiltrator: 
        // this.props.infiltrator,
        true,
      round: 
      // this.props.round,
        1,
      leader: 
      // this.props.leader,
        "Paul",
        // null,
      team: 
        // this.props.team || [],
        ['Paul', 'Mark', 'Athena', 'Matt'],
      missionRoster: this.props.missionRoster || [],
        // ['Paul', 'Mark', 'Athena'],
      missionActive:
        false,
        // true,
    }
    
  }
  componentDidMount() {
    this.checkGameStatus();
  }

  checkGameStatus(){
    socket.on('game start', (players) => {
      console.log(players, 'players');
    })
    socket.on('start round', (data) => {
      this.setState({ round: data.round, leader: data.leader })
    })
    socket.on('team chosen', (team) => {
      this.setState({ missionRoster: team }, () => {
        console.log(this.state.missionRoster, 'missionRoster updated from server');
      })
    })
  }

  handleSelectRosterEntryClick(member) {
    this.state.missionRoster.length === 3
      ? console.log(this.state.missionRoster)
      : this.state.missionRoster.includes(member)
        ? console.log(this.state.missionRoster)
        : this.setState({ missionRoster: [...this.state.missionRoster, member] });
  }

  handleSubmitRoster() {
    socket.emit('deploy team', this.state.missionRoster)
    this.setState({ missionActive: true }, () => {
      console.log(this.state.missionActive)
    });
    
    

  }
  
  render() {
    return <div className="game">Gimme some props
    {
      this.state.round < 1 
        ? <Roles infiltrator={this.state.infiltrator}></Roles> 
        : <Round 
            game={this.state}
            handleSelectRosterEntryClick={this.handleSelectRosterEntryClick.bind(this)}
            handleSubmitRoster={this.handleSubmitRoster.bind(this)}
          ></Round>
      }
    </div>
  }
}


export default Game;
