import React from 'react';
import logo from '../images/bot.png'
import { Fade } from 'react-awesome-reveal';

const Navbar = () => {
  return (
<Fade direction='down' duration={1000}>
  <div className='flex justify-between items-center h-24 max-w-[1840px] mx-auto px-4 text-white'>
      <img src={logo} alt="Chat Logo" className="object-scale-down h-24 w-72"/>

    </div>
</Fade>
    
  );
};

export default Navbar;
