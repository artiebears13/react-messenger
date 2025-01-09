import React, { useEffect, useRef, useState, useMemo } from 'react';
import styles from './SearchBar.module.scss';
import SearchIcon from '@mui/icons-material/Search';
import {debounce} from "../../utils/debounce.js";

// eslint-disable-next-line react/prop-types
export const SearchBar = ({ onSearch, isSearchOpen, setSearchOpen }) => {
    const [isAnimating, setIsAnimating] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const inputRef = useRef(null);

    const debouncedOnSearch = useMemo(() => debounce(onSearch, 300), [onSearch]);

    useEffect(() => {
        const escapeHandler = (e) => {
            if (e.key === 'Escape') {
                hideSearchBar();
            }
        };

        if (isSearchOpen && inputRef.current) {
            inputRef.current.addEventListener('keydown', escapeHandler);
        }

        return () => {
            if (inputRef.current) {
                inputRef.current.removeEventListener('keydown', escapeHandler);
            }
        };
    }, [isSearchOpen]);

    const handleSearchIconClick = () => {
        setSearchOpen(true);
    };

    const handleSearchInputChange = (e) => {
        const query = e.target.value;
        setSearchQuery(query);

        debouncedOnSearch(query);
    };

    const handleSearchInputBlur = () => {
        hideSearchBar();
    };

    const hideSearchBar = () => {
        setIsAnimating(true);
        setTimeout(() => {
            setSearchOpen(false);
            setIsAnimating(false);
            setSearchQuery('');
            onSearch('');
        }, 300);
    };

    return (
        <>
            {!isSearchOpen && !isAnimating && (
                <button
                    className={`${styles.searchButton} ${styles.white}`}
                    onClick={handleSearchIconClick}
                >
                    <SearchIcon />
                </button>
            )}

            {isSearchOpen && (
                <input
                    ref={inputRef}
                    type="text"
                    placeholder="Поиск..."
                    className={`${styles.searchInput} ${isSearchOpen ? styles.scaleInHorRight : ''
                    } ${isAnimating ? styles.scaleOutHorRight : ''}`}
                    value={searchQuery}
                    onChange={handleSearchInputChange}
                    onBlur={handleSearchInputBlur}
                    autoFocus
                />
            )}
        </>
    );
};
