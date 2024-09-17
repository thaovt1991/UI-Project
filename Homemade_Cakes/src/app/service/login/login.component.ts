
import * as CryptoJS from 'crypto-js';
import { Component, ViewChild,
  ViewEncapsulation,
  OnInit,
  OnChanges,
  SimpleChanges,
  ChangeDetectorRef,
} from '@angular/core';
import { UsersServiceService } from '../user-service/users-service.service';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{
  decrypted =''
  request=''
  responce=''
  tokenFromUI: string = "0123456789123456";
  encrypted: any = "";
  

   constructor(
    private changeDef : ChangeDetectorRef,
    private usersService : UsersServiceService,
    private router : Router
   ){

   }
   
  ngOnInit(): void {
    
  }

   user ={
    userName :'',
    password :'',
    confirmPass:''
   }

   isFormLogin = true;



  encryptUsingAES256() {
    let _key = CryptoJS.enc.Utf8.parse(this.tokenFromUI);
    let _iv = CryptoJS.enc.Utf8.parse(this.tokenFromUI);
    let encrypted = CryptoJS.AES.encrypt(
      JSON.stringify(this.request), _key, {
        keySize: 16,
        iv: _iv,
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
      });
    this.encrypted = encrypted.toString();
  }
  decryptUsingAES256() {
    let _key = CryptoJS.enc.Utf8.parse(this.tokenFromUI);
    let _iv = CryptoJS.enc.Utf8.parse(this.tokenFromUI);

    this.decrypted = CryptoJS.AES.decrypt(
      this.encrypted, _key, {
        keySize: 16,
        iv: _iv,
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
      }).toString(CryptoJS.enc.Utf8);
  }

  loginAccount(e){
    //window.location.href = "/login"
    let date = new Date() ; 
    date.setTime(Date.now()+36000);//thoi gian duy tri cookies - expires expires
    let expires = date.toUTCString();
   // this.usersService.setCookie(`userName = ${e?.userName}`,null, null,expires)
    this.usersService.setCookie(`userName = ${e?.userName}`,null, null,null,3600)
    this.usersService.exec("HomemadeCakes","HomemadeCakes.Business.UserLogBusiness","LoginAsync",[e?.userID,e?.password]).subscribe(res=>{
       if(res){
       this.router.navigate(['/home']);
       }else {
        //Thong bao
       }
    })
  }

  openForm(e: string){
   this.isFormLogin = e== 'logIn' ;
   this.changeDef.detectChanges();
  }
  //set cookie

}
