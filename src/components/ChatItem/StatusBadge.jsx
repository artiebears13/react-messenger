import React from 'react';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import CheckIcon from '@mui/icons-material/Check';
import styles from './ChatItem.module.scss'

export const StatusBadge = ({chat, received}) => {
    const message = chat.last_message;

    if (!message) return null;
    if (received && message.was_read_by.length === 0) {
        return <div className={styles.unreadCount}>{chat.unread_messages_count}</div>;
    } else if (!received) {
        return (
            <>
            {message.was_read_by.length === 0 ? <CheckIcon /> : <DoneAllIcon />}
            </>
        );
    }

    return null;
};
