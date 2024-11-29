import * as CryptoJS from 'crypto-js';
import {
  Component,
  ViewChild,
  ViewEncapsulation,
  OnInit,
  OnChanges,
  SimpleChanges,
  ChangeDetectorRef,
  Renderer2,
} from '@angular/core';
import { UsersServiceService } from '../user-service/users-service.service';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NotificationComponent } from 'src/app/common/notification/notification.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  @ViewChild("noti") noti : NotificationComponent
  decrypted = '';
  request = '';
  responce = '';
  typeLogin = '1';
  tokenFromUI: string = '0123456789123456';
  encrypted: any = '';

  itemsSignUp: Array<any> = [
    { name: 'username', type: 'text', fieldName: 'Username' },
    { name: 'password', type: 'password', fieldName: 'Password' },
    { name: 'confirmPassword', type: 'password', fieldName: 'ConfirmPassword' },
    { name: 'role', type: 'combobox', fieldName: 'RoleType' },
    { name: 'email', type: 'text', fieldName: 'Email' },
  ];

  signupFrom = new FormGroup({
    RoleType: new FormControl(),
    Username: new FormControl('', [
      Validators.required,
      Validators.minLength(5),
    ]),
    Password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
    ]),
    ConfirmPassword: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
    ]),
    Email: new FormControl(),
  });
  itemsLogin: Array<any> = [
    { name: 'username', type: 'text', fieldName: 'Username' },
    { name: 'password', type: 'password', fieldName: 'Password' },
  ];
  loginFrom = new FormGroup({
    Username: new FormControl('', [
      Validators.required,
      Validators.minLength(5),
    ]),
    Password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
    ]),
  });
  roles = [
    {
      category: '1',
      name: 'Admin',
    },
    {
      category: '2',
      name: 'Basic',
    },
  ];
  isSubmitted: boolean;

  constructor(
    private changeDef: ChangeDetectorRef,
    private usersService: UsersServiceService,
    private router: Router,
    private renderer: Renderer2 ,//bo sung java script,
  ) {}

  ngOnInit(): void {
    //Bổ sung javascript - chưa tets dc
    // const script = this.renderer.createElement('script');
    // script.src = './login.js';
    // script.onload = () => {
    //   console.log('Script đã được nạp!');
    //   // Gọi hàm trong script nếu cần
    // };
    // this.renderer.appendChild(document.body, script);
  }

  user = {
    userName: '',
    password: '',
    confirmPass: '',
  };

  isFormLogin = true;

  encryptUsingAES256() {
    let _key = CryptoJS.enc.Utf8.parse(this.tokenFromUI);
    let _iv = CryptoJS.enc.Utf8.parse(this.tokenFromUI);
    let encrypted = CryptoJS.AES.encrypt(JSON.stringify(this.request), _key, {
      keySize: 16,
      iv: _iv,
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7,
    });
    this.encrypted = encrypted.toString();
  }
  decryptUsingAES256() {
    let _key = CryptoJS.enc.Utf8.parse(this.tokenFromUI);
    let _iv = CryptoJS.enc.Utf8.parse(this.tokenFromUI);

    this.decrypted = CryptoJS.AES.decrypt(this.encrypted, _key, {
      keySize: 16,
      iv: _iv,
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7,
    }).toString(CryptoJS.enc.Utf8);
  }

  //admin- admin@123
  loginAccount(e) {
    //window.location.href = "/login"
    // let date = new Date();
    // date.setTime(Date.now() + 36000); //thoi gian duy tri cookies - expires expires
    // let expires = date.toUTCString();
    // // this.usersService.setCookie(`userName = ${e?.userName}`,null, null,expiresm)
    // this.usersService.setCookie(
    //   `userName = ${e?.userName}`,
    //   null,
    //   null,
    //   null,
    //   3600
    // );
    //this.usersService.exec("HomemadeCakes","HomemadeCakes.Business.UserLogBusiness","LoginAsync",[ e?.userName,e?.password]).subscribe(res=>{
    let objecLogIn = {
      UserID: e?.userName,
      Password: e?.password,
      RememberMe: true,
    };
     //cach 1
      this.usersService.logInAsync(objecLogIn).subscribe(res=>{
       if(!res.error){
        debugger

      this.usersService.setCookie(`userId = ${res?.userId}`,null, null,null,res?.maxage);
      localStorage.setItem('token',res?.token)
      this.router.navigate(['/home']);
       }else {
        //Thong bao
        this.noti.addNotification(res?.message,'2')
       console.log(res?.message)
       }
    })

    //cach 2
    // this.usersService
    //   .logInAsync2(objecLogIn)
    //   .then((data) => {
    //     debugger;
    //     console.log('data log:', data);
    //   })
    //   .catch((error) => console.error('Error:', error));
  }

  openForm(e: string) {
    this.isSubmitted = false;
    this.isFormLogin = e == 'logIn';
    this.changeDef.detectChanges();
  }
  //set cookie

  changeRole(e) {}

  onSubmit(e) {
    this.isSubmitted = true;
    if (e == 1) {
      //Login

      if (this.loginFrom.invalid) return;
    } else {
      //Dang ki

      if (this.signupFrom.invalid) return;
    }
  }

  // Viết java script
}
