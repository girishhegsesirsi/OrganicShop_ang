import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../models/user';
import { Router } from '@angular/router';


/*The authentication service is used to login and logout of the application, to login it posts the users credentials to the api and checks the response for a JWT token, if there is one it means authentication was successful so the user details including the token are added to local storage.

The logged in user details are stored in local storage so the user will stay logged in if they refresh the browser and also between browser sessions until they logout. If you don't want the user to stay logged in between refreshes or sessions the behaviour could easily be changed by storing user details somewhere less persistent such as session storage which would persist between refreshes but not browser sessions, or in a private variable in the authentication service which would be cleared when the browser is refreshed.

There are two properties exposed by the authentication service for accessing the currently logged in user. The currentUser observable can be used when you want a component to reactively update when a user logs in or out, for example in the app.component.ts so it can show/hide the main nav bar when the user logs in/out. The currentUserValue property can be used when you just want to get the current value of the logged in user but don't need to reactively update when it changes, for example in the auth.guard.ts which restricts access to routes by checking if the user is currently logged in.*/



@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    public currentUserSubject: BehaviorSubject<User>;
    public currentUser: Observable<User>; 

    constructor(private http: HttpClient,private router: Router) {
        
        this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
        this.currentUser = this.currentUserSubject.asObservable();
    }

    public get currentUserValue(): User {
        return this.currentUserSubject.value;
    }

    login(username: string, password: string) {
        console.log("inside login() of AuthenticationService ");
        return this.http.post<any>(`http://localhost:4200/users/authenticate`, { username, password })
            .pipe(map(user => {
                // login successful if there's a jwt token in the response
                if (user && user.token) {
                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                    localStorage.setItem('currentUser', JSON.stringify(user));
                    currUser:user = user;
                    console.log("currentUser"+user.username);
                    this.currentUserSubject.next(user);
                }

                return user;
            }));
    }

    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('currentUser');
        this.currentUserSubject.next(null);
        this.router.navigate(["/login"],{ queryParams: { returnMsg: "User loged out successfully" }});
    }
}