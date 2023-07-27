'use client';

import Calendar from 'react-calendar';
import { FiChevronRight, FiChevronLeft } from 'react-icons/fi';

export default function CalendarPicker({ isDesktop = true, open, handleOpen, initialDate, handlePickedDate, minDate = true }) {
    return (
        <>
            {open && (
                <Calendar
                    className={'calendar'}
                    value={initialDate}
                    onChange={(date) => {
                        handlePickedDate(date);
                        handleOpen();
                    }}
                    defaultValue={initialDate}
                    minDate={minDate && new Date()}
                    prevLabel={<FiChevronLeft style={{ color: '#00AD10' }} />}
                    nextLabel={<FiChevronRight style={{ color: '#00AD10' }} />}
                    showDoubleView={isDesktop}
                    prev2Label={null}
                    next2Label={null}
                    clearIcon={null}
                    calendarIcon={null}
                    showNeighboringMonth={false}
                    showFixedNumberOfWeeks={false}
                />
            )}
        </>
    );
}
