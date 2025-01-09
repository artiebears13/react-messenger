import React, { useState } from 'react';
import './ChatListHeader.scss';
import { MenuButton } from '../../Buttons/MenuButton/MenuButton.jsx';
import { SearchBar } from '../../SearchBar/SearchBar.jsx';
import { Title } from '../../Title/Title.jsx';

export const ChatListHeader = ({ handleSearch, onMenuShow }) => {
    const [isSearchOpen, setSearchOpen] = useState(false);

    return (
        <header className="header">
            <MenuButton toggleMenu={onMenuShow} />
            {!isSearchOpen && <Title text="ArtemGram" />}
            <SearchBar
                onSearch={handleSearch}
                isSearchOpen={isSearchOpen}
                setSearchOpen={setSearchOpen}
            />
        </header>
    );
};
