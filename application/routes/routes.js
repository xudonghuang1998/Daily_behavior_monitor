import { Router } from "../deps.js";
import * as controller from "./controllers/controller.js";
import * as api from "./apis/api.js";

const router = new Router();

router.get('/', controller.showLandingPage);
router.get('/homepage', controller.showHomePage);
router.get('/auth/registration', controller.showRegistrationForm);
router.get('/auth/login', controller.showLoginForm);
router.get('/behavior/reporting', controller.morningOrEvening);
router.get('/behavior/reporting/morning', controller.showMorningForm);
router.get('/behavior/reporting/evening', controller.showEveningForm);
router.get('/behavior/reporting/added', controller.showAdded);
router.get('/behavior/summary', controller.showSummary);
router.get('/behavior/summary/week', controller.showWeeklySummary);
router.get('/behavior/summary/month', controller.showMonthlySummary);

router.get('/auth/logout', api.logout);
router.get('/behavior/trend', api.trend);
router.get('/behavior/reported', api.checkReported);
router.post('/auth/registration', api.register);
router.post('/auth/login', api.authenticate);
router.post('/behavior/reporting/morning', api.morningReport);
router.post('/behavior/reporting/evening', api.eveningReport);
router.post('/behavior/summary/week', api.weeklySummary);
router.post('/behavior/summary/month', api.monthlySummary);

export { router };