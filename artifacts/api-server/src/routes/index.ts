import { Router, type IRouter } from "express";
import healthRouter from "./health";
import ownersRouter from "./owners";
import sponsorsRouter from "./sponsors";
import sponsorLeadsRouter from "./sponsorLeads";
import adminRouter from "./admin";
import cardsRouter from "./cards";
import authRouter from "./auth";
import meRouter from "./me";

const router: IRouter = Router();

router.use(healthRouter);
router.use(ownersRouter);
router.use(sponsorsRouter);
router.use(sponsorLeadsRouter);
router.use(adminRouter);
router.use(cardsRouter);
router.use(authRouter);
router.use(meRouter);

export default router;
