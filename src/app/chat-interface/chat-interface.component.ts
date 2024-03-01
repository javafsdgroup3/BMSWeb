import { Component } from '@angular/core';

@Component({
  selector: 'app-chat-interface',
  templateUrl: './chat-interface.component.html',
  styleUrls: ['./chat-interface.component.css']
})
export class ChatInterfaceComponent {
  userInput: string = '';
  messages: string[] = [];

  sendMessage() {
    // Send user input to chatbot service and get response
    this.messages.push('User: ' + this.userInput);
    // Add logic to process user input and get chatbot response
    this.messages.push('Chatbot: ' + this.getChatbotResponse(this.userInput));
    this.userInput = ''; // Clear input field
  }

  getChatbotResponse(userInput: string): string {
    // Implement logic to get chatbot response
    return 'This is a response from the chatbot.';
  }
}
