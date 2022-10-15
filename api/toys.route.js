import express from 'express';
import ToysController from './toys.controller.js';
import ReviewsController from './reviews.controller.js';

const router = express.Router();
router.route('/').get(ToysController.apiGetToys);
router.route("/id/:id").get(ToysController.apiGetToyById);
router.route("/status").get(ToysController.apiGetStatus);

router
.route('/review')
.post(ReviewsController.apiPostReview)
.put(ReviewsController.apiUpdateReview)
.delete(ReviewsController.apiDeleteReview);

export default router;