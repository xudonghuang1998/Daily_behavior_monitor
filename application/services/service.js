import { executeQuery } from "../database/database.js";

const existingUsers = async(email) => {
    const res = await executeQuery("SELECT * FROM users WHERE email = $1", email);
    return res;
}

const addUser = async(email, hash) => {
    await executeQuery("INSERT INTO users (email, password) VALUES ($1, $2);", email, hash);
}

const addMorningReport = async(user_id, date, morning, time_sleep, quality_sleep, mood_morning) => {
    const res = await executeQuery("SELECT * FROM reports WHERE user_id = $1 AND date = $2", user_id, date);
    if (res.rowCount === 0) {
        await executeQuery("INSERT INTO reports (user_id, date, morning, time_sleep, quality_sleep, mood_morning) VALUES ($1, $2, $3, $4, $5, $6);", user_id, date, morning, time_sleep, quality_sleep, mood_morning);
    } else {
        await executeQuery("UPDATE reports SET morning = $3, time_sleep = $4, quality_sleep = $5, mood_morning=$6 WHERE user_id = $1 AND date = $2;", user_id, date, morning, time_sleep, quality_sleep, mood_morning);
    }
}

const addEveningReport = async(user_id, date, evening, time_sports ,time_study, mood_evening, RQ_eating) => {
    const res = await executeQuery("SELECT * FROM reports WHERE user_id = $1 AND date = $2", user_id, date);
    if (res.rowCount === 0) {
        await executeQuery("INSERT INTO reports (user_id, date, evening, time_sports, time_study, mood_evening, RQ_eating) VALUES ($1, $2, $3, $4, $5, $6, $7);", user_id, date, evening, time_sports, time_study, mood_evening, RQ_eating);
    } else {
        await executeQuery("UPDATE reports SET evening = $3, time_sports = $4, time_study = $5, mood_evening = $6, RQ_eating = $7 WHERE user_id = $1 AND date = $2;", user_id, date, evening, time_sports, time_study, mood_evening, RQ_eating);
    }
}

const queryPeriod = async(user_id, date_start, date_end) => {
    const average = {
        exist:'',
        time_sleep:'',
        time_sports:'',
        time_study:'',
        mood_morning:'',
        mood_evening:'',
        quality_sleep:'',
        rq_eating:''
    }
    const res = await executeQuery("SELECT * FROM reports WHERE user_id = $1 AND date >= $2 AND date < $3;", user_id, date_start, date_end);
    if (res.rowCount === 0) {
        average.exist = false;
        return average;
    } else {
        average.exist = true;
        average.time_sleep = await executeQuery("SELECT AVG(time_sleep) FROM reports WHERE user_id = $1 AND date >= $2 AND date < $3;", user_id, date_start, date_end);
        average.time_sports = await executeQuery("SELECT AVG(time_sports) FROM reports WHERE user_id = $1 AND date >= $2 AND date < $3;", user_id, date_start, date_end);
        average.time_study = await executeQuery("SELECT AVG(time_study) FROM reports WHERE user_id = $1 AND date >= $2 AND date < $3;", user_id, date_start, date_end);
        average.mood_morning = await executeQuery("SELECT AVG(mood_morning) FROM reports WHERE user_id = $1 AND date >= $2 AND date < $3;", user_id, date_start, date_end);
        average.mood_evening = await executeQuery("SELECT AVG(mood_evening) FROM reports WHERE user_id = $1 AND date >= $2 AND date < $3;", user_id, date_start, date_end);
        average.quality_sleep = await executeQuery("SELECT AVG(quality_sleep) FROM reports WHERE user_id = $1 AND date >= $2 AND date < $3;", user_id, date_start, date_end);
        average.rq_eating = await executeQuery("SELECT AVG(rq_eating) FROM reports WHERE user_id = $1 AND date >= $2 AND date < $3;", user_id, date_start, date_end);
        return average;
    }
}

const queryDay = async(user_id, date) => {
    const res = await executeQuery("SELECT * FROM reports WHERE user_id = $1 AND date = $2", user_id, date);
    return res.rowsOfObjects()[0];
}

export { existingUsers, addUser, addMorningReport, addEveningReport, queryPeriod, queryDay };
