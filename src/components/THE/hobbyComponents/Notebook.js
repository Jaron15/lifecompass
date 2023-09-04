import { motion, useAnimation } from "framer-motion";
import { useState } from "react";

const Notebook = () => {
    const controls = useAnimation();
    const parentControls = useAnimation();
    const sPageRender = useAnimation();
    const [isOpen, setIsOpen] = useState(false)
console.log(isOpen);
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
      sPageRender.start({
        opacity: 1,
        transition: { delay: .25, ease: "easeInOut" }
    })
      setIsOpen(true)
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
      sPageRender.start({
        opacity: 0,
        transition: { delay: .50, ease: "easeInOut" }
    })
      setIsOpen(false)
    };
  
    return (
        <motion.div 
        className="flex flex-col w-2/4 h-3/5 xl:h-4/5 2xl:w-2/5 items-center relative"
        animate={parentControls}
      >
        <motion.div
          className="w-full h-full bg-white absolute z-10"
          initial={{ rotateY: 0, transformOrigin: "left" }}
          animate={controls}
        >
        
        <motion.div 
            className="w-full h-full"
            style={{
                backgroundImage: 'url("/compbackground.png")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
            initial={{ 
                backgroundImage: 'url("/compbackground.png")',
                borderRight: '0px solid transparent'
            }}
            animate={{ 
                backgroundImage: isOpen ? "" : 'url("/compbackground.png")',
                backgroundColor: 'white', 
                borderRight: isOpen ? "2px solid black" : "0px solid transparent",
                transition: { delay: 0.45, ease: "easeInOut" }
            }}
            >
        </motion.div>
            
          {/* cover/page1 */}
        </motion.div>
        {/* This is the "back" of the notebook */}
        <motion.div 
        initial={{opacity: 0}}
        animate={sPageRender}
        className="w-full h-full bg-white absolute z-0">
         {/* the page 2 */}
        </motion.div>
        {/* These are the "buttons" to open and close the notebook */}
        <button onClick={openBook} className="z-20 relative">Open Notebook</button>
        <button onClick={closeBook} className="z-20 relative">Close Notebook</button>
      </motion.div>
    );
  };
  
  export default Notebook;
  
  
  


