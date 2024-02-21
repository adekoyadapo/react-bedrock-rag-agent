import React from 'react';
import { ThreeCircles } from 'react-loader-spinner';
const Loader = () => {
  return (
    <div className="loader">
      <ThreeCircles
        height="80"
        width="80"
        color="#009A44"
        innerCircleColor="#6FC2B4"
        middleCircleColor="#009A44"
        outerCircleColor="#ffffff"
        ariaLabel="three-circles-loading"
        wrapperStyle={{}}
        wrapperClass=""
        visible={true}
      />
    </div>
  );
};

export default Loader;
