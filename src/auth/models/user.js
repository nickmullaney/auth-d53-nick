'use strict';
const jwt = require('jsonwebtoken');
const SECRET = process.env.SECRET;

module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define('users', {
    // the big diff:  notice there is no return
    // use SAME property names always
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM,
      values: ('user', 'writer', 'editor', 'admin'),
      defaultValue: 'user',
    },
    token: {
      type: DataTypes.VIRTUAL,
      // When I access the user data this method will generate the ciurtual at that moment. we don't expect a token column in the users table
      get(){
        //json web token is === to "token"
        return jwt.sign({
          username: this.username,
          capabilities: this.capabilities,
        
        }, SECRET, {expiresIn: 1000 * 60 * 60 * 24 * 7});
      },
      set(){
        //json web token is === to "token"
        return jwt.sign({username: this.username}, SECRET, {expiresIn: 1000 * 60 * 60 * 24 * 7});
      },
    },
    capabilities: {
      type: DataTypes.VIRTUAL,
      get(){
        const acl = {
          user: ['read'],
          writer: ['read', 'create'],
          editor: ['read', 'create', 'update'],
          admin: ['read', 'create', 'update', 'delete'],
        };
        return acl[this.role];
      },
    },
  });
  // hey, this middleware exists!   I can interact with the user before creating the record in our DB
  // user.beforeCreate((user) => {
  //   console.log('our user before being added to DB', user);
  // });
  return user;
};
