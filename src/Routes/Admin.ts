import { Router } from "express";
import UserController  from "../Controllers/UserController";
import AdminController from "../Controllers/AdminController";
import { authenticateJWT } from "../Middlewares/AuthenticateJWT";
import { checkUserRole } from "../Middlewares/CheckUserRole";

const router = Router();

// User management
router.get('/users', authenticateJWT, checkUserRole(['admin']), UserController.getAllUsers);
router.get('/users/:id', authenticateJWT, checkUserRole(['admin']), UserController.getUserById);
router.post('/users', authenticateJWT, checkUserRole(['admin']), UserController.createUser);
router.put('/users/:id', authenticateJWT, checkUserRole(['admin']), UserController.updateUser);
router.delete('/users/:id', authenticateJWT, checkUserRole(['admin']), UserController.deleteUser);

// Support Request
router.get('/support_requests', authenticateJWT, checkUserRole(['admin']), AdminController.getAllSupportRequests);
router.get('/support_requests/:id', authenticateJWT, checkUserRole(['admin']), AdminController.getSupportRequestById);
router.put('/support_requests/:id', authenticateJWT, checkUserRole(['admin']), AdminController.updateSupportRequest);
router.delete('/support_requests/:id', authenticateJWT, checkUserRole(['admin']), AdminController.deleteSupportRequest);

// Comment
router.get('/comments/:supportRequestId', authenticateJWT, checkUserRole(['admin']), AdminController.getCommentsBySupportRequestId);
router.put('/comments/:id', authenticateJWT, checkUserRole(['admin']), AdminController.updateComment);
router.delete('/comments/:id', authenticateJWT, checkUserRole(['admin']), AdminController.deleteComment);

export default router;
