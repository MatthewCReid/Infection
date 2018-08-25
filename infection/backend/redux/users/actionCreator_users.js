const { ADD_NEW_USER, ASSIGN_ROLES, RESET_USERS, ASSIGN_OFFICER } = require('./actions_users');


const newUser = (username, room, socketID, infiltrator, securityOfficer) => ({
  type: ADD_NEW_USER,
  username,
  room,
  socketID,
  infiltrator,
  securityOfficer
});

const assignRoles = (infiltrator) => ({
  type: ASSIGN_ROLES,
  infiltrator
});

const resetUsers = () => ({
  type: RESET_USERS
});

const assignSecurityOfficer = (securityOfficer) => ({
  type: ASSIGN_OFFICER
});

module.exports = {
  newUser,
  assignRoles,
  resetUsers,
  assignSecurityOfficer
};

