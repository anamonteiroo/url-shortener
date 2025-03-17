import { User } from '../src/auth/interfaces/user.interface'; 
declare module 'express' {
  interface Request {
    user?: User; 
  }
}