// MessageParser.js
class MessageParser {
  constructor(actionProvider, state) {
    this.actionProvider = actionProvider;
    this.state = state;
  }

  parse(message) {
    if (
      message.toLowerCase().includes('options') ||
      message.toLowerCase().includes('help') ||
      message.toLowerCase().includes('do for me') ||
      message.toLowerCase().includes('hello')
    ) {
      return this.actionProvider.handleOptions({ withAvatar: true });
    }
    // if (
    //   message.includes('vpc creation') ||
    //   message.includes('open a support ticket') ||
    //   message.includes('create a support ticket')
    // ) {
    //   return [this.actionProvider.handleUserInputLex(message)];
    // }
    if (message.toLowerCase().includes('query knowledge base')) {
      return [this.actionProvider.handleUserKb()];
    } else {
      // Send user input to Lex V2
      this.actionProvider.handleUserInput(message);
    }
  }
}

export default MessageParser;
