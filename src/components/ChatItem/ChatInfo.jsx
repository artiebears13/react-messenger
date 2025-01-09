import React from 'react';
import styles from './ChatItem.module.scss'

export const ChatInfo = ({title, message}) => {
    let lastMessageText = 'Нет сообщений';
    if (message) {
        lastMessageText = message.text ? message.text : 'файл';
        if (lastMessageText.startsWith("type:geolocation")) {
            lastMessageText = 'Геопозиция';
        }
        if (message.voice) {
            lastMessageText = "Голосовое сообщение";
        }
    }

    const maxLength = 20;
    const displayText = lastMessageText.length > maxLength
        ? `${lastMessageText.slice(0, maxLength)}...`
        : lastMessageText;

    return (
        <div className={styles.chatItemInfo}>
            <div className={styles.chatItemName}>{title}</div>
            <div className={styles.chatItemLastMessage}>{displayText}</div>
        </div>
    );
};
