import React, { useState, useEffect, useCallback } from 'react';
import styles from './SelfProfilePage.module.scss';
import { ProfileHeader } from "../../components/Headers/ProfileHeader/ProfileHeader.jsx";
import { ProfilePhoto } from "../../components/EditableFields/ProfilePhoto/ProfilePhoto.jsx";
import { ProfileAbout } from "../../components/EditableFields/ProfileAbout/ProfileAbout.jsx";
import { ProfileTextItem } from "../../components/EditableFields/ProfileCity/ProfileTextItem.jsx";
import CloseIcon from '@mui/icons-material/Close';
import DoneIcon from '@mui/icons-material/Done';
import { useDispatch, useSelector } from "react-redux";
import { updateUserProfile } from "../../store/userSlice.js";

export const SelfProfilePage = () => {
    const user = useSelector((state) => state.user.user);
    if (!user) return null;
    const dispatch = useDispatch();
    const [isEdit, setIsEdit] = useState(false);
    const [name, setName] = useState(user.first_name);
    const [userInfo, setUserInfo] = useState({
        bio: user.bio,
        avatar: user.avatar,
    });

    const loadData = useCallback(() => {
        setName(user.first_name);
        setUserInfo({
            bio: user.bio,
            avatar: user.avatar,
        });
    }, [user]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const handleUpdateProfile = async () => {
        const updatedData = {};

        if (name && name !== user.first_name) {
            updatedData.first_name = name;
        }

        if (userInfo.bio && userInfo.bio !== user.bio) {
            updatedData.bio = userInfo.bio;
        }

        if (Object.keys(updatedData).length > 0) {
            try {
                await dispatch(updateUserProfile(updatedData)).unwrap();
            } catch (error) {
                console.error('Ошибка при обновлении профиля:', error);
            }
        }
        setIsEdit(false);
    };

    const editAvatar = async (data) => {
        try {
            await dispatch(updateUserProfile(data)).unwrap();
        } catch (error) {
            console.error('Ошибка при обновлении аватара:', error);
        }
    };

    const handleCloseEdit = () => {
        loadData();
        setIsEdit(false);
    };

    const setAbout = (bio) => {
        setUserInfo(prevState => ({
            ...prevState,
            bio: bio
        }));
    };

    return (
        <div className={styles.ProfilePage}>
            <ProfileHeader
                username={user.username}
            />
            <div className={styles.ProfilePageContainer}>
                <ProfilePhoto person={{ ...user, avatar: userInfo.avatar }} setPerson={editAvatar} />
                <div className={styles.ProfilePageDescription}>
                    <ProfileTextItem title={"Имя пользователя"} text={name} setText={setName} isEdit={isEdit} />
                    <ProfileAbout about={userInfo.bio} setAbout={setAbout} isEdit={isEdit} />
                </div>
                {!isEdit ?
                    <button className={styles.ProfilePageEditButton} onClick={() => setIsEdit(true)}>
                        Изменить
                    </button>
                    :
                    <div className={styles.ProfilePageEditButtonsContainer}>
                        <button className={styles.ProfilePageEditButtonIcon} onClick={handleUpdateProfile}><DoneIcon />
                        </button>
                        <button className={styles.ProfilePageEditButtonIcon} onClick={handleCloseEdit}><CloseIcon />
                        </button>
                    </div>
                }
            </div>
        </div>
    );
};
