import React, { useState, useContext, useEffect } from 'react';
import styles from './CreateChatModal.module.scss';
import { useNavigate } from "react-router-dom";
import {ErrorContext} from "../../../context/ErrorContext.jsx";
import {RecommendedUser} from "./RecommendedUser.jsx";
import {getUsers} from "../../../api/users.js";
import {createChat} from "../../../api/chats.js";
import {useSelector} from "react-redux";

// eslint-disable-next-line react/prop-types
export const CreatePersonalChatModal = ({ isOpen, onClose }) => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [recommendedUsers, setRecommendedUsers] = useState([]);
    const {setError} = useContext(ErrorContext)
    const user = useSelector((state) => state.user.user);



    const onNameInput = (e) => {
        if (e.target.value !== searchQuery) {
            setSearchQuery(e.target.value);
            getUsers(1, 5, e.target.value)
                .then(
                    res => setRecommendedUsers(res.results)
                )
        }

    }

    useEffect(() => {
        if (isOpen) {
            getUsers(1, 5).then(res => setRecommendedUsers(res.results));
        }
    }, [isOpen]);

    const createPersonalChat = (member) => {

        const params = {
            members: [member.id],
            is_private: true,
            creator: user
        }
        createChat(params).then(res => {
            navigate(`/chat/${res.id}`);
            }
        ).catch((err) => {
            setError(err.message);
        })
    }



    if (!isOpen) return null;

    return (
        <div className={`${styles.modal}`} onClick={onClose}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <span className={styles.closeButton} onClick={onClose}>&times;</span>
                <h2>Создать новый чат</h2>



                <input
                    type="text"
                    className={styles.newPersonName}
                    value={searchQuery}
                    onChange={onNameInput}
                    placeholder="Имя пользователя"
                />
                <RecommendedUser users={recommendedUsers} createChat={createPersonalChat}/>

            </div>
        </div>
    );
};
