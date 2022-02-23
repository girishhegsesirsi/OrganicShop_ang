import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AlertService } from '../service/alert.service';

/*The alert service enables any component in the application to display alert messages at the top of the page via the alert component.

It has methods for displaying success and error messages, and a getMessage() method that returns an Observable that is used by the alert component to subscribe to notifications for whenever a message should be displayed.*/


@Component({
    selector: 'alert',
    templateUrl: 'alert.component.html'
})

export class AlertComponent implements OnInit, OnDestroy {
    private subscription: Subscription;
    message: any;

    constructor(private alertService: AlertService) { }

    ngOnInit() {
        this.subscription = this.alertService.getMessage().subscribe(message => { 
            this.message = message; 
        });
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}