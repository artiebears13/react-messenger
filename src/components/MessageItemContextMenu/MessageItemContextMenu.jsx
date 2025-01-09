import React, { useEffect, useRef } from 'react';
import styles from './MessageItemContextMenu.module.scss';

export const MessageItemContextMenu = ({
                                           visible,
                                           position,
                                           onDelete,
                                           onClose,
                                       }) => {
    const menuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                onClose();
            }
        };

        if (visible) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [visible, onClose]);

    if (!visible) return null;

    return (
        <ul
            className={styles.contextMenu}
            ref={menuRef}
            style={{ top: position.top, left: position.left }}
            role="menu"
            aria-labelledby="context-menu"
        >
            {/*TODO: вернуть как будет готово API*/}
            {/*<li*/}
            {/*    className={styles.contextMenuItem}*/}
            {/*    onClick={onEdit}*/}
            {/*    role="menuitem"*/}
            {/*    tabIndex="0"*/}
            {/*    onKeyPress={(e) => { if (e.key === 'Enter') onEdit(); }}*/}
            {/*>*/}
            {/*    Редактировать*/}
            {/*</li>*/}
            <li
                className={styles.contextMenuItem}
                onClick={onDelete}
                role="menuitem"
                tabIndex="0"
                onKeyPress={(e) => { if (e.key === 'Enter') onDelete(); }}
            >
                Удалить
            </li>
        </ul>
    );
};


