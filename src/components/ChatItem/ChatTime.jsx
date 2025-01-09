import React from 'react';
import styles from './ChatItem.module.scss'
import {getFormattedDate, getFormattedTime} from "../../utils/datetime.js";


export const ChatTime = ({ time }) => {

    const formattedDate = getFormattedDate(time);
    const formattedTime = getFormattedTime(time);

    return (
        <div className={styles.chatItemTime}>
            {formattedDate && formattedTime ? `${formattedDate}, ${formattedTime}` : ''}
        </div>
    );
};

