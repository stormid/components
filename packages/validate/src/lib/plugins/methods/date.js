export const isValidDate = (value, fields) => {
    const day = fields[0].value;
    const month = fields[1].value;
    const year = fields[2].value;

    if (!day || !month || !year) return false;
    
    const currentDate = new Date();

    const yearValue = Number((year) ? year : currentDate.getFullYear());
    if (yearValue < 1000) return false;

    const monthValue = Number((month) ? month : currentDate.getMonth());
    if (monthValue < 1 || monthValue > 12) {
        return false;
    }
    const dayValue = Number(day);
    
    if (isNaN(dayValue) || isNaN(monthValue) || isNaN(yearValue)) return false;

    if (dayValue > 31 || dayValue < 1) return false;
    if ((monthValue === 4 || monthValue === 6 || monthValue === 9 || monthValue === 11) && dayValue === 31) return false;
    if (monthValue === 2) {
        const isleap = (yearValue % 4 === 0 && (yearValue % 100 !== 0 || yearValue % 400 === 0));
        if (dayValue > 29 || (dayValue === 29 && !isleap)) return false;
    }

    return true;
};