import express from 'express';
import connectDatabase from './config/db';
import {check, validationResult} from 'express-validator';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import config from 'config';
import User from './models/User';
import auth from './middleware/auth';
import { route } from 'express/lib/application';

const app = express();

connectDatabase();

app.use(express.json({ extended: false}));
app.use(
    cors({
        origin: 'http://localhost:3000'
    })
);
//api endpoints
/**
 * @route GET /
 * @desc Test endpoint
 * 
 */

app.get('/', (req, res) =>
    res.send('http get request sent to root api endpoint')
);

/** 
* @route POST api/users
* @desc Register user
* 
*/
 /**
 * @route POST api/login
 * @desc Login user
 */
  app.post(
    '/api/login',
    [
      check('email', 'Please enter a valid email').isEmail(),
      check('password', 'A password is required').exists()
    ],
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
      } else {
        const { email, password } = req.body;
        try {
          // Check if user exists
          let user = await User.findOne({ email: email });
          if (!user) {
            return res
              .status(400)
              .json({ errors: [{ msg: 'Invalid email or password' }] });
          }
  
          // Check password
          const match = await bcrypt.compare(password, user.password);
          if (!match) {
            return res
              .status(400)
              .json({ errors: [{ msg: 'Invalid email or password' }] });
          }
  
          // Generate and return a JWT token
          returnToken(user, res);
        } catch (error) {
          res.status(500).send('Server error');
        }
      }
    }
  );


