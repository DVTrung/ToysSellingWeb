import { ObjectId, ObjectID } from "bson";

let toys;
export default class ToysDAO {
    static async injectDB(conn) {
        if (toys) {
            return;
        }
        try {
            toys = await
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
            cursor = await toys.find(query).limit(ToysPerPage).skip(ToysPerPage * page);
            const toysList = await cursor.toArray();
            const totalNumToys = await toys.countDocuments(query);
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
            status = await toys.distinct("status");
            return status;
        }
        catch (e) {
            console.error(`unable to get status, $(e)`);
            return status;
        }
    }


    static async getToyById(id) {
        try {
            return await toys.aggregate([
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
}


