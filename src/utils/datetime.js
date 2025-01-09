const DATES = {
    today: 'Сегодня',
    yesterday: 'Вчера'
}


export const getFormattedDate = (timestamp) => {
    if (!timestamp) return '';

    const now = new Date();
    const messageDate = new Date(timestamp);

    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfYesterday = new Date(startOfToday);
    startOfYesterday.setDate(startOfToday.getDate() - 1);

    if (messageDate >= startOfToday) {
        return DATES.today;
    } else if (messageDate >= startOfYesterday) {
        return DATES.yesterday;
    } else {
        return messageDate.toLocaleDateString('ru-RU', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });
    }
};

export const getFormattedTime = (timestamp) => {
    if (!timestamp) return '';
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};