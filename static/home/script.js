fetch("http://localhost:22410/getAll")
.then((res)=>{
    return res.json();
}).then((results)=>{
    console.log(results);

    const template = document.querySelector("#list-item");
    const list = document.querySelector("main ul");
    results.forEach((data)=>{
        const clone = template.content.cloneNode(true);
        clone.querySelector("a").href = `../song/index.html?id=${data._id}`;
        clone.querySelector(".singer").innerText = data.singer;
        clone.querySelector(".lang-instrument").innerText = data["lang-instrument"];
        clone.querySelector(".title").innerText = data.title;
        clone.querySelector(".rate").innerText = `🎵 ${data.rate}`;
        clone.querySelector(".cd").style.backgroundImage = `url("${data["song-image-url"]}")`;

        list.appendChild(clone);
    });

    let sum = 0;
    results.forEach((data)=>{
        sum += data.rate;
    });
    const stastics = document.querySelector("#stastics");
    stastics.innerText = `${results.length} Songs | ${sum} Rates | ${(sum/results.length).toFixed(2)} Average Rate`;

    const langInstrumentArray = new Set();
    results.forEach((data)=>{
        langInstrumentArray.add(data["lang-instrument"]);
    });
    const searchQuick = document.querySelector("#searchQuick");
    searchQuick.innerHTML = "";
    langInstrumentArray.forEach((item)=>{
        const newNode = document.createElement("a");
        newNode.href = `../list/index.html?searchContent=${item}`;
        newNode.innerText = item;
        searchQuick.appendChild(newNode);
    });

    document.querySelector("#searchBox form").addEventListener("submit", (e)=>{
        e.preventDefault();
        const input = e.target.querySelector("input").value;
        window.location = window.location.href.split("/home/index.html")[0] + `/list/index.html?searchContent=${input}`;
    });
});