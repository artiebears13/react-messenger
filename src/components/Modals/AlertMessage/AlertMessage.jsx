import React from "react";
import CloseIcon from '@mui/icons-material/Close';
import styles from './AlertMessage.module.scss'
import {useContext, useEffect} from "react";
import {ErrorContext} from "../../../context/ErrorContext.jsx";

export const AlertMessage = () => {
    const {error, setError} = useContext(ErrorContext)
    useEffect(() => {
        if (error){
            setTimeout(() => setError(false), 4000);
        }
    }, [error, setError])

    return (
        <>
            {error &&
                <div className={`${styles.alertContainer} ${styles.slideInTop}`}>
                <button
                    className={styles.alertCloseButton}
                    onClick={() => setError('')}
                >
                    <CloseIcon className={styles.white} fontSize={"small"}/>
                </button>
                <h1 className={styles.alertHeader}>Упс...</h1>
                <div className={styles.alertText}>
                    {error}
                </div>
            </div>}
        </>

    )
}