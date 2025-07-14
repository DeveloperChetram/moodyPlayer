import  { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";

const MoodDetector = () => {
  const videoRef = useRef(null);
  const [expression, setExpression] = useState("Detecting...");

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

  useEffect(() => {
    const detectExpression = async () => {
      if (videoRef.current && videoRef.current.readyState === 4) {
        const detection = await faceapi
          .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
          .withFaceExpressions();
        if (!detection || !detection.expressions) {
            setExpression("No face detected");
            console.log("No face detected");
        }

        if (detection && detection.expressions) {
  let topExpression = '';
  let topValue = 0;

  for (const [key, value] of Object.entries(detection.expressions)) {
    if (value > topValue) {
      topValue = value;
      topExpression = key;
    }
  }

  console.log(`Top Expression: ${topExpression} (${(topValue * 100).toFixed(2)}%)`);
  setExpression(topExpression);
}
      } 
    };

    const interval = setInterval(detectExpression, 500); // check every 2s
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ textAlign: "center" }}>
      <h2>Facial Expression: {expression}</h2>
      <video
        ref={videoRef}
        autoPlay
        muted
        width="320"
        height="240"
        style={{ border: "2px solid #333", borderRadius: "10px" }}
      />
    </div>
  );
};

export default MoodDetector;
