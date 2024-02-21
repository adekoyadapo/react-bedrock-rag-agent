// ActionProvider.js
import {
  LexRuntimeV2,
  RecognizeTextCommand,
} from '@aws-sdk/client-lex-runtime-v2';
import Loader from '../bot/BotLoader';
import { ReactTyped } from 'react-typed';

import {
  BedrockAgentRuntimeClient,
  InvokeAgentCommand,
} from '@aws-sdk/client-bedrock-agent-runtime';

const credentials = {
  region: process.env.REACT_APP_AWS_REGION,
  credentials: {
    accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
  },
};

class ActionProvider {
  static sessionId = null;

  constructor(createChatBotMessage, setStateFunc, createClientMessage) {
    this.createChatBotMessage = createChatBotMessage;
    this.setState = setStateFunc;
    this.createClientMessage = createClientMessage;
    this.lexClient = new LexRuntimeV2(credentials);
    this.BedrockAgentClient = new BedrockAgentRuntimeClient(credentials);

    if (!ActionProvider.sessionId) {
      ActionProvider.sessionId = this.generateSessionId();
    }
  }

  async handleOptions(options) {
    const message = this.createChatBotMessage(
      <ReactTyped
        strings={['Hello! How can I help you?']}
        typeSpeed={20}
        showCursor={false}
      />,
      {
        widget: 'overview',
        loading: true,
        terminateLoading: true,
        ...options,
      }
    );
    this.setState((prev) => ({
      ...prev,
      messages: [...prev.messages, message],
    }));
  }

  handleUserKb = () => {
    const message = this.createChatBotMessage(
      <ReactTyped
        strings={['Ask me anything so I can retrieve it for you...']}
        typeSpeed={20}
        showCursor={false}
      />,
      {
        withAvatar: true,
      }
    );
    this.setState((prev) => ({
      ...prev,
      messages: [...prev.messages, message],
    }));
  };

  AccountOnboarding = () => {
    this.handleUserInput('I would like to create an Account');
  };

  VpcCreation = () => {
    this.handleUserInput('How can I create a secure VPC according to AWS well architected framework from the knowledgebase');
  };

  Support = () => {
    this.handleUserInput('I would like to create a sevicenow request');
  };

  async handleUserInputLex(userInput) {
    const placeholder = this.createChatBotMessage(<Loader />,
    {
      withAvatar: true,
    }
    );
    this.setState((prev) => ({
      ...prev,
      messages: [...prev.messages, placeholder],
    }));

    const lexResponse = await this.sendToLex(userInput);
    this.handleLexResponse(lexResponse, userInput);

    this.setState((prev) => {
      const updatedMessages = prev.messages.filter(
        (message) => message.id !== placeholder.id
      );

      return {
        ...prev,
        messages: updatedMessages,
      };
    });
  }

  async handleUserInput(userInput) {
    const placeholder = this.createChatBotMessage(<Loader />,
    {
      withAvatar: true,
    }
    );
    this.setState((prev) => ({
      ...prev,
      messages: [...prev.messages, placeholder],
    }));
    await this.sendToBedrockAgent(userInput);

    this.setState((prev) => {
      const updatedMessages = prev.messages.filter(
        (message) => message.id !== placeholder.id
      );

      return {
        ...prev,
        messages: updatedMessages,
      };
    });
  }

  async sendToBedrockAgent(userInput) {
    const params = {
      agentId: process.env.REACT_APP_AGENT_ID,
      agentAliasId: process.env.REACT_APP_AGENT_ALIAS_ID,
      sessionId: ActionProvider.sessionId,
      endSession: false,
      inputText: userInput,
    };

    try {
      const input = {
        ...params,
        sessionState: {},
      };
      const command = new InvokeAgentCommand(input);
      const response = await this.BedrockAgentClient.send(command);

      // Check if the response has a completion field
      if (response.completion) {
        const completion = response.completion;

        // Process the streamed response
        for await (const item of completion) {
          if (item.chunk && item.chunk.bytes) {
            // Convert Uint8Array to string using TextDecoder
            const textDecoder = new TextDecoder('utf-8');
            const decodedText = textDecoder.decode(item.chunk.bytes);

            // Handle the decoded text as needed
            if (decodedText) {
              const botMessage = this.createChatBotMessage(
                <ReactTyped
                  strings={[decodedText]}
                  typeSpeed={20}
                  showCursor={false}
                />,
                {
                  role: 'bot',
                  withAvatar: true,
                }
              );

              this.setState((prev) => ({
                ...prev,
                messages: [...prev.messages, botMessage],
              }));
            } else {
              console.error('Decoded text is empty.');
            }
          } else {
            console.error('Invalid or incomplete completion response.');
          }
        }
      } else {
        console.error('Invalid or incomplete completion response.');
      }
    } catch (error) {
      console.error('Error sending message to Bedrock Agent:', error);
      return null;
    }
  }

  async sendToLex(userInput) {
    const params = {
      botAliasId: process.env.REACT_APP_LEX_BOT_ALIAS_ID,
      botId: process.env.REACT_APP_LEX_BOT_ID,
      localeId: process.env.REACT_APP_LEX_LOCALE_ID,
      sessionId: ActionProvider.sessionId,
      text: userInput,
    };
    try {
      const command = new RecognizeTextCommand(params);
      const lexResponse = await this.lexClient.send(command);
      return lexResponse;
    } catch (error) {
      console.error('Error sending message to Lex V2:', error);
      return null;
    }
  }

  handleLexResponse(lexResponse) {
    if (lexResponse && lexResponse.messages) {
      lexResponse.messages.forEach((message) => {
        const botMessage = this.createChatBotMessage(
          <ReactTyped
            strings={[message.content]}
            typeSpeed={20}
            showCursor={false}
          />,
          {
            role: 'bot',
            withAvatar: true,
          }
        );
        this.setState((prev) => ({
          ...prev,
          messages: [...prev.messages, botMessage],
        }));
      });
    }
  }

  generateSessionId() {
    const sessionId = Date.now().toString();
    console.log('Session ID', sessionId);
    return sessionId;
  }
}
export default ActionProvider;
