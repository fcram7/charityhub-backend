import { Router } from "express";

import { register } from '../controllers/users';
import { checkExistingEmail } from '../middlewares/emailCheck';
import { generateRefreshToken, loginAuth } from '../middlewares/auth';

const router = Router();

router.post("/register", checkExistingEmail, register);
router.post("/login", loginAuth);

router.post("/token", generateRefreshToken);


// router.route("/users")
//   .get(getData)
//   .post(storeData);

// router.get("/users/create", create)

// router.get("/users/:userId", show)

// router.put("/users/:userId", putData);

// router.delete("/users/:userId", deleteData);
// router.get("/users/:userId/edit", editData);
// router.post("/users/:userId", editData);


export default router;