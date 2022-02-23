import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { map } from 'rxjs/operators';
import { User } from '../models/user';
import { Observable, EMPTY, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';


/*The auth guard is used to prevent unauthenticated users from accessing restricted routes, in this example it's used in app.routing.ts to protect the home page route. For more information about angular 2+ route guards you can check out this post on the thoughtram blog.

NOTE: While technically it's possible to bypass this client side authentication check by manually adding a 'currentUser' object to local storage using browser dev tools, this would only give access to the client side routes/components, it wouldn't give access to any real secure data from the server api because a valid authentication token (JWT) is required for this.*/

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  users:User[];
  constructor(private http: HttpClient) { }

  getUserDetails(username, password){
    console.log("inside getUserDetails() of AuthService");
  return this.http.get('assets/User.json').pipe(
    catchError( err => {
         if (err.status == 401) {
          console.log("401 error");
             return EMPTY;
         } else {
             return throwError(err);
         }
    }))

  }
}
