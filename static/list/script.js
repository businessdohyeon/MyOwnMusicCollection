const getData = async (query)=>{
    // console.log(`http://localhost:22410/getAll/?q=${JSON.stringify(query)}`)
    const res = await fetch(`http://localhost:22410/getAll/?q=${JSON.stringify(query)}`);
    const results = await res.json();
    console.log(results);
    return results;
};

const addItem = (data)=>{
    const template = document.querySelector("#list-item").content;
    const ul = document.querySelector("main ul");
    const newNode = template.cloneNode(true);

    newNode.querySelector("a").href = `../song/index.html?id=${data._id}`;
    newNode.querySelector(".singer").innerText = data.singer;
    newNode.querySelector(".lang-instrument").innerText = data["lang-instrument"];
    newNode.querySelector(".title").innerText = data.title;
    newNode.querySelector(".rate").innerText = `🎵 ${data.rate}`;
    newNode.querySelector(".cd").style.backgroundImage = `url("${data["song-image-url"]}")`;

    ul.appendChild(newNode);
};

//제목
const byTitle = async (title)=>{
    const results = await getData({title});
    if(!results.length) return;
    results.forEach((data)=>{
        addItem(data);
    });
};
//가수
const bySinger = async (singer)=>{
    const results = await getData({singer});
    if(!results.length) return;
    results.forEach((data)=>{
        addItem(data);
    });
};
//언어
const byLangInstrument = async (langInstrument)=>{
    const results = await getData({"lang-instrument" : langInstrument});
    if(!results.length) return;
    results.forEach((data)=>{
        addItem(data);
    });
};
//etc는 파싱해야함
const byEtc = async (etc)=>{
    const results = await getData({etc});
    if(!results.length) return;
    results.forEach((data)=>{
        addItem(data);
    });
};



const run = async()=>{
    document.querySelector("#searchBox form").addEventListener("submit", (e)=>{
        e.preventDefault();
        const input = e.target.querySelector("input").value;
        window.location = window.location.href.split("index.html")[0] + `index.html?searchContent=${input}`;
    });
    
    const searchContent = new URLSearchParams(window.location.search).get("searchContent");
    console.log("searchContent", searchContent);

    document.querySelector("#searchContent").placeholder = searchContent;

    await byTitle(searchContent);
    await bySinger(searchContent);
    await byLangInstrument(searchContent);
    if(searchContent.match("=")){
        const splited = searchContent.split("=");
        const etc = {};
        etc[splited[0]] = splited[1];
        await byEtc(etc);
    }
    // 중복은??? 흠..
};

run();