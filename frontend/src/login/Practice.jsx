import React, { useEffect } from "react";
import { useState } from "react";
import { FiPaperclip } from 'react-icons/fi'; 
import { useRef } from "react";

export const Practice = () => {
  const [count, setCount] = useState(0)
  const [Inputvalue, setInput] = useState("")
  const [Isrunning, setIsrunning] = useState(false)
    const focusinput = useRef(null)
  useEffect(() => {
  var interval
   if(Isrunning){
     interval = setInterval(() => {
      setCount(prev=> prev+1)
    }, 1000);
   }
   console.log(count)
   return () => clearInterval(interval);
  }, [Isrunning])
  const restart = ()=>{
    setCount(0)
    setIsrunning(true)
  }
  const clear=()=>{
    setInput("");
    focusinput.current.focus()
    
  }
  return (
    <>
    <div className="bg-green-300 border-2 border-amber-700 h-[500px] w-[100%]">
     <button onClick={()=>(setIsrunning(true))} className="bg-red-500">start</button>
     <div>||||</div>
     <button onClick={()=>(setIsrunning(false))} className="bg-red-500">stop</button>
     <div>||||</div>
     <button onClick={()=>(setCount(0))} className="bg-red-500">reset</button>
     <div>||||</div>
     <button onClick={restart} className="bg-red-500">restart</button>
     <div>{count}</div>

     <input type="text" 
     ref={focusinput} 
      value={Inputvalue}
     onChange={(e)=>setInput(e.target.value)}/><button onClick={clear} > submit</button>

     {/* <button onClick={() => setIsrunning(prev => !prev)} className="bg-yellow-500">
  {Isrunning ? "Pause" : "Resume"}
</button> */}
    </div>
    </>
  );
};
