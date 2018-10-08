import database, { auth, provider } from './firebase';

const idleDuration = 60 // seconds


export const initUsers = (state) => {
  checkLoggedIn(state);
  getUsers(state);
  checkIdleUsers(state);
}

export const login = () => {
  auth.signInWithPopup(provider)
    .then(result => {
      const user = result.user;
      this.setState({
        user
      });
      const newUser = {
        name: user.displayName || user.email,
        email: user.email,
        updated: new Date().getTime()
      }
      this.addUser(newUser);
    });
}

export const logout = () => {
  this.removeUser(this.state.user.id); // remove from database
  auth.signOut()
  .then(() => {
    // remove locally
    this.setState({
      user: null
    });
  });
}

const removeUser = (id) => {
    database.ref(`users/${id}`).remove();
  }

export const getUsers = () => {
  const usersRef = database.ref('users/');
  usersRef.on('value', (snapshot) => {
    const users = snapshot.val();
    let newUsers = [];
    for (let user in users) {
      newUsers.push({
        id: user,
        name: users[user].name,
        email: users[user].email,
        updated: users[user].updated
      });
    }
    this.setState({
      users: newUsers
    }, () => {
      if (this.state.user) {
        this.updateUserId();
      }
    });
  });
}

const updateUserId = () => {
  const listedUser = this.state.users.find(item => this.state.user.email === item.email);
  if (listedUser) {
    const newUser = this.state.user;
    newUser.id = listedUser.id;
    this.setState({
      user: newUser
    });
  }
}

const addUser = (newUser) => {
  const existingUsers = this.state.users.find(item => item.email === newUser.email);
  if (!existingUsers || existingUsers.length === 0) {
    database.ref('users/').push(newUser);
    const newUsers = this.state.users;
    newUsers.push(newUser);
    this.setState({
      users: newUsers
    })
  } else {
    console.log('user already in list');
  }
}

const checkLoggedIn = (state) => {
  auth.onAuthStateChanged(user => {
    if (user) {
      const listedUser = state.users.find(item => user.email === item.email);
      if (listedUser) {
        // update user id if already in the list
        user.id = listedUser.id;
      }
      this.setState({ user });
    }
  });
}

const checkIdleUsers = (state) => {
  for (let item of state.users) {
    if ((item.updated || 0) + idleDuration * 1000 < new Date().getTime()) {
      const diff = ( new Date().getTime() -  (item.updated || 0) ) / 1000 / 60;
      console.log('removing idle user', item.email, diff);
      if (state.user && state.user.id === item.id) {
        // this is me! I am idle!
        this.logout();
        continue;
      }
      this.removeUser(item.id);
    }
  }
}
