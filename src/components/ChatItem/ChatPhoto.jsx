import React from 'react';
import styles from './ChatItem.module.scss'
import {imgOrPlaceholder} from "../../utils/imgOrPlaceholder/imgOrPlaceholder.js";
import LazyImage from "../LazyImage/LazyImage.jsx";

export const ChatPhoto = ({ person }) => {
    const src = imgOrPlaceholder(person.avatar);
    return (
        <div className={styles.chatItemPhoto}>
            <LazyImage src={src} alt={person.name}/>
        </div>
    );
};
