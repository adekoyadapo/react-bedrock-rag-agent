import React from 'react';
import './styles.css';
import Chatbot from 'react-chatbot-kit';
import { useEffect, useState } from 'react';
import Hero from './components/Hero';
import Navbar from './components/Navbar';
import Loader from './components/Loader.js';
import { Bounce } from 'react-awesome-reveal';
import config from './components/bot/config.js';
import MessageParser from './components/bot/MessageParser.js';
import ActionProvider from './components/bot/ActionProvider.js';

function App() {
  const [showBot, toggleBot] = useState(false);
  const [isloading, setIsLoading] = useState(true);

  const validator = (input) => {
    if (input.length > 0) return true;
    return false;
  };

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 2500);
  });
  return (
    <div>
      {isloading ? (
        <Loader />
      ) : (
        <div>
          <Navbar />
          <Hero />
          {showBot && (
            <div
              style={{
                position: 'fixed',
                right: '75px',
                bottom: '80px',
                boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',
              }}
            >
              <Chatbot
                config={config}
                messageParser={MessageParser}
                actionProvider={ActionProvider}
                validator={validator}
              />
            </div>
          )}
          <Bounce>
            <button
              className="app-chatbot-button"
              onClick={() => toggleBot((prev) => !prev)}
            >
              <svg viewBox="0 0 640 512" className="app-chatbot-button-icon">
                <path d="M192,408h64V360H192ZM576,192H544a95.99975,95.99975,0,0,0-96-96H344V24a24,24,0,0,0-48,0V96H192a95.99975,95.99975,0,0,0-96,96H64a47.99987,47.99987,0,0,0-48,48V368a47.99987,47.99987,0,0,0,48,48H96a95.99975,95.99975,0,0,0,96,96H448a95.99975,95.99975,0,0,0,96-96h32a47.99987,47.99987,0,0,0,48-48V240A47.99987,47.99987,0,0,0,576,192ZM96,368H64V240H96Zm400,48a48.14061,48.14061,0,0,1-48,48H192a48.14061,48.14061,0,0,1-48-48V192a47.99987,47.99987,0,0,1,48-48H448a47.99987,47.99987,0,0,1,48,48Zm80-48H544V240h32ZM240,208a48,48,0,1,0,48,48A47.99612,47.99612,0,0,0,240,208Zm160,0a48,48,0,1,0,48,48A47.99612,47.99612,0,0,0,400,208ZM384,408h64V360H384Zm-96,0h64V360H288Z"></path>
              </svg>
            </button>
          </Bounce>
        </div>
      )}
    </div>
  );
}

export default App;
