import classes from './UserProfilePage.module.scss';
import {ProfileHeader} from "../../components/Headers/ProfileHeader/ProfileHeader.jsx";
import styles from "../SelfProfilePage/SelfProfilePage.module.scss";
import {ProfileTextItem} from "../../components/EditableFields/ProfileCity/ProfileTextItem.jsx";
import {ProfileAbout} from "../../components/EditableFields/ProfileAbout/ProfileAbout.jsx";
import React, {useContext, useEffect, useState} from "react";
import {Avatar} from "@mui/material";
import {useParams} from "react-router-dom";
import {getUserInfo} from "../../api/users.js";
import {ErrorContext} from "../../context/ErrorContext.jsx";

export const UserProfilePage = () => {
    const {userId} = useParams();
    const [userData, setUserData] = useState({});
    const {setError} = useContext(ErrorContext)

    useEffect(() => {
        getUserInfo(userId)
            .then(
                res => setUserData(res))
            .catch(setError("Не удалось загрузить информацию о пользователе"));

    }, [userId]);


    return (
        <div className={classes.ProfilePage}>
            <ProfileHeader username={userData.username} self={false}/>
            <div className={styles.ProfilePageContainer}>
                <Avatar src={userData.avatar}/>
                <div className={styles.ProfilePageDescription}>

                    <ProfileTextItem title={"Имя пользователя"} text={`${userData.first_name} ${userData.last_name}`}
                                     setText={() => {
                                     }} isEdit={false}/>
                    <ProfileAbout about={userData.bio} setAbout={() => {
                    }} isEdit={false}/>
                </div>
            </div>
        </div>
    )
}