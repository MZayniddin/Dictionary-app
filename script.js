const formEl = document.querySelector(".form");
const inputText = document.querySelector(".input-text");
const BASE_URL = "https://api.dictionaryapi.dev/api/v2/entries/en/";

const outputWord = document.querySelector(".word");
const outputWrapper = document.querySelector(".wrapper");

formEl.addEventListener("submit", (e) => {
  e.preventDefault();
  clearWrapper();
  (async () => {
    try {
      const RESPONSE = await fetch(`${BASE_URL}${inputText.value}`);
      const DATA = await RESPONSE.json();
      RESPONSE.status === 200 ? render(DATA) : renderError(DATA);
    } catch (error) {
      console.error(error);
    }
  })();

  function render(data) {
    data.forEach((item) => {
      outputWord.innerHTML = `${item.word}${item.findPhonetic()}`;
      const defArr = item.meanings[0].definitions.findDifinition();
      renderDefinitions(defArr, "Definitions");
      const expleArr = item.meanings[0].definitions.findExample();
      renderDefinitions(expleArr, "Examples");
    });
    renderAudio(data[0].phonetics);
  }
});

function renderDefinitions(arr, findedItem) {
  if (arr.length !== 0) {
    const elDefDiv = document.createElement("div");
    const elTitle = document.createElement("h4");
    elTitle.innerHTML = `${findedItem}:`;
    elDefDiv.appendChild(elTitle);
    arr.forEach((data) => {
      const elDefP = document.createElement("p");
      elDefP.innerHTML = data;
      elDefDiv.appendChild(elDefP);
    });
    outputWrapper.appendChild(elDefDiv);
  }
}

function renderAudio(arr) {
  let audioArr = [];
  arr.forEach((data) => {
    if (data?.audio) {
      audioArr.push(data.audio);
    }
  });
  audioArr.forEach((audio) => {
    const audioEl = document.createElement("div");
    audioEl.className = 'audio';
    audioEl.innerHTML = `
    <button class="btn-play"><audio src="${audio}"></audio></button>
    <span class="mp-text">Listen the pronunciation</span>
    `
    outputWrapper.appendChild(audioEl);
  });
  outputWrapper.addEventListener('click', (e) => {
    if(e.target.classList.contains('btn-play')){
      e.target.children[0].play();
    }
  })
}

function renderError(data) {
  outputWord.innerHTML = data.title;
  const errMsg = document.createElement("div");
  errMsg.className = "error-msg";
  errMsg.innerHTML = `<p>${data.message}<br>${data.resolution}</p>`;
  outputWrapper.appendChild(errMsg);
}

function clearWrapper() {
  while (outputWrapper.children[1]) {
    outputWrapper.removeChild(outputWrapper.children[1]);
  }
}

Object.prototype.findPhonetic = function () {
  if (this.phonetic) {
    return " - " + this.phonetic.replace(/\//g, "");
  } else if (this.phonetics.length !== 0 && this.phonetics[1].text) {
    return " - " + this.phonetics[1].text.replace(/\//g, "");
  } else {
    return "";
  }
};

Array.prototype.findDifinition = function () {
  let definitionsArr = new Array();
  this.forEach((item) => {
    definitionsArr.push(item.definition);
  });
  return definitionsArr;
};

Array.prototype.findExample = function () {
  let examplesArr = new Array();
  this.forEach((item) => {
    item.example ? examplesArr.push(item.example) : null;
  });
  return examplesArr;
};
