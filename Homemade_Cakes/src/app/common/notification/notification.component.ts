import { Component } from '@angular/core';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent {
  notifications: { message: string }[] = [];
  type = '0'

  constructor(){}

  //0, bt 2 sai , 3 canh ba0
  addNotification(message: string,type = '1') {
    this.type = type;
    const notification = { message };
    this.notifications.push(notification);

    // Tự động xóa thông báo sau 5 giây
    setTimeout(() => this.removeNotification(notification), 5000);
  }

  removeNotification(notification: { message: string }) {
    this.notifications = this.notifications.filter(n => n !== notification);
  }

  backgroundbyType(){
    let classNames = 'notification-success'
    switch(this.type){
      case '2' : classNames= 'notification-error';
      break;
      case '3' : classNames= 'notification-waiting';
      break;
    }
    return classNames;
  }
}
