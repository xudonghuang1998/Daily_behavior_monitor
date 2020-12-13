const getToday = async() => {
    const date = new Date();
    const Y = date.getFullYear() + '-';
    const M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
    const D = date.getDate();
    return Y+M+D;
}

const getYesterday = async() => {
    const time=(new Date).getTime()-24*60*60*1000;
    const date=new Date(time);
    const Y = date.getFullYear() + '-';
    const M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
    const D = date.getDate();
    return Y+M+D;
}

function getDateOfISOWeek(w, y) {
    const simple = new Date(y, 0, 1 + (w - 1) * 7);
    const dow = simple.getDay();
    const ISOweekStart = simple;
    if (dow <= 4)
        ISOweekStart.setDate(simple.getDate() - simple.getDay() + 1);
    else
        ISOweekStart.setDate(simple.getDate() + 9 - simple.getDay());
    const Y = ISOweekStart.getFullYear() + '-';
    const M = (ISOweekStart.getMonth()+1 < 10 ? '0'+(ISOweekStart.getMonth()+1) : ISOweekStart.getMonth()+1) + '-';
    const D = ISOweekStart.getDate();

    return  Y+M+D;
}

export { getToday,getYesterday,getDateOfISOWeek };