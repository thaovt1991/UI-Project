import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ManagerNumberService } from '../manager-number.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent {
  crrMenu='0'
  constructor(private router :Router,
    private serviceNum : ManagerNumberService
  ){

  }
  click(e){
    this.serviceNum.menuClick.next(e);
    this.crrMenu = e
  let url =''
    switch(e){
      case'1':
      break;
      case'2':
      break;
      case'3':
      break;
    }
    if(!url) return
 this.router.navigate([`/${url}`]);
  }

  backHome(){
    this.router.navigate(['/home']);
  }
}
