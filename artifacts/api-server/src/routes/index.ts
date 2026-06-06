import { Router, type IRouter } from "express";
import healthRouter from "./health";
import ownersRouter from "./owners";
import sponsorsRouter from "./sponsors";
import sponsorLeadsRouter from "./sponsorLeads";
import adminRouter from "./admin";

const router: IRouter = Router();

router.use(healthRouter);
router.use(ownersRouter);
router.use(sponsorsRouter);
router.use(sponsorLeadsRouter);
router.use(adminRouter);

export default router;
