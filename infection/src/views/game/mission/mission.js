import React from 'react';

import OnMission from './onMission';
import NotOnMission from './notOnMission';

const Mission = ({ roster, username, choose, choiceMade }) =>
  roster.includes(username) ? (
    <OnMission choose={choose} choiceMade={choiceMade} />
  ) : (
    <NotOnMission />
  );

export default Mission;
