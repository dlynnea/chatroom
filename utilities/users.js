const users = [];

function newUser(id, username, room) {
    const user = { id, username, room };
    users.push(user);
    return user;
}

function currentUser(id) {
    return users.find(user => user.id === id);
}

function userLeaves(id) {
    const userId = users.findIndex(user => user.id === id);

    if(userId !== -1) {
        return users.splice(userId, 1)[0];
    }
}

function allUsers(room) {
    return users.filter(user => user.room === room);
}

module.exports = {
    newUser,
    currentUser,
    userLeaves,
    allUsers
}