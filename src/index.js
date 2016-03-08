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

  componentWillMount(){
    this.userRef.on("value", snapshot => {
      let userInfo = [];
      snapshot.forEach( data => {
            console.log('data.val is', data.val());
            let user = {
            id: data.val().id,
            name: data.val().name,
            contact: data.val().contact,
            address: data.val().address,
            email: data.val().email,
            username: data.val().username,
            password: data.val().password,
          }
          userInfo.push(user);
          this.setState({ userInfo });
        });
    });

  }

  componentDidMount(){

  }

    componentWillUnMount(){
        this.userRef.off();
    }

  createUser(user){
    // console.log('user is', user.name);
    let newUser = {
      id: this.state.userInfo.length + 1,
      name: user.name,
      contact: user.contact,
      address: user.address,
      email: user.email,
      username: user.username,
      password: user.password,
    }
    this.userRef.push(newUser);
    this.setState({ userInfo: this.state.userInfo.concat(newUser) });
    // console.log(this.state.userInfo);
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
    const dltUserRef = new Firebase(`https://laggers.firebaseio.com/users/${id}`);
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