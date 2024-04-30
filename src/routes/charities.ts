import { Router } from 'express';
import { validateToken } from '../middlewares/auth';

const router = Router();

//NO AUTHORIZATION CHARITIES DATA FETCH
router.get("/");

//WITH AUTHORIZATION CHARITIES DATA FETCH
router.post("/create-charity", validateToken);
router.put("/:charityId/edit-charity/");
router.delete("/:charityId/delete-charity/");

export default router;
