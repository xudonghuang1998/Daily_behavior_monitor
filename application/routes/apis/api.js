import * as service from "../../services/service.js";
import * as deps from "../../deps.js";
import * as utils from "../../utils/util.js"

let data_auth = {errors_login: [], errors_register: [], email:''}

let data_average = {time_sleep: '', time_sports: '', time_study: '', mood_morning: '',
    mood_evening: '', quality_sleep: '', rq_eating: ''}

let data_summary = {errors: [], week:'', month:''}

let data_report = {errors: [], today:'', date_morning:'', date_evening:'', time_sleep:'', time_sports:'', time_study:'',
    quality_sleep:'', mood_morning:'', mood_evening:'', RQ_eating:''}

let data_trend = {mood_today:'', mood_yesterday:'', complete: '', trend:''}

let data_checkReported = {morning:'', evening:''}
    
const register = async({request, response}) => {
    data_auth.errors_register = [];
    data_auth.email = '';
    const body = request.body();
    const params = await body.value;

    const email = params.get('email');
    const password = params.get('password');
    const verification = params.get('verification');
    let successful = true;

    const existingUsers = await service.existingUsers(email);
    if (existingUsers.rowCount > 0) {
        data_auth.errors_register.push('The email is already reserved.');
        successful = false;
    }

    if (password !== verification) {
        data_auth.errors_register.push('The entered passwords did not match');
        successful = false;
    }

    if (password.length < 4) {
        data_auth.errors_register.push('Password must contain at least 4 characters');
        successful = false;
    }

    if (successful === true){
        const pw_hash = await deps.hash(password);
        await service.addUser(email,pw_hash);
        data_auth.errors_register.push('Registration successful! Please login!');
    } else {
        data_auth.email = email;
    }
    response.redirect('/auth/registration');
};

const authenticate = async({request, response, session}) => {
    data_auth.errors_login = [];
    data_auth.email = '';

    if(await session.get('authenticated')) {
        data_auth.errors_login.push('Already online! Logout before login a new account!');
        response.redirect('/auth/login');
    } else {
        const body = request.body();
        const params = await body.value;

        const email = params.get('email');
        const password = params.get('password');
        let successful = true;

        const res = await service.existingUsers(email);
        if (res.rowCount === 0) {
            successful = false;
        }

        const userObj = res.rowsOfObjects()[0];
        const pw_hash = userObj.password;
        const passwordCorrect = await deps.compare(password, pw_hash);
        if (!passwordCorrect) {
            successful = false;
        }

        if(successful === true) {
            await session.set('authenticated', true);
            await session.set('user', {
                id: userObj.id,
                email: userObj.email
            });
            response.redirect('/behavior/trend');
        } else {
            data_auth.errors_login.push('Invalid email or password');
            data_auth.email = email;
            response.redirect('/auth/login');
        }
    }
}

const logout = async({response, session}) => {
    data_auth.errors_login = [];
    data_auth.errors_login.push('Logout Successful!');
    await session.set('authenticated', false);
    response.redirect('/auth/login');
}

const trend = async({response, session}) => {
    data_trend = {mood_today:'Not Reported!', mood_yesterday:'Not Reported!', complete: '', trend:'unknown'}
    const user = await session.get('user');
    const user_id =user.id;
    const today = await utils.getToday();
    const yesterday = await utils.getYesterday();
    const report_today = await service.queryDay(user_id, today);
    const report_yesterday = await service.queryDay(user_id, yesterday);
    
    if (report_today) {
        if(report_today.mood_morning && report_today.mood_evening) {
            data_trend.mood_today = (report_today.mood_morning + report_today.mood_evening)/2;
        } else {
            data_trend.mood_today = report_today.mood_morning + report_today.mood_evening;
        }
    }
    
    if (report_yesterday) {
        if(report_yesterday.mood_morning && report_yesterday.mood_evening) {
            data_trend.mood_yesterday = (report_yesterday.mood_morning + report_yesterday.mood_evening)/2;
        } else {
            data_trend.mood_yesterday = report_yesterday.mood_morning + report_yesterday.mood_evening;
        }
    }
    
    if (report_today && report_yesterday) {
        data_trend.complete = 'True';
        if(data_trend.mood_today >= data_trend.mood_yesterday) {
            data_trend.trend = 'bright';
        } else {
            data_trend.trend = 'gloomy';
        }
    } else {
        data_trend.complete = 'False';
    }
    response.redirect('/homepage');
}

const checkReported = async({response, session}) => {
    data_checkReported = {morning:'', evening:''}
    const user = await session.get('user');
    const user_id =user.id;
    const today = await utils.getToday();
    const report_today = await service.queryDay(user_id, today);
    if (report_today) {
        data_checkReported.morning = report_today.morning;
        data_checkReported.evening = report_today.evening;
    }
    response.redirect('/behavior/reporting');
}

const morningReport = async({request, response, session}) => {
    data_report = {errors: [], date_morning:'', date_evening:'', time_sleep:'', time_sports:'', time_study:'',
        quality_sleep:'', mood_morning:'', mood_evening:'', RQ_eating:''};
    const user = await session.get('user');
    const user_id =user.id;

    const body = request.body();
    const params = await body.value;
    const date = params.get('date');
    const time_sleep = params.get('sleepDuration');
    const quality_sleep = params.get('sleepQuality');
    const mood_morning = params.get('genericMood');
    if(user_id && date && time_sleep &&quality_sleep && mood_morning) {
        await service.addMorningReport(user_id,date,'true',time_sleep,quality_sleep,mood_morning);
        response.redirect('/behavior/reporting/added');
    } else {
        data_report.errors.push('Please complete the chart!');
        data_report.date_morning = date;
        data_report.time_sleep = time_sleep;
        data_report.quality_sleep = quality_sleep;
        data_report.mood_morning = mood_morning;
        response.redirect('./morning');
    }
}

const eveningReport = async({request, response, session}) => {
    data_report = {errors: [], date_morning:'', date_evening:'', time_sleep:'', time_sports:'', time_study:'',
        quality_sleep:'', mood_morning:'', mood_evening:'', RQ_eating:''};
    const user = await session.get('user');
    const user_id =user.id;

    const body = request.body();
    const params = await body.value;
    const date = params.get('date');
    const time_sports = params.get('sportsTime');
    const time_study = params.get('studyTime');
    const mood_evening = params.get('genericMood');
    const RQ_eating = params.get('RQ_eating');
    if(user_id && date && time_sports && time_study && mood_evening && RQ_eating) {
        await service.addEveningReport(user_id,date,'true',time_sports,time_study,mood_evening,RQ_eating);
        response.redirect('/behavior/reporting/added');
    } else {
        data_report.errors.push('Please complete the chart!');
        data_report.date_evening = date;
        data_report.time_sports = time_sports;
        data_report.time_study = time_study;
        data_report.mood_evening = mood_evening;
        data_report.RQ_eating = RQ_eating;
        response.redirect('./evening');
    }
}

const weeklySummary  = async({request, response, session}) => {
    data_summary.errors= [];
    data_summary.week = '';
    const user = await session.get('user');
    const user_id =user.id;

    const body = request.body();
    const params = await body.value;
    const year = params.get('week').slice(0,4);
    const week = params.get('week').slice(6,8);
    const date_start = utils.getDateOfISOWeek(week, year);
    const date_end = utils.getDateOfISOWeek(Number(week)+1, year);
    const average = await service.queryPeriod(user_id, date_start, date_end);
    if(average.exist === true){
        data_average = {
            time_sleep: 0,
            time_sports: 0,
            time_study: 0,
            mood_morning: 1,
            mood_evening: 1,
            quality_sleep: 1,
            rq_eating: 1
        }
        if (average.time_sleep.rowsOfObjects()[0].avg) {data_average.time_sleep = average.time_sleep.rowsOfObjects()[0].avg.slice(0,4)};
        if (average.time_sports.rowsOfObjects()[0].avg) {data_average.time_sports = average.time_sports.rowsOfObjects()[0].avg.slice(0,4)};
        if (average.time_study.rowsOfObjects()[0].avg) {data_average.time_study = average.time_study.rowsOfObjects()[0].avg.slice(0,4)};
        if (average.mood_morning.rowsOfObjects()[0].avg) {data_average.mood_morning = average.mood_morning.rowsOfObjects()[0].avg.slice(0,4)};
        if (average. mood_evening.rowsOfObjects()[0].avg) {data_average.mood_evening = average. mood_evening.rowsOfObjects()[0].avg.slice(0,4)};
        if (average.quality_sleep.rowsOfObjects()[0].avg) {data_average.quality_sleep = average.quality_sleep.rowsOfObjects()[0].avg.slice(0,4)};
        if (average.rq_eating.rowsOfObjects()[0].avg) {data_average.rq_eating = average.rq_eating.rowsOfObjects()[0].avg.slice(0,4)};
        response.redirect('/behavior/summary/week');
    } else {
        data_summary.errors.push('No data for the given week exists!');
        data_summary.week = params.get('week');
        response.redirect('/behavior/summary');
    }
}

const monthlySummary  = async({request, response, session}) => {
    data_summary.errors= [];
    data_summary.month = '';
    const user = await session.get('user');
    const user_id =user.id;

    const body = request.body();
    const params = await body.value;
    const year = params.get('month').slice(0,4);
    const month = params.get('month').slice(5,7);
    const date_start = year+'-'+month+'-'+1;
    let date_end ='';
    if(Number(month) === 12) {
        const year_next = Number(year)+1;
        date_end = year_next+'-'+1+'-'+1;
    } else {
        const month_next = Number(month)+1;
        date_end = year+'-'+month_next+'-'+1;
    }
    const average = await service.queryPeriod(user_id, date_start, date_end);
    if(average.exist === true){
        data_average = {
            time_sleep: 0,
            time_sports: 0,
            time_study: 0,
            mood_morning: 1,
            mood_evening: 1,
            quality_sleep: 1,
            rq_eating: 1
        }
        if (average.time_sleep.rowsOfObjects()[0].avg) {data_average.time_sleep = average.time_sleep.rowsOfObjects()[0].avg.slice(0,4)};
        if (average.time_sports.rowsOfObjects()[0].avg) {data_average.time_sports = average.time_sports.rowsOfObjects()[0].avg.slice(0,4)};
        if (average.time_study.rowsOfObjects()[0].avg) {data_average.time_study = average.time_study.rowsOfObjects()[0].avg.slice(0,4)};
        if (average.mood_morning.rowsOfObjects()[0].avg) {data_average.mood_morning = average.mood_morning.rowsOfObjects()[0].avg.slice(0,4)};
        if (average. mood_evening.rowsOfObjects()[0].avg) {data_average.mood_evening = average. mood_evening.rowsOfObjects()[0].avg.slice(0,4)};
        if (average.quality_sleep.rowsOfObjects()[0].avg) {data_average.quality_sleep = average.quality_sleep.rowsOfObjects()[0].avg.slice(0,4)};
        if (average.rq_eating.rowsOfObjects()[0].avg) {data_average.rq_eating = average.rq_eating.rowsOfObjects()[0].avg.slice(0,4)};
        response.redirect('/behavior/summary/month');
    } else {
        data_summary.errors.push('No data for the given month exists!');
        data_summary.month = params.get('month');
        response.redirect('/behavior/summary');
    }
}

export { register, authenticate, trend, data_trend, logout, data_auth, checkReported, data_checkReported, morningReport, eveningReport, data_report, weeklySummary, monthlySummary, data_average, data_summary};