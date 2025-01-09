import React from 'react';
import { StatusBadge } from './StatusBadge.jsx';
import styles from './ChatItem.module.scss'


export const ChatStatus = ({ chat, received }) => {
    return (
        <div className={styles.chatItemStatus}>
            <StatusBadge chat={chat} received={received} />
        </div>
    );
};
