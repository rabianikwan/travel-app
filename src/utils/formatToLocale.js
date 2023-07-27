export const formatToLocale = (date) => {
    if (!date) return false;

    const option = {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
    };

    return new Date(date).toLocaleDateString('us', option);
};
