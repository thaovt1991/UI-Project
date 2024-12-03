import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-messenger',
  templateUrl: './messenger.component.html',
  styleUrls: ['./messenger.component.css']
})
export class MessengerComponent {
  @Input() isChatOpen = false; // Trạng thái mở/đóng popup chat
  //#region  Chát
  // isChatOpen = false; // Trạng thái mở/đóng popup chat
  messages: string[] = []; // Danh sách tin nhắn
  userInput: string = ''; // Nội dung nhập từ người dùng

  constructor(){

  }

  ngOnChanges(){

  }
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    
  }

 
  // Mở hoặc đóng chat
  toggleChat() {
   this.isChatOpen = !this.isChatOpen;
 }
 
 // Gửi tin nhắn
 sendMessage() {
   if (this.userInput.trim()) {
     this.messages.push(this.userInput); // Thêm tin nhắn vào danh sách
     this.userInput = ''; // Xóa nội dung input sau khi gửi
   }
 }
   //#endregion
}
