'use strict';

const jwt = require('jsonwebtoken');
const SECRET = process.env.SECRET;

module.exports = (sequelize, DataTypes) => {
  // creating a "user variable "
  const user = sequelize.define('users', {
    // the big diff:  notice there is no return
    // use SAME property names always
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: { //Never include a password in your token
      type: DataTypes.STRING,
      allowNull: false,
    },
    token:{
      type: DataTypes.VIRTUAL,
      // when I access the user date, this get method will generate the virtual at that moment
      //  We do not expect a token column in the users table
      get(){
        // json web token is the equivalent of "token"     This expires in 1 week, 1k ms in second, 60 in min, 60min in hour etc
        return jwt.sign({username: this.username}, SECRET, {expiresIn: 1000 * 60 * 60 * 24 * 7});
      },
      set(){
        // not using this today showing what it could look like
        return jwt.sign({username: this.username}, SECRET, {expiresIn: 1000 * 60 * 60 * 24 * 7});
      },
    },
  });
  // hey, this middleware exists!   I can interact with the user before creating the record in our DB
  // user.beforeCreate((user) => {
  //   console.log('our user before being added to DB', user);
  // });
  user.authenticateBearer = async(token) =>{
    try{
      let payload =jwt.verify(token, SECRET);
      console.log('payload: ', payload);
      const singleUser = await user.findOne({where: 
        {username: payload.username}});
      if (singleUser) return singleUser;
    }catch(e){
      console.log('error in authenticateBearer method. Message: ', e.message);
      console.error(e);
      return e;
    }
  };

  return user;
};
