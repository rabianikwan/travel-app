// dayjs
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
dayjs.extend(utc);
dayjs.extend(timezone);
// dayjs

export const convertToDate = (date) => {
    let year = dayjs(date).get('year');
    let month = dayjs(date).get('month');
    let day = dayjs(date).get('date');
    return `${year}-${month < 10 ? `0${month + 1}` : month + 1}-${day}`;
};

export const convertToTime = (date) => {
    let hour = dayjs(date).get('hour');
    let minute = dayjs(date).get('minute');
    return `${hour < 10 ? `0${hour}` : hour}:${minute < 10 ? `0${minute}` : minute}`;
};
