import React, {useRef} from 'react';
import * as tf from '@tensorflow/tfjs';
import * as bodyPix from '@tensorflow-models/body-pix';
import Webcam from 'react-webcam';
import './App.css';

function App() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  const runBodySegment = async () =>
  {
    const net = await bodyPix.load();
    console.log("Bodypix model loaded!");
    setInterval(()=>{
      detect(net);
    },500);
  };

  const detect = async(net) =>
  {
    if(webcamRef.current && webcamRef.current.video.readyState === 4)
    {
      const video = webcamRef.current.video;
      const videoHeight = video.videoHeight;
      const videoWidth = video.videoWidth;

      canvasRef.current.height = videoHeight;
      canvasRef.current.width = videoWidth;

      const person = await net.segmentPersonParts(video);
      console.log(person);

      const coloredPartImage = bodyPix.toColoredPartMask(person);

      bodyPix.drawMask(
        canvasRef.current,
        video,
        coloredPartImage,
        0.5,0,false
      );
    }
  }
  runBodySegment();

  return (
    <div className="App">
      <header className="App-header">
        <Webcam ref={webcamRef}
        style = {{
          position: 'absolute',
          marginLeft: 'auto',
          marginRight: 'auto',
          left: 0,
          right: 0,
          textAlign: 'center',
          zIndex:9,
          width: '65vw',
          height: 'auto',
        }} />

        <canvas ref = {canvasRef}
          style = {{
            position: 'absolute',
            marginLeft: 'auto',
            marginRight: 'auto',
            left: 0,
            right: 0,
            textAlign: 'center',
            zIndex:9,
            width: '65vw',
          height: 'auto',
          }} />

      </header>
    </div>
  );
}

export default App;
