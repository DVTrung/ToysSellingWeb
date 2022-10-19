import { ObjectId, ObjectID } from "bson";

let Storage;
export default class ToysDAO {
    static async injectDB(conn) {
        if (Storage) {
            return;
        }
        try {
            Storage = await
                conn.db(process.env.TOYSELLING_NS).collection('Storage');
        }
        catch (e) {
            console.error(`unable to connect in ToysDAO: ${e}`);
        }
    }



    static async getToys({
        filters = null,
        page = 0,
        ToysPerPage = 10,
    } = {}) {
        let query;
        if (filters) {
            if ("item" in filters) {
                query = { $text: { $search: filters['item'] } };
            } else if ("status" in filters) {
                query = {"status": {$eq: filters['status'] } }
            }
        }




        let cursor;
        try {
            cursor = await Storage.find(query).limit(ToysPerPage).skip(ToysPerPage * page);
            const toysList = await cursor.toArray();
            const totalNumToys = await Storage.countDocuments(query);
            return { toysList, totalNumToys };
        }
        catch (e) {
            console.error(`Unable to issue find command, ${e}`);
            return { toysList: [], totalNumToys: 0 };
        }
    }



    static async getStatus() {
        let status = []
        try {
            status = await Storage.distinct("status");
            return status;
        }
        catch (e) {
            console.error(`unable to get status, $(e)`);
            return status;
        }
    }


    static async getToyById(id) {
        try {
            return await Storage.aggregate([
                {
                    $match: { _id: new ObjectId(id),}
                },
                {
                    $lookup: {
                        from: 'reviews', localField: '_id',
                                foreignField: 'toy_id', as: 'reviews',

                    }
                }
            ]).next();
        }
        catch (e) {
            console.error(`something went wrong in getToyById: ${e}`);
            throw e;
        }
    }


    static async addToy(item, qty, color, status, picture) {
        try {
            const toyDoc = {
                item: item,
                qty: qty,
                color: color,
                status: status,
                picture: picture
            }
            return await Storage.insertOne(toyDoc);
        }
        catch (e) {
            console.error(`unable to add new product: ${e}`);
            return { error: e };
        }
    }

    static async updateToy(toyId, item, qty, color, status, picture) {
        try {
            const updateResponse = await Storage.updateOne(
                {_id: ObjectId(toyId) },
                { $set: { item: item, qty: qty, color: color, status: status, picture: picture} }
            );
            return updateResponse;
        }
        catch (e) {
            console.error(`unable to update product: ${e}`);
            return { error: e };
        }
    }

    static async deleteToy(toyId) {
        try {
            const deleteResponse = await Storage.deleteOne({
                _id: ObjectId(toyId),
            });
            return deleteResponse;
        }
        catch (e) {
            console.error(`unable to delete product: ${e}`);
            return { error: e };
        }
    }

}


