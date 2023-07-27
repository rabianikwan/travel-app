export const historyStatusStyling = (historyStatus) => {
    if (historyStatus?.toLowerCase() === 'issued') {
        return 'bg-alert-1 text-white';
    }
    if (historyStatus?.toLowerCase() === 'unpaid') {
        return 'bg-alert-3 text-white';
    }
};
