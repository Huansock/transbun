const german = document.querySelector('#german');
const english = document.querySelector('#korean');
const checking = document.querySelector('#checking');
const btn_end = document.querySelector('#btn_end');
const btn_start = document.querySelector('#btn_start');
const script = document.querySelector('#script');
const myList = document.getElementById("myList");
const socket = new WebSocket("ws://transbun.hop.sh");
let mysrcipt = [];

//socket setting
// message is received
socket.addEventListener("message", event => {
  console.log(event.data)
  translatedMessage = JSON.stringify(event.data);
  mysrcipt.push(translatedMessage);
  english.innerHTML = translatedMessage;

  let li = document.createElement("li");
  li.appendChild(document.createTextNode(updateTime()+":     "+translatedMessage));
  myList.appendChild(li);
});

// socket opened
socket.addEventListener("open", event => {
  console.log("Connected to server");
  socket.send(JSON.stringify({ type: "message", data: "Hello Server!" }));
});

// socket closed
socket.addEventListener("close", event => {});

// error handler
socket.addEventListener("error", event => {});


// 현재시간
let currentTimeElement = document.getElementById('currentTime');
function updateTime() {
  let currentTime = new Date().toLocaleTimeString();
  currentTimeElement.textContent = currentTime;
  return currentTime;
}
setInterval(updateTime, 1000);


// 음성인식 객체 생성

let SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

function 한국어집어넣기(한국어번역) {
    document.getElementById("translated").innerHTML = 한국어번역;
  }
  
  // 메세지를 주는 함수
  const message = async (fin_text, interim, isfinal) => {
    let de_text = `${fin_text || interim}`;
    german.innerHTML = de_text;
    if (isfinal) socket.send(JSON.stringify({ type: "message", data: de_text }));
  }

  
  // 브라우저 체킹 함수
  function checkCompatibility() {
    if (!recognition) {
      checking.innerHTML =
        "recgnotion is not supported by your browser.";
    } else {
      checking.innerHTML =
        "recognition is supported by your browser.";
    }
  }
  //  끝나는 이벤트에 대한 핸들러

    function onend(e) {
      recognition.start();
    }

  //  결과값 이벤트 핸들러
  function onresult(event) {
    let fin_text = "";
    let interim = "";
    let isfinal = false;
    // console.log(event.results.length)
    // console.log(event.results)
    // console.log(event.results.transcript)
  
    for (let i = 0; i < event.results.length; i++) {
      let res = event.results[i];
      let trans = res[0].transcript;
      if (res.isFinal) {
        fin_text += trans;
        isfinal = true;
      } else {
        interim += trans;
      }
    }
    message(fin_text.trim(), interim.trim(), isfinal);
  }
  
  function onstart(e) {
    checkCompatibility();
  }
  btn_start.onclick = () => {
    recognition.start();

  };
  btn_end.onclick = () =>{

    recognition.stop();
  };
  // 기본적인 음성인식 설정
  recognition.lang = "de";
  recognition.continuous = false;
  recognition.interimResults = true;
  recognition.maxAlternatives = 10000;
  recognition.onresult = onresult;
  recognition.onend = onend;
  recognition.onstart = onstart;
  recognition.start();