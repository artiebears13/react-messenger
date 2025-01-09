import React from 'react';
import styles from './ProfileAbout.module.scss'

export const ProfileAbout = ({ about, setAbout, isEdit }) => {

    return (
            <div className={`${styles.ProfilePageDescription} ${styles.ProfilePageField}`}>
                <p className={styles.ProfilePageKey}> О себе: </p>
                {!isEdit ? <p className={styles.profileAboutText}>{about}</p> :
                    <textarea
                        className={styles.profileAboutInput}
                        rows="10"
                        value={about}
                        placeholder={about}
                        onChange={(e) => setAbout(e.target.value)}
                    >
                    </textarea>
                }
            </div>
    );
};
