import ToysDAO from "../dao/toysDAO.js";


export default class ToysController {
    static async apiGetToys(req, res, next) {
        const toysPerPage = req.query.toysPerPage ? parseInt(req.query.toysPerPage) : 10;
        const page = req.query.page ? parseInt(req.query.page) : 0;
        let filters = {};
        if (req.query.status) {

            filters.status = req.query.status;

        }
        else if (req.query.item) {

            filters.item = req.query.item;

        }
        const { toysList, totalNumToys } = await ToysDAO.getToys({
            filters, page,
            toysPerPage
        });
        let response = {
            toys: toysList,
            page: page,
            filters: filters,
            entries_per_page: toysPerPage,
            total_results: totalNumToys,
        };
        res.json(response);
    }


    static async apiGetToyById(req, res, next) {
        try {
            let id = req.params.id || {};
            let toy = await ToysDAO.getToyById(id);
            if (!toy) {
                res.status(404).json({ error: "not found" })
                return;
            }
            res.json(toy);
        }
        catch (e) {
            console.log(`api, ${e}`);
            res.status(500).json({ error: e });
        }
    }


    static async apiGetStatus(req, res, next) {
        try {
            let propertyTypes = await ToysDAO.getStatus();
            res.json(propertyTypes);
        }
        catch (e) {
            console.log(`api,${e}`);
            res.status(500).json({ error: e });
        }
    }

    static async apiAddToys(req, res, next) {
        try {
            const item = req.body.item;
            const qty = req.body.qty;
            const color = req.body.color;
            const status = req.body.status;
            const picture = req.body.picture;
            const ReviewResponse = await ToysDAO.addToy(
                item,
                qty,
                color,
                status,
                picture
            );
            res.json({ status: "success" });
        } catch (e) {

            res.status(500).json({ error: e.message });

        }
    }



    static async apiUpdateToy(req, res, next) {
        try {
            const toyId = req.body.item_id;
            const item = req.body.item;
            const qty = req.body.qty;
            const color = req.body.color;
            const status = req.body.status;
            const picture = req.body.picture;
            const updateResponse = await ToysDAO.updateToy(
                toyId,
                item,
                qty,
                color,
                status,
                picture
            );
            var { error } = updateResponse;
            if (error) {
                res.status.json({ error });
            }
            if (updateResponse.modifiedCount === 0) {

                throw new Error("unable to update review.");

            }
            res.json({ status: "success " });
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    }

    static async apiDeleteToy(req, res, next) {
        try {
            const reviewId = req.body.item_id;
            const ReviewResponse = await ToysDAO.deleteToy(
                reviewId,
            );
            res.json({ status: "success " });
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    }

}