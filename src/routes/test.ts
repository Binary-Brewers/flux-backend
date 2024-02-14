import { Response, Request } from "express";
import express from "express";

const router = express.Router();

// Home page route.
router.get("/", function (_: Request, res: Response) {
  res.status(200).send("Ok");
});

export default { path: "/test", router: router };