import React, {useRef, useEffect, useState} from "react";

function App() {
  const [videoDevice, setvideoDevice] = useState(null);
  const [videoDevices, setVideoDevices] = useState([]);
  const videoRef = useRef(null);
  const [stream, setStream] = useState(null);
  const videoDeviceId = videoDevices.length > 0 ? videoDevices[0].deviceId : undefined;

  function setVideoDeviceId() {
    navigator.mediaDevices.getUserMedia({ video: { deviceId: videoDeviceId }, audio: false })
      .then((mediaStream) => {
        setStream(mediaStream);
      })
      .catch((error) => {
        console.error('Unable to access webcam:', error);
      });
  }
  

  // const [audioDevices, setAudioDevices] = useState([]);
  // const [audioDevice, setAudioDevice] = useState(null);
  // const audioRef = useRef(null);

  // function setVideo() {
  //   mediaDevices.then((devices) => {
  //     const mediaDevices = devices.filter(device => device.kind === 'videoinput');
  //     setVideoDevices(mediaDevices);
  //     setvideoDevice(mediaDevices[0] || null);
  //   });
  // }

  function getVideo() {
    navigator.mediaDevices.getUserMedia({video:true}).then(stream => {
      let video = videoRef.current;
      video.srcObject = stream;
      video.play();
    })
    .catch(err => {
      console.error(err);
    });
  }

  // useEffect(() => {
  //   getVideo();
  // })

  useEffect(() => {
    navigator.mediaDevices.enumerateDevices()
      .then((devices) => {
        const videoDevices = devices.filter((device) => device.kind === 'videoinput');
        setVideoDevices(videoDevices);
      })
      .catch((error) => {
        console.error('Unable to enumerate video devices:', error);
      });
  
    navigator.mediaDevices.addEventListener('devicechange', (event) => {
      navigator.mediaDevices.enumerateDevices()
        .then((devices) => {
          const videoDevices = devices.filter((device) => device.kind === 'videoinput');
          setVideoDevices(videoDevices);
        })
        .catch((error) => {
          console.error('Unable to enumerate video devices:', error);
        });
    });
  }, []);

  // for when video device is unplugged
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => {
          track.stop();
        });
      }
    };
  }, [stream]);

  return (
  <div className='App'>
    <nav>
      <a href="a">Home</a>
    </nav>
    <div className='camera'>
      <video ref={videoRef}></video>
    </div>
    <div>
    <select value={videoDeviceId} onChange={(event) => setVideoDeviceId(event.target.value)}>
      {videoDevices.map((device) => (
        <option key={device.deviceId} value={device.deviceId}>
          {device.label}
        </option>
      ))}
    </select>
    <video ref={videoRef} autoPlay={true} />
  </div>
  </div>);
}

export default App;