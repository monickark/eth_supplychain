// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract UserContract {

uint public userCount = 0;


constructor(){
    createUser ("Monicka", "Akilan", 30, "Chennai");
}

  struct User {
    uint id;
    string firstName;
    string lastName;
    uint age;
    string city;    
    address author;
  }
event profileTips(string firstName, string lastName, uint age, 
 string city, address author);

mapping(uint => User) public Users;

 function createUser(string memory _firstName, string memory _lastName, uint _age, 
 string memory  _city) public {
    userCount ++;
     Users[userCount] = User(userCount, _firstName, _lastName, _age, _city, msg.sender);
    emit profileTips(_firstName, _lastName, _age,  _city,   msg.sender);
 }
}
