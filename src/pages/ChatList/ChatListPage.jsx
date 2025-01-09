import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ChatListHeader } from '../../components/Headers/ChatListHeader/ChatListHeader.jsx';
import { CreateChatButton } from '../../components/Buttons/CreateChatButton/CreateChatButton.jsx';
import { CreatePersonalChatModal } from '../../components/Modals/CreateChatModal/CreatePersonalChatModal.jsx';
import { Menu } from '../../components/Menu/Menu.jsx';
import { CreateGroupChatModal } from '../../components/Modals/CreateChatModal/CreateGroupChatModal.jsx';
import { ChatList } from '../../components/chatList/ChatList.jsx';
import { fetchChats, searchChats } from '../../store/chatSlice'; // Импортируем fetchChats

export const ChatListPage = () => {
    const dispatch = useDispatch();
    const chats = useSelector((state) => state.chats.chats); // Получаем чаты из Redux store

    const [searchQuery, setSearchQuery] = useState('');
    const [menuOpen, setMenuOpen] = useState(false);
    const [chatModal, setChatModal] = useState('none');

    useEffect(() => {
        dispatch(fetchChats());
    }, [dispatch]);

    const onPersonalChat = () => {
        setChatModal('personal');
    };

    const onGroupChat = () => {
        setChatModal('group');
    };

    const onMenuShow = () => {
        setMenuOpen(true);
    };

    const onMenuHide = () => {
        setMenuOpen(false);
    };

    const handleSearch = (query) => {
        dispatch(searchChats(query));
        setSearchQuery(query);
    };

    const ChooseChatModal = () => {
        switch (chatModal) {
            case 'personal':
                return (
                    <CreatePersonalChatModal
                        isOpen={chatModal === 'personal'}
                        onClose={() => setChatModal('none')}
                    />
                );
            case 'group':
                return (
                    <CreateGroupChatModal
                        isOpen={chatModal === 'group'}
                        onClose={() => setChatModal('none')}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <main>
            <ChatListHeader handleSearch={handleSearch} onMenuShow={onMenuShow} />
            <ChatList searchQuery={searchQuery} />
            <CreateChatButton
                onGroupChat={onGroupChat}
                onPersonalChat={onPersonalChat}
                animate={chats.length === 0 && searchQuery === ''}
            />
            {ChooseChatModal()}
            {menuOpen && <Menu onMenuHide={onMenuHide} />}
        </main>
    );
};
