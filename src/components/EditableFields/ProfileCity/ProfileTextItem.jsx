import React from 'react';
import styles from './ProfileTextItem.module.scss'

export const ProfileTextItem = ( {title, text, setText, isEdit} ) => {

    const onChange = (value) => {
        setText(value);
    }

    return (
        <div className={`${styles.ProfilePageField}`}>
            <p className="profile-page-key">{title}:</p>
            {!isEdit? <>{text}</> :
            <input
                className={styles.ProfileTextItemInput}
                type="text"
                value={text}
                onChange={(e) => onChange(e.target.value)}
            >
            </input>
            }
        </div>
);
};
