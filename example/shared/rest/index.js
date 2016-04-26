var request = require('superagent');

function getUser(user, callback) {
    request
       .get(`https://api.github.com/users/${user}`)
       .end(callback);
}

function getUserOrgs(user, callback) {
    request
       .get(`https://api.github.com/users/${user}/orgs`)
       .end(callback);
}

module.exports = {
    getUser : getUser,
    getUserOrgs : getUserOrgs
}