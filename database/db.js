const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const users = require('../model/userModel');

const connectDB = () => {
    mongoose.connect(process.env.DB_URL).then(() =>{
        console.log("Connected to Database")
    }).then(() => {
        initializeAdminAccount();
    })
}

const initializeAdminAccount = async () => {
    try {
        const existingUser = await users.findOne({ email: 'ukcolleges@gmail.com' });
    
        if (existingUser) {
          console.log('This Admin already exists.');
          return;
        }
    
        const hashedPassword = await bcrypt.hash('P@ss4ar@d$@../.322', 10);
    
        const newUser = new users({
          name: 'UkColleges Admin',
          email: 'ukcolleges@gmail.com',
          password: hashedPassword,
          role: 'admin'
        });
    
        await newUser.save();
        console.log('Admin created successfully.');
      } catch (error) {
        console.error('Error initializing Admin:', error);
      }
}

module.exports = connectDB;