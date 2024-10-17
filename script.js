const sideNavigation = document.querySelector('.side-navigation'),
sideBarToggle = document.querySelector('.fa-bars'),
startContentUl = document.querySelector('.startContent ul'),
inputArea = document.querySelector('.inputArea input'),
sendRequest = document.querySelector('.fa-paper-plane'),
chatHistory = document.querySelector('.chatHistory ul'),
startContent = document.querySelector('.startContent'),
chatContent = document.querySelector('.chatContent'),
results = document.querySelector('.results');

promtQuestions = [
    {
        question: "Write a thankyou note",
        icon: "fa-solid fa-wand-magic-sparkles",
    },
    {
        question: "Suggest a healthy recipe",
        icon: "fa-solid fa-apple-alt",
    },
    {
        question: "Provide tips for time management",
        icon: "fa-solid fa-clock",
    }
];

window.addEventListener('load', () => {
    promtQuestions.forEach((data) => {
        let items = document.createElement('li');

        items.addEventListener('click', () => {
            getResponse(data.question, true);
        });

        items.innerHTML = `<div class = "promtSuggestion">
        <p>${data.question}</p>
        <div class = "icon"><i class="${data.icon}"></i></div>
        </div>`

        startContentUl.append(items);
    });
});

sideBarToggle.addEventListener('click', () => {
    sideNavigation.classList.toggle('explandClose');
});

inputArea.addEventListener('keyup', (e) => {
    if(e.target.value.length>0){
        sendRequest.style.display = 'inline';
    }
    else{
        sendRequest.style.display = 'none';
    }
});

sendRequest.addEventListener('click', () => {
    getResponse(inputArea.value, true)
});

function getResponse(question, appendHistory){
    console.log(question);

    if(appendHistory) {
        let historyLI = document.createElement('li');
        historyLI.addEventListener('click', () => {
            getResponse(question, false);
        });
        historyLI.innerHTML = `<i class="fa-regular fa-message"></i>${question}`;
        chatHistory.append(historyLI);
    }


  
    results.innerHTML = "";
    inputArea.value = "";

    startContent.style.display = "none";
    chatContent.style.display = "block";

    let resultTitle = `
    <div class="resultTitle">
        <p>${question}</p>
    </div>
    `;

    let resultData = `
        <div class="resultData">
            <img src="https://img-s-msn-com.akamaized.net/tenant/amp/entityid/BB1iflYi.img?w=500&h=576&m=6" />
            <div class="loader">
                <div class="animatedBg"></div>
                <div class="animatedBg"></div>
                <div class="animatedBg"></div>
            </div>
        </div>
    `;


    results.innerHTML += resultTitle;
    results.innerHTML += resultData;

    const AIURL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyA5r4i9HR0ewcDsg-T2GrLuXPXKm_2RFMM'
    fetch(AIURL, {
        method: 'POST',
        body: JSON.stringify({
            contents :[{"parts":[{"text": question}]}],
        }),
        
    })
    .then((response) => response.json())
    .then((data) => {

        document.querySelector('.results .resultData').remove();

        let responseData = jsonEscape(data.candidates[0].content.parts[0].text);
    console.log(responseData);

    let responseArray = responseData.split('**');
    let newResponse = "";

    for (let i = 0; i < responseArray.length; i++) {
        if (i === 0 || i % 2 !== 1) {
            newResponse += responseArray[i];
        } else {
            newResponse += '<strong>' + responseArray[i].split(" ").join('&nbsp') + '</strong>';
        }
    }

    let newResponse2 = newResponse.split('**').join(' ');

    let textArea = document.createElement('textArea');
    textArea.innerHTML = newResponse2;

    results.innerHTML += `
        <div class="resultResponse">
            <img src="https://img-s-msn-com.akamaized.net/tenant/amp/entityid/BB1iflYi.img?w=500&h=576&m=6" />
            <p id="typeEffect">${newResponse}</p>
        </div>
        `;

        let newResponseData = newResponse2.split(' ');
        for(let j = 0; j < newResponseData.length; j++) {
            timeout(j, newResponseData[j] + " ");
        }
            
        });
}
const timeout = (index, nextWord) => {
    setTimeout(() => {
        document.getElementById('typeEffect').innerHTML += nextWord;
    }, 70 * index);
};
function newChat() {
    startContent.style.display = "block";
    chatContent.style.display = "none";
}

function jsonEscape(str) {
    return str.replace(new RegExp('\r?\n\n','g'),'<br>')
    .replace(new RegExp('\r?\n','g'),'<br>');
};