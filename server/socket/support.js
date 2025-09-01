const uuidv4 = require('uuid').v4;

const users = [];
const messages = [];

// Function to find a user by their ID
const findUserById = id => users.find(x => x.id === id);
// Function to find a user by their socket ID
const findUserBySocketId = socketId => users.find(x => x.socketId === socketId);

// Function to update the status of a user
const updatedUserStatus = (user, status) => {
  const existingUser = findUserById(user.id);
  if (existingUser) {
    existingUser.online = status;
  }
};

// Function to handle support-related socket events
exports.supportHandler = (io, socket) => {
  // Event handler for user connection
  socket.on('connectUser', async () => {
    const user = findUserBySocketId(socket.id);

    /* 
      if user connected is admin => notify everyone
      if user connected is not admin => notify all admins
    */
    if (user) {
      user.online = true;
      if (user.isAdmin) {
        socket.broadcast.emit('connectUser', user);
      } else {
        const admins = users.filter(
          x => x.isAdmin === true && x.online === true
        );
        admins.map(admin =>
          socket.to(admin.socketId).emit('connectUser', user)
        );
      }
    }
  });

  // Event handler to get the list of users
  socket.on('getUsers', async () => {
    const user = findUserBySocketId(socket.id);
    const notMe = users.filter(x => x.socketId !== socket.id);
    const adminUsers = users.filter(x => x.isAdmin === true);
    const userDocs = user?.isAdmin ? notMe : adminUsers;
    io.to(socket.id).emit('getUsers', userDocs);
  });

  // Event handler to get the list of messages
  socket.on('getMessages', () => {
    const user = findUserBySocketId(socket.id);
    const sentMsgs = messages.filter(m => m.from === user?.id);
    const receivedMsgs = messages.filter(m => m.to === user?.id);
    io.to(socket.id).emit('getMessages', [...sentMsgs, ...receivedMsgs]);
  });

  // Event handler for sending a message
  socket.on('message', body => {
    const { text, to } = body;
    const user = findUserBySocketId(socket.id);
    const userTo = findUserById(to);

    const message = {
      id: uuidv4(),
      value: text,
      time: Date.now(),
      user: user,
      from: user.id,
      to: userTo?.id
    };

    messages.push(message);
    io.to(userTo.socketId).to(user.socketId).emit('message', message);
  });

  // Event handler for user disconnection
  socket.on('disconnect', async () => {
    const user = findUserBySocketId(socket.id);
    if (user) {
      updatedUserStatus(user, false);
      user.online = false;
      socket.broadcast.emit('disconnectUser', user);
    }
  });

  // Event handler for connection errors
  socket.on('connect_error', err => {
    console.log(`connect_error due to ${err.message}`);
  });
};

exports.users = users;
exports.findUserById = findUserById;
