import { Application } from "express";
import AuthRoutes from "./Auth";
import AdminRoutes from "./Admin";
import CustomerRoutes from "./Customer";
import SupportAgentRoutes from "./SupportAgent";

const API_BASE_PATH = "/api/v1";

export default class Routes {
    constructor(app: Application) {
        app.use(`${API_BASE_PATH}`, AuthRoutes);
        app.use(`${API_BASE_PATH}/admin`, AdminRoutes);
        app.use(`${API_BASE_PATH}/customer`, CustomerRoutes);
        app.use(`${API_BASE_PATH}/support_agent`, SupportAgentRoutes);
    }
}
