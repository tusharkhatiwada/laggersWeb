import _ from 'lodash';
import React from 'react';
import ReactDOM from 'react-dom';
import Firebase from 'firebase';
import FormBox from './Components/form';
import UsersList from './Components/userslist';

const userInfo = [
  { id:1, name:'',contact:'',address:'',email:'',username:'',password:'' }
];

export default class App extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
        userInfo:userInfo
      }
    this.userRef = new Firebase('https://laggers.firebaseio.com/users/');
    this.createUser = this.createUser.bind(this);
    this.saveUser = this.saveUser.bind(this);
    this.deleteUser = this.deleteUser.bind(this);

  }

  loadData(){
    this.userRef.on('value', snap => {
      let userInfo = [];
      snap.forEach( data => {
        let userData = data.val();
        userData.id = data.name();
        userInfo.push(userData);
      });
      this.setState({ userInfo });
    });

    this.userRef.on('child_removed', (dataSnapshot) =>{
        delete this.state.userInfo[dataSnapshot.key()];
        this.setState({ userInfo: this.state.userInfo });
    });
    
  }

  componentDidMount(){
    this.loadData();
  }

  createUser(user){
    this.userRef.push(user);
  }

  saveUser(oldUser, newUser){
    console.log('olduser',oldUser);
    console.log('newuser', newUser);
    // TODO - optimize this code
    const foundUser = _.find( this.state.userInfo, user =>
        user.name === oldUser.name
    );
    const foundContact = _.find( this.state.userInfo, user =>
        user.contact === oldUser.contact
    );
    const foundAddress = _.find( this.state.userInfo, user =>
        user.address === oldUser.address
    );
    const foundEmail = _.find( this.state.userInfo, user =>
        user.email === oldUser.email
    );
    const foundUsername = _.find( this.state.userInfo, user =>
        user.username === oldUser.username
    );
    const foundPassword = _.find( this.state.userInfo, user =>
        user.password === oldUser.password
    );
    console.log('foundUser', foundUser);
    console.log('foundUser.name',foundUser.name);
    foundUser.name = newUser.name;
    foundContact.contact = newUser.contact;
    foundAddress.address = newUser.address;
    foundEmail.email = newUser.email;
    foundUsername.username = newUser.username;
    foundPassword.password = newUser.password;
  }

  deleteUser(id){
    console.log(id);
    const dltUserRef = new Firebase('https://laggers.firebaseio.com/users').child(id);
    console.log('dlt',dltUserRef);
    dltUserRef.remove();
  }

  render() {
    return (
      <div>
        <FormBox createUser = { this.createUser } />
        <UsersList
            userInfo = { this.state.userInfo }
            saveUser = { this.saveUser }
            deleteUser = { this.deleteUser } />
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('app'));