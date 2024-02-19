const $ = query => document.querySelector(query);

const getData = async(id)=>{
    const res = await fetch(`http://localhost:22410/get/${id}`);
    const data = await res.json();
    console.log(data);
    return data;
};
const applyData = (data)=>{
    $("#background-image").style.backgroundImage = `url("${data["background-image-url"]}")`;
    $(".cd").style.backgroundImage = `url("${data["song-image-url"]}")`;

    $("#title").innerText = data.title;
    
    $("#singer").href = `../list/index.html?searchContent=${data.singer}`;
    $("#singer").innerText = data.singer;
    
    $("#lang-instrument").href = `../list/index.html?searchContent=${data["lang-instrument"]}`;
    $("#lang-instrument").innerText = data["lang-instrument"];
    
    $("#edit a").href = `../changeData/index.html?id=${data._id}`;

    $("#delete button").addEventListener("click", async(e)=>{
        if(window.confirm("delete?")){

            const res = await fetch(`http://localhost:22410/delete`, {
                method: "DELETE",
                headers: {
                    "Content-type" : "application/json"
                },
                body: JSON.stringify({id})
            });
            const result = await res.json();
            console.log(result);

            window.location = window.location.href.split("/song/index.html")[0] + "/home/index.html";
        }
    });

    const left = $("#left");
    left.innerHTML = "";
    for(key in data.platform){
        if(data.platform[key]){
            const newNode = document.createElement("a");
            const innerImage = document.createElement("img");
            newNode.href = data.platform[key];
            innerImage.src = `../../resource/icons/${key}.png`;
            newNode.appendChild(innerImage);
            left.appendChild(newNode);
        }
    }

    changeRateDisplay(data.rate);

    $("#middle #rate-info").innerText = `Rate Score : ${data.rate} / Rated at : ${data.ratedDate}`;
    
    const right = $("#right");
    right.innerHTML = "";
    for(key in data.etc){
        // console.log(key);
        const newNode = document.createElement("a");
        newNode.href = `../list/index.html?searchContent=${key}=${data.etc[key]}`;
        newNode.innerText = `${key} : ${data.etc[key]}`;
        right.appendChild(newNode);
    }
};





const changeRateDisplay = (n)=>{
    const rateBlockArray = document.querySelectorAll(".rate-block");
    const integerPart = Number.parseInt(n);
    
    for(let i=0; i<integerPart; ++i)
        rateBlockArray[i].querySelector("img").src = "../../resource/icons/musicnote-full.png";
    for(let i=integerPart+1; i<rateBlockArray.length; ++i)
        rateBlockArray[i].querySelector("img").src = "../../resource/icons/musicnote-empty.png";
    if(!Number.isInteger(n))
        rateBlockArray[integerPart].querySelector("img").src = "../../resource/icons/musicnote-half.png";
};
const changeRateValue = async(n)=>{
    const today = new Date();
    const data = { 
        id: id, 
        replaceData : {
            rate: n,
            ratedDate: `${today.getFullYear()}-${today.getMonth()+1}-${today.getDay()}`
        } 
    };
    const res = await fetch(`http://localhost:22410/put`, {
        method: "PUT",
        headers: {
            "Content-type" : "application/json"
        },
        body: JSON.stringify(data),
    });
    const result = await res.json();
    console.log(result);
};



const attachListener = (data)=>{
    const listeners = { mouseover: [], click: [] };

    for(let value=0.5; value <= 5.0; value += 0.5){
        listeners.mouseover.push((e)=>{
            changeRateDisplay(value);
        });
        listeners.click.push(async (e)=>{
            await changeRateValue(value);
            data = await getData(id);
            applyData(data);
        });
    };

    const rateBlockHalf_array = document.querySelectorAll(".rate-block-half");
    for(let i=0; i<rateBlockHalf_array.length; ++i){
        rateBlockHalf_array[i].addEventListener("mouseover", listeners.mouseover[i]);
        rateBlockHalf_array[i].addEventListener("click", listeners.click[i]);
    }
};





const run = async (id)=>{
    let data = await getData(id);
    applyData(data);

    attachListener(data);
    
    $("#input-wrapper").addEventListener("mouseleave", (e)=>{
        changeRateDisplay(data.rate);
    });
    
};



const id = new URLSearchParams(window.location.search).get("id");
if(!id){
    window.alert("NOT VALID ID");
    window.location = window.location.href.split("/song/index.html")[0] + "/home/index.html";
}
run(id);