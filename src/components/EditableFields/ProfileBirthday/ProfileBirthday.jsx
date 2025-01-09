import React, {useState, useEffect} from 'react';
import styles from './ProfileBirthday.module.scss'

export const ProfileBirthday = ({birthday, setBirthday, isEdit}) => {
    const [newBirthday, setNewBirthday] = useState('');

    useEffect(() => {
        if (!isEdit) {
            setNewBirthday('');
            return;
        }
        if (birthday) {
            const date = new Date(birthday);
            const year = date.getFullYear();
            const month = ('0' + (date.getMonth() + 1)).slice(-2);
            const day = ('0' + date.getDate()).slice(-2);
            setNewBirthday(`${year}-${month}-${day}`);

        }
    }, [isEdit, birthday]);

    const onChange = (value) => {
        setNewBirthday(value);
        setBirthday(value);
    };

    const calculateAge = (birthdate) => {
        if (!birthdate) return '';
        const birthDate = new Date(birthdate);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDifference = today.getMonth() - birthDate.getMonth();
        if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };

    const getYearWord = (age) => {
        const lastDigit = age % 10;
        const lastTwoDigits = age % 100;
        if (lastTwoDigits >= 11 && lastTwoDigits <= 14) return 'лет';
        if (lastDigit === 1) return 'год';
        if (lastDigit >= 2 && lastDigit <= 4) return 'года';
        return 'лет';
    };

    const formatBirthday = (birthdate) => {
        if (!birthdate) return '';
        const birthDate = new Date(birthdate);
        const day = birthDate.getDate();
        const monthNames = [
            "января", "февраля", "марта", "апреля", "мая", "июня",
            "июля", "августа", "сентября", "октября", "ноября", "декабря"
        ];
        const month = monthNames[birthDate.getMonth()];
        return `${day} ${month}`;
    };

    const age = calculateAge(birthday);

    return (
        <div className={`profile-birthday-date ${styles.ProfilePageField}`}>
            <p className={styles.ProfilePageKey}>День рождения:</p>
            {!isEdit ? (
                <>
                    {formatBirthday(birthday)} ({age} {getYearWord(age)})
                </>
            ) : (
                <input
                    className={styles.ProfileBirthdayInput}
                    type="date"
                    value={newBirthday}
                    onChange={(e) => onChange(e.target.value)}
                />
            )}
        </div>
    );
};
