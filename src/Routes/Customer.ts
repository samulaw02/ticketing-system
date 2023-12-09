import { Router } from "express";
import CustomerController  from "../Controllers/CustomerController";
import { authenticateJWT } from "../Middlewares/AuthenticateJWT";
import { checkUserRole } from "../Middlewares/CheckUserRole";

const router = Router();

router.get('/support_requests', authenticateJWT, checkUserRole(['customer']), CustomerController.getAllSupportRequests);
router.get('/support_requests/:id', authenticateJWT, checkUserRole(['customer']), CustomerController.getSupportRequestById);
router.post('/support_requests', authenticateJWT, checkUserRole(['customer']), CustomerController.createSupportRequest);
router.post('/comments/:supportRequestId', authenticateJWT, checkUserRole(['customer']), CustomerController.createComment);


export default router;
