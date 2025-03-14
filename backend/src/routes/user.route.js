import { Router} from "express";

const router = Router();

router.get("/", (req, res) => {
    res.send("user route with git method");
});

export default router;