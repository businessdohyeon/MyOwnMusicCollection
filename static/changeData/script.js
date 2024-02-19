const getData = async(id)=>{
    const res = await fetch(`http://localhost:22410/get/${id}`);
    const data = await res.json();
    console.log(data);
    return data;
}
const applyData = (data)=>{
    document.getElementsByName("background-image-url")[0].value = data["background-image-url"];
    document.getElementsByName("song-image-url")[0].value = data["song-image-url"];
    
    document.getElementsByName("title")[0].value = data["title"];
    document.getElementsByName("singer")[0].value = data["singer"];
    document.getElementsByName("lang-instrument")[0].value = data["lang-instrument"];
    
    changeRateDisplay(data.rate);

    for(key in data.platform){
        document.getElementsByName(key)[0].value = data.platform[key];
    }

    for(key in data.etc){
        const etcItemArr = document.querySelectorAll(".etc-item");
        const target = etcItemArr[etcItemArr.length-1];
        const inputs = target.querySelectorAll("input");
        inputs[0].value = key;
        inputs[1].value = data.etc[key];

        const etcItem = document.querySelector(".etc-item");
        const newNode = etcItem.cloneNode(true);
        newNode.querySelectorAll("input").forEach((input)=>{
            input.value = '';
        });
        document.querySelector("#etc").appendChild(newNode);
    }

}


const changeRateDisplay = (n)=>{
    const rateBlockArray = document.querySelectorAll(".rate-block");
    
    if(n===0){
        for(let i=0; i<rateBlockArray.length; ++i)
        rateBlockArray[i].querySelector("img").src = "../../resource/icons/musicnote-empty.png";
        return;
    }

    const integerPart = Number.parseInt(n);

    for(let i=0; i<integerPart; ++i)
        rateBlockArray[i].querySelector("img").src = "../../resource/icons/musicnote-full.png";
    for(let i=integerPart+1; i<rateBlockArray.length; ++i)
        rateBlockArray[i].querySelector("img").src = "../../resource/icons/musicnote-empty.png";
    if(!Number.isInteger(n))
        rateBlockArray[integerPart].querySelector("img").src = "../../resource/icons/musicnote-half.png";
};

const attachListener = (data)=>{
    const listeners = { mouseover: [], click: [] };

    for(let value=0.5; value <= 5.0; value += 0.5){
        listeners.mouseover.push((e)=>{
            changeRateDisplay(value);
        });
        listeners.click.push(async (e)=>{
            changeRateDisplay(value);
            data.rate = value;
        });
    };

    const rateBlockHalf_array = document.querySelectorAll(".rate-block-half");
    for(let i=0; i<rateBlockHalf_array.length; ++i){
        rateBlockHalf_array[i].addEventListener("mouseover", listeners.mouseover[i]);
        rateBlockHalf_array[i].addEventListener("click", listeners.click[i]);
    }
};




const whenDataExist = async (id)=>{
    const data = await getData(id);
    applyData(data);

    attachListener(data);
    
    document.querySelector("#input-wrapper").addEventListener("mouseleave", (e)=>{
        changeRateDisplay(data.rate);
    });

    document.querySelector("#cancel").addEventListener("click", (e)=>{
        window.location = window.location.href.split("/changeData/index.html")[0] + `/song/index.html?id=${id}`;
    });

    document.querySelector("#etc-button").addEventListener("click", (e)=>{
        const etcItem = document.querySelector(".etc-item");
        const newNode = etcItem.cloneNode(true);
        newNode.querySelectorAll("input").forEach((input)=>{
            input.value = '';
        });
        document.querySelector("#etc").appendChild(newNode);
    });


    document.querySelector("form").addEventListener("submit", async (e)=>{
        e.preventDefault();

        const formData = new FormData(e.target);

        data["background-image-url"] = formData.get("background-image-url");
        data["song-image-url"] = formData.get("song-image-url");

        data["title"] = formData.get("title");
        data["singer"] = formData.get("singer");
        data["lang-instrument"] = formData.get("lang-instrument");
        const today = new Date();
        data["ratedDate"] = `${today.getFullYear()}-${today.getMonth()+1}-${today.getDay()}`;
        
        data.platform = {};
        data.platform["youtube"] = formData.get("youtube");
        data.platform["youtubeMusic"] = formData.get("youtubeMusic");
        data.platform["spotify"] = formData.get("spotify");


        data.etc = {};
        const etcInputARr = document.querySelectorAll(".etc-item");
        etcInputARr.forEach((node)=>{
            const inputs = node.querySelectorAll("input");
            const key = inputs[0].value;
            const value = inputs[1].value;

            if(key && value){
                data.etc[key] = value;
            }
        });

        delete data["_id"];

        console.log(data);


        const replaceData = {
            id: id,
            replaceData: data
        }

        const res = await fetch("http://localhost:22410/put", {
            method: "PUT",
            headers: {
                "Content-type" : "application/json"
            },
            body: JSON.stringify(replaceData),
        });
        const result = await res.json();
        console.log(result);

        window.location = window.location.href.split("/changeData/index.html")[0] + `/song/index.html?id=${id}`;
    });
}



const whenDataDontExist = ()=>{
    const data = { rate: 0 };

    attachListener(data);

    document.querySelector("#input-wrapper").addEventListener("mouseleave", (e)=>{
        changeRateDisplay(data.rate);
    });

    document.querySelector("#cancel").addEventListener("click", (e)=>{
        window.location = window.location.href.split("/changeData/index.html")[0] + `/home/index.html`;
    });

    document.querySelector("#etc-button").addEventListener("click", (e)=>{
        const etcItem = document.querySelector(".etc-item");
        const newNode = etcItem.cloneNode(true);
        newNode.querySelectorAll("input").forEach((input)=>{
            input.value = '';
        });
        document.querySelector("#etc").appendChild(newNode);
    });

    document.querySelector("form").addEventListener("submit", async (e)=>{
        e.preventDefault();

        if(data.rate === 0){
            window.alert("Required : Rate");
            return;
        }

        const formData = new FormData(e.target);

        data["background-image-url"] = formData.get("background-image-url");
        data["song-image-url"] = formData.get("song-image-url");

        data["title"] = formData.get("title");
        data["singer"] = formData.get("singer");
        data["lang-instrument"] = formData.get("lang-instrument");
        const today = new Date();
        data["ratedDate"] = `${today.getFullYear()}-${today.getMonth()+1}-${today.getDay()}`;
        
        data.platform = {};
        data.platform["youtube"] = formData.get("youtube");
        data.platform["youtubeMusic"] = formData.get("youtubeMusic");
        data.platform["spotify"] = formData.get("spotify");


        data.etc = {};
        const etcInputARr = document.querySelectorAll(".etc-item");
        etcInputARr.forEach((node)=>{
            const inputs = node.querySelectorAll("input");
            const key = inputs[0].value;
            const value = inputs[1].value;

            if(key && value){
                data.etc[key] = value;
            }
        });

        console.table(data);

        const res = await fetch("http://localhost:22410/post", {
            method: "POST",
            headers: {
                "Content-type" : "application/json",
            },
            body: JSON.stringify(data),
        });
        const result = await res.json();
        // console.log(result);

        window.location = window.location.href.split("/changeData/index.html")[0] + `/song/index.html?id=${result.insertedId}`;
    });
}






const id = new URLSearchParams(window.location.search).get("id");
if(id){
    console.log(id);
    whenDataExist(id);
}else{
    whenDataDontExist();
}