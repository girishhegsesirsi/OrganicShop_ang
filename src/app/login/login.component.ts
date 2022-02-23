import { Component, OnInit } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { User } from '../models/user';
import { Router,ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '../service/authentication.service';
import { AlertService } from '../service/alert.service';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})


/*The login component uses the authentication service to login to the application. If the user is already logged in they are automatically redirected to the home page.

The loginForm: FormGroup object defines the form controls and validators, and is used to access data entered into the form. The FormGroup is part of the Angular Reactive Forms module and is bound to the login template above with the [formGroup]="loginForm" directive.*/

export class LoginComponent implements OnInit {
  users:User[];
  loading = false;
  submitted = false;
  loginForm: FormGroup;
  returnUrl: string;
  returnMsg:string;
  constructor(private formBuilder: FormBuilder,private authService:AuthService, private alertService: AlertService,
     private router: Router,private route: ActivatedRoute,private authenticationService: AuthenticationService
    ) { }

  ngOnInit() {

    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
  });
  // get return url from route parameters or default to '/'
  this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  this.returnMsg = this.route.snapshot.queryParams['returnMsg'] || '';
  }


  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.loginForm.invalid) {
        return;
    }

    this.loading = true;
    this.authenticationService.login(this.f.username.value, this.f.password.value)
        .pipe(first())
        .subscribe(
            data => {
              console.log("returned URL is: "+ this.returnUrl)
                this.router.navigate([this.returnUrl]);
            },
            error => {
              console.log(error);
                this.alertService.error(error);
                this.loading = false;
            });
}

    // convenience getter for easy access to form fields
    get f() { 
      return this.loginForm.controls; 
    }

 /*login(event){
  let userdata = null;
  event.preventDefault();
  const target = event.target;
  const username = target.querySelector("#username").value;
  const password = target.querySelector("#password").value;
  //if (!username && !password)
  this.authService.getUserDetails(username,password).subscribe((data: User[])=>{
    console.log(data,"this received from server");
    this.users = data;
    userdata = this.users.find(ob => (ob.username == username && ob.password == password));
     /* ob.username == username;
      console.log(ob,"ob");
      console.log(ob.username,"ob.username");
      console.log(username,"username");
      console.log(ob.passowrd,"ob.passowrd");
      console.log(password,"password");*/

     /* if(ob.username == username && ob.passowrd==password)
     
    
    
    });
    console.log(userdata,"userdata");
    if(userdata ==true){
      console.log("Logged in Successfully");} 

      if(userdata !=null){
        console.log("Logged in Successfully");
      this.router.navigateByUrl('/login-success');

      }
      else
      this.router.navigate(['/login']);
    
  }
  
  );
  
  

}*/
}
