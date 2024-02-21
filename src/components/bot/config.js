// config.js
import { createChatBotMessage } from 'react-chatbot-kit';
import CoBotAvatar from '../CoBotAvatar';
import Overview from './widgets/Overview';
import { ReactTyped } from 'react-typed';
const botName = 'Bob';

const config = {
  customComponents: { botAvatar: (props) => <CoBotAvatar {...props} /> },

  initialMessages: [
    createChatBotMessage(
      <ReactTyped
        strings={[`Hi! I'm ${botName}, How Can I help you?`]}
        typeSpeed={10}
        showCursor={false}
      />,
      {}
    ),
    createChatBotMessage(
      <ReactTyped
        strings={["Here's a quick overview of what I can help you with."]}
        typeSpeed={20}
        showCursor={false}
      />,
      {
        withAvatar: false,
        delay: 1000,
        widget: 'overview',
      }
    ),
  ],

  widgets: [
    {
      widgetName: 'overview',
      widgetFunc: (props) => <Overview {...props} />,
      mapStateToProps: ['messages'],
    },
  ],

  botName: 'Bob',

  customStyles: {
    botMessageBox: {
      backgroundColor: '#000000',
    },
    chatButton: {
      backgroundColor: '#009A44',
    },
  },
};

export default config;
