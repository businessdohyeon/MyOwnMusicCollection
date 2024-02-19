module.exports = ()=>{
    const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
    
    const CONNECTION_STRING = "MY_DB_CONNECTION_STRING";
    const DB_NAME = "MY_DB_NAME";
    const COLLECTION_NAME = "MY_COLLECTION_NAME";

    const makeConnection = ()=>{
        const client = new MongoClient(CONNECTION_STRING, {
            serverApi: {
                version: ServerApiVersion.v1,
                strict: true,
                deprecationErrors: true,
            }
        });
        const db = client.db(DB_NAME);
        const collection = db.collection(COLLECTION_NAME);

        return {client, collection};
    }

    return {
        get : async (id)=>{  
            const {client, collection} = makeConnection();
            try {
                const result = await collection.findOne(new ObjectId(id));
                return result;
            } catch (error) {
                console.group();
                console.log("ERR : db.get()");
                // console.log(error);
                console.groupEnd();
            } finally {
                await client.close();
            }
        },
        getAll : async (query)=>{
            const {client, collection} = makeConnection();
            try {
                const result = await collection.find(query);
                const parsedResult = await result.toArray();
                return parsedResult;
            } catch (error) {
                console.group();
                console.log("ERR : db.getAll()");
                console.log(error);
                console.groupEnd();
                return error;
            } finally {
                await client.close();
            }
        },
        post : async (data)=>{
            const {client, collection} = makeConnection();
            try {
                const result = await collection.insertOne(data);
                return result;
            } catch (error) {
                console.group();
                console.log("ERR : db.post()");
                // console.log(error);
                console.groupEnd();
            } finally {
                await client.close();
            }
        },
        put : async (id, replaceData)=>{
            const {client, collection} = makeConnection();
            try {
                const oid = new ObjectId(id);
                const result = await collection.updateOne({_id : oid}, {$set: replaceData});
                return result;
            } catch (error) {
                console.group();
                console.log("ERR : db.put()");
                console.log(error);
                console.groupEnd();
            } finally {
                await client.close();
            }
        },
        delete : async (id)=>{
            const {client, collection} = makeConnection();
            try {
                const oid = new ObjectId(id);
                const result = await collection.deleteOne({_id : oid});
                return result;
            } catch (error) {
                console.group();
                console.log("ERR : db.delete()");
                // console.log(error);
                console.groupEnd();
            } finally {
                await client.close();
            }
        },

    };
};