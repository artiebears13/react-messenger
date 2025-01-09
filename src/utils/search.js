import {chatList} from "../components/chatList/chatList";

let searchTimeout = null;

export function handleSearch(query) {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
        chatList(query);
    }, 300);
}