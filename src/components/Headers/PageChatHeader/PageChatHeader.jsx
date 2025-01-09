import React from 'react';
import styles from './PageChatHeader.module.scss';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import {useNavigate} from "react-router-dom";
import {useSelector} from "react-redux";
import {OnlineBadge} from "../../Badges/OnlineBadge/OnlineBadge.jsx";

export const PageChatHeader = ({ chat, openEditChatModal }) => {
    const navigate = useNavigate();
    const user = useSelector((state) => state.user.user);

    const getOnlineBadge = () => {
        if (!chat || !chat.is_private) return null;
        const opponent = chat.members.find(member => member.id !== user.id);
        return (<OnlineBadge user={opponent} />);
    }

    return (
        <div className={styles.header}>
            <button className={styles.backButton} onClick={() => navigate(`/`)}>
                <ArrowBackIosIcon className={styles.white}>arrow_back_ios</ArrowBackIosIcon>
            </button>
            <div className={styles.receiver}>
                <span className={styles.receiverName} onClick={openEditChatModal}>
                    {chat? chat.title : "Не найдено"}
                    {getOnlineBadge()}
                </span>
                <div className={styles.receiverPhoto} onClick={openEditChatModal}>
                    {chat && <img src={chat.avatar} alt={chat.title} className={styles.receiverPhotoImage} />}
                </div>
            </div>
        </div>
    );
};
