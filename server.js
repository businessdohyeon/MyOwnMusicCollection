module.exports = ()=>{
    const PORT = 22410;
    const db = require("./db")();
    const express = require("express");
    const server = express();

    server.use(express.json());

    server.get("/", (req, res)=>{
        res.end("server alive");
    });

    server.get("/getAll", async (req, res)=>{
        let query = req.query.q;
        if(query) query = JSON.parse(query);
        const data = await db.getAll(query);
        console.log(data);
        res.send(data);

        // 데이터처리?
        // 필요한 건 가수, 언어, 제목, 평점
    });

    server.get("/get/:id", async (req, res)=>{
        const id = req.params.id;
        // console.log("id", id);
        const data = await db.get(id);
        res.send(data);
    });

    server.post("/post", async(req, res)=>{
        console.log(req.body);
        const result = await db.post(req.body);
        console.log(result);
        res.send(result);
    });

    server.put("/put", async(req, res)=>{
        // console.log(req.body);
        const {id, replaceData} = req.body;
        const result = await db.put(id, replaceData);
        // console.log(result);
        res.send(result);
    });

    server.delete("/delete", async(req, res)=>{
        // console.log(req.body);
        const {id} = req.body;
        const result = await db.delete(id);
        res.send(result);
    });


    server.listen(PORT, ()=>{
        console.log("server -ing");
    });
};