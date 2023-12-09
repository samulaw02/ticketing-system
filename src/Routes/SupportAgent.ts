import { Router } from "express";
import SupportAgentController  from "../Controllers/SupportAgentController";
import { authenticateJWT } from "../Middlewares/AuthenticateJWT";
import { checkUserRole } from "../Middlewares/CheckUserRole";

const router = Router();

router.get('/support_requests', authenticateJWT, checkUserRole(['support_agent']), SupportAgentController.getAllSupportRequests);
router.get('/support_requests/:id', authenticateJWT, checkUserRole(['support_agent']), SupportAgentController.getSupportRequestById);
router.put('/support_requests/:id', authenticateJWT, checkUserRole(['support_agent']), SupportAgentController.updateSupportRequestStatus);
router.post('/comments/:supportRequestId', authenticateJWT, checkUserRole(['support_agent']), SupportAgentController.createComment);

export default router;
