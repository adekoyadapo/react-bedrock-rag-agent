import React from 'react';
import { Fade } from 'react-awesome-reveal';

const Hero = () => {
  return (
    <div className='text-white'>
      <div className='max-w-[800px] mt-[-200px] w-full h-screen mx-auto text-center flex flex-col justify-center'>
      <Fade direction='down' duration={1000}>
        <h1 className='text-[#00df9a] md:text-7xl sm:text-6xl text-4xl font-bold md:py-6'>
          CHATBOT
        </h1>
      </Fade>
      <Fade direction='up' duration={1000}>
        <p className='font-bold p-2'>
          Chatbot + AWS Bedrock
        </p>
      </Fade>
      </div>
    </div>
  );
};

export default Hero;
