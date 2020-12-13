import { data_trend, data_auth, data_report, data_average, data_summary,data_checkReported} from "../apis/api.js";
import * as utils from "../../utils/util.js"

const showLandingPage = async({render}) => {
    render('landing.ejs');
};

const showHomePage = async({render}) => {
    render('homepage.ejs', data_trend);
};

const showRegistrationForm = async({render}) => {
    render('register.ejs', data_auth);
};

const showLoginForm = async({render}) => {
    render('login.ejs', data_auth);
};

const morningOrEvening = async({render}) => {
    render('morningOrEvening.ejs', data_checkReported);
};

const showMorningForm = async({render}) => {
    data_report.today = await utils.getToday();
    render('morningForm.ejs', data_report);
};

const showEveningForm = async({render}) => {
    data_report.today = await utils.getToday();
    render('eveningForm.ejs', data_report);
};

const showAdded = async({render}) => {
    render('added.ejs');
};

const showSummary = async({render}) => {
    render('summary.ejs', data_summary);
};

const showWeeklySummary = async({render}) => {
    render('weeklySummary.ejs',data_average);
};

const showMonthlySummary = async({render}) => {
    render('monthlySummary.ejs',data_average);
};

export { showHomePage, showLandingPage, showRegistrationForm, showLoginForm, morningOrEvening, showMorningForm, showEveningForm, showAdded, showSummary, showWeeklySummary, showMonthlySummary};