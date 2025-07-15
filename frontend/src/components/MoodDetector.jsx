import { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";
import { motion } from "motion/react";
import { moodPlaylists } from "../music";


const MoodDetector = () => {

  const videoRef = useRef(null);
  const [expression, setExpression] = useState("Detecting...");
  const [detectClicked, setdetectClicked] = useState(false);
  const [playToggle, setplayToggle] = useState(false);
  const [MoodyPlalist, setMoodyPlalist] = useState(moodPlaylists)
  
  // Load models

  useEffect(() => {
    const loadModels = async () => {
      await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
      await faceapi.nets.faceExpressionNet.loadFromUri("/models");
      startVideo();
    };
    loadModels();
  }, []);

  // Start webcam
  console.log (moodPlaylists)
  const startVideo = () => {
    navigator.mediaDevices
      .getUserMedia({ video: {} })
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch((err) => console.error("Error accessing webcam:", err));
  };

  // Detect expression

  const detectHandler = async () => {
    const detectExpression = async () => {
      if (videoRef.current && videoRef.current.readyState === 4) {
        const detection = await faceapi
          .detectSingleFace(
            videoRef.current,
            new faceapi.TinyFaceDetectorOptions()
          )
          .withFaceExpressions();
        if (!detection || !detection.expressions) {
          setExpression("No face detected");
          console.log("No face detected");
        }

        if (detection && detection.expressions) {
          let topExpression = "";
          let topValue = 0;

          for (const [key, value] of Object.entries(detection.expressions)) {
            if (value > topValue) {
              topValue = value;
              topExpression = key;
            }
          }

          console.log(
            `Top Expression: ${topExpression} (${(topValue * 100).toFixed(2)}%)`
          );
          setExpression(topExpression);
        }
      }
    };

    await detectExpression().then(() => {
      setdetectClicked(true);
    });
  };
const filterSong= MoodyPlalist.filter((item)=>{
  return item.moodType === expression;
})
  const renderedSong = filterSong.map((song,index)=>{

    return(
      song.music.map((item, index) => {
       return(
         <div className="flex flex-col gap-5" key={index}>
         <div className="flex items-center relative ">
           <div  className="w-[70px] h-[70px] bg-[#54886e] rounded-xl flex items-center justify-center mt-4">
            <img src={item.imageUrl} className="object-cover w-full h-full rounded-xl"   alt="song cover" />

          </div>
         <div className="ml-4 flex flex-col justify-center">
           <span>{item.title}</span>
          <span className="text-[.9rem] font-extralight opacity-75 mt-[-5px]" >{item.artist}</span>
         </div>
         <motion.button
          whileTap={{ scale: 0.9 }}
          whileHover={{ backgroundColor: "#09a859" }} 
          className="px-3 py-1  bg-[#54886e] mt-4 cursor-pointer rounded-lg absolute right-0"
          onClick={()=>{
       
            setplayToggle(!playToggle);
          }}
          > 
          
          {playToggle? "Pause" : "Play"}
        </motion.button>
         </div>
          <div>
        <hr />

          </div>
        </div>
       )
      })
    )
  })



  return (
    <>
      <div className="text-center p-4 mt-8 flex flex-col items-center">
        {/* <h2>Facial Expression: {expression}</h2> */}
        <video
          ref={videoRef}
          autoPlay
          muted
          width="460"
          height="380"
          style={{ border: "2px solid #333", borderRadius: "10px" }}
        />
        <motion.button
          whileTap={{ scale: 0.9 }}
          whileHover={{ backgroundColor: "#09a859" }}
          onClick={detectHandler}
          className="px-4 py-2  bg-[#54886e] mt-4 cursor-pointer rounded-lg"
        >
          {" "}
          Detect Mood
        </motion.button>
      </div>
      <div className="w-[40%] mx-auto  p-4">
        <p
          className={` detectPara text-lg mt-4 text-start ${
            detectClicked ? "block" : "hidden"
          }  `}
        >
          Your mood is: {expression}
        </p>
      
        {renderedSong}
      </div>
    </>
  );
};

export default MoodDetector;
