import StreakTracker from "@/src/components/streak/StreakTracker";
import { motion, useAnimation } from "framer-motion";
import { useState } from "react";
import Overview from "./overview/Overview";
import Goals from "./goals/Goals";

const Notebook = ({hobby}) => {
    const controls = useAnimation();
    const parentControls = useAnimation();
    const sPageRender = useAnimation();
    const [isOpen, setIsOpen] = useState(false)
    const [selectedPage, setSelectedPage] = useState("Overview");
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
  
  const renderPageContent = () => {
    switch (selectedPage) {
      case "Overview":
        return <Overview hobby={hobby} />;
      case "Goals":
        return <Goals hobby={hobby} />; 
        
      case "Progress":
        // return <Progress hobby={hobby} />; 
        return <div>Progress Page</div>;
      case "Streaks":
        // return <Streaks hobby={hobby} />;
        return <div>Streaks Page</div>;
      case "Notes":
        // return <Notes hobby={hobby} />;
        return <div>Notes Page</div>;
      default:
        return <Overview hobby={hobby} />;
    }
  };


    return (
      <>
        <motion.div 
        className="flex flex-col w-10/12 h-4/6 sm:w-2/4 sm:h-3/5 md:h-4/6 xl:h-4/5 2xl:w-2/5 items-center relative rounded-md shadow shadow-2xl

        "
        animate={parentControls}
      >
        <motion.div
          className="w-full h-full bg-white absolute z-10 rounded-md "
          initial={{ rotateY: 0, transformOrigin: "left" }}
          animate={controls}
        >
        
        <motion.div 
            className="w-full h-full bg-contain md:bg-cover rounded-md shadow shadow-2xl"
            style={{
                backgroundImage: 'url("/compbackground.png")',
              
                backgroundPosition: 'left',
            }}
            initial={{ 
                backgroundImage: 'url("/compbackground.png")',
                borderLeft: '0px solid transparent'
            }}
            animate={{ 
                backgroundImage: isOpen ? "" : 'url("/compbackground.png")',
                backgroundColor: 'white', 
                borderLeft: isOpen ? "2px solid grey" : "0px solid transparent",
                transition: { delay: 0.45, ease: "easeInOut" }
            }}
            >

<motion.div 
initial={{
    opacity: 1
}}
animate={{
    opacity: isOpen ? 0 : 1,
    transition: { delay: isOpen ? .25 : .45, ease: "easeInOut" }
}}
className="absolute top-14 left-[23%] w-4/6 h-1/3 bg-white border border-black rounded-md overflow-clip">
        <div className="m-2 flex-col justify-center items-center text-center h-[90%]">
            <div className="text-center text-black uppercase font-bold mb-2  ">
                Subject
            </div>
            <div className="text-center text-gray-700  self-center mx-auto flex items-center overflow-hidden h-[80%] break-words w-[90%]">
                <div className="h-full w-full text-center md:pt-4 break-words font-handwritten text-black sm:text-3xl md:text-4xl xsm:text-5xl xl:text-6xl">
                {hobby.name}
                </div>
            </div>
        </div>
    </motion.div>

{isOpen && (
  <motion.div
    className="w-full h-full z-20 rounded-md flex flex-col justify-between p-4 py-24 items-center text-2xl border border-black"
    initial={{ opacity: 0 }}
    animate={{
      opacity: 1,
      transition: { delay: 0.6},
    }}
  >
     {["Overview", "Goals", "Progress", "Streaks", "Notes"].map((text, index) => (
        <motion.div
          key={index}
          className={`text-black cursor-pointer ${selectedPage === text ? "underline" : ""}`}
          style={{ transform: 'rotateY(180deg)' }}
          initial={{ opacity: 0, }}
          animate={{ opacity: 1, }}
          transition={{ delay: 0.8 + index * 0.20 , duration: .25}}
          onClick={() => setSelectedPage(text)}
        >
          {text}
        </motion.div>
    ))}
  </motion.div>
)}
 
        </motion.div>
          {/* cover/page1 */}
        </motion.div>
        {/* This is the "back" of the notebook */}
        <motion.div 
        initial={{opacity: 0}}
        animate={sPageRender}
        className="w-full h-full bg-white absolute z-0 rounded-md shadow shadow-2xl border border-black">
         {/* the page 2 */}
         <div className="overflow-scroll h-full w-full overflow-x-clip">
        {renderPageContent()}
      </div>
        </motion.div>
       
      </motion.div>
      {/* These are the "buttons" to open and close the notebook */}
 <div className="mt-4 flex justify-center space-x-4 absolute z-50 bottom-15">
 <button onClick={openBook}>Open Notebook</button>
 <button onClick={closeBook}>Close Notebook</button>
</div>
</>
    );
  };
  
  export default Notebook;
  
  
  


