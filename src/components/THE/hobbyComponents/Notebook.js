import { motion, useAnimation } from "framer-motion";
import { useState } from "react";

const Notebook = () => {
    const controls = useAnimation();
    const parentControls = useAnimation();

    const openBook = () => {
      controls.start({ 
        rotateY: -180, 
        width: "90%",
        transformOrigin: "left",
        transition: {
          duration: 0.75, 
          ease: "easeInOut"
        }
      });
      parentControls.start({ x: '42.5%', transition: {
        duration: 0.75, 
        ease: "easeInOut"
      } });
    };
  
    const closeBook = () => {
      controls.start({
        rotateY: 0,
        width: "100%",
        transformOrigin: "left",
        transition: {
          duration: 0.75, 
          ease: "easeInOut"
        }
      });
      parentControls.start({ x: 0, transition: {
        duration: 0.75, 
        ease: "easeInOut"
      } });

    };
  
    return (
        <motion.div 
        className="flex flex-col w-2/4 h-3/5 xl:h-4/5 2xl:w-2/5 items-center relative"
        animate={parentControls}
      >
        {/* This is the "cover" of the notebook */}
        <motion.div
          className="w-full h-full bg-blue-500 absolute z-10"
          initial={{ rotateY: 0, transformOrigin: "left" }}
          animate={controls}
        >
          {/* Contents of the notebook would go here */}
        </motion.div>
        {/* This is the "back" of the notebook */}
        <div className="w-full h-full bg-red-500 absolute z-0">
          {/* Contents of the notebook's back would go here */}
        </div>
        {/* These are the "buttons" to open and close the notebook */}
        <button onClick={openBook} className="z-20 relative">Open Notebook</button>
        <button onClick={closeBook} className="z-20 relative">Close Notebook</button>
      </motion.div>
    );
  };
  
  export default Notebook;
  
  
  


