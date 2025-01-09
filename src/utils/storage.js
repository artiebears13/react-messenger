import {initialPeople, userData} from '../mocks/__mocks__.js';
import { v4 as uuidv4 } from 'uuid';

export async function loadPersons() {
    const storedPeople = JSON.parse(localStorage.getItem('people'));
    if (storedPeople && Array.isArray(storedPeople)) {
        return storedPeople;
    } else {
        localStorage.setItem('people', JSON.stringify(initialPeople));
        return initialPeople;
    }
}

/**
 * mark message as read
 * @param personId - person id
 * @param messageId - message id
 */
export function readMessage(personId, messageId) {
    const messagesKey = `messages_${personId}`;
    const messages = JSON.parse(localStorage.getItem(messagesKey)) || [];
    const message = messages.find(msg => msg.id === messageId);
    if (message && message.readStatus === 'unread') {
        message.readStatus = 'read';
        localStorage.setItem(messagesKey, JSON.stringify(messages));
    }
}

/**
 * return last message of chat with person if exists
 * @param personId - person id
 * @returns {*|null} - last message or null
 */
export function getLastMessage(personId) {
    const messagesKey = `messages_${personId}`;
    const messages = JSON.parse(localStorage.getItem(messagesKey)) || [];
    if (messages.length > 0) {
        return messages[messages.length - 1];
    }
    return null;
}

/**
 * mark received messages as red
 * @param personId - person id
 */
export function markReceivedMessagesAsRead(personId) {
    const messagesKey = `messages_${personId}`;
    const messages = JSON.parse(localStorage.getItem(messagesKey)) || [];
    let updated = false;
    messages.forEach(message => {
        if (message.direction === 'received' && message.readStatus === 'unread') {
            message.readStatus = 'read';
            updated = true;
        }
    });
    if (updated) {
        localStorage.setItem(messagesKey, JSON.stringify(messages));
    }
}

/**
 * create message to put in storage, creates id and timestamp
 * @param text - text content of message
 * @param image - attachment image
 * @param direction - received or send
 * @returns {{readStatus: string, id: string, text, image,timestamp: number, direction}}
 */
export function createMessageObject(text, direction, image=null) {
    const timeStamp = new Date();

    return {
        id: uuidv4(),
        text,
        image,
        timestamp: timeStamp.getTime(),
        direction,
        readStatus: 'unread',
    };
}

/**
 * save message to localStorage
 * @param personId - person id
 * @param message - message object
 */
export async function saveMessage(personId, message) {
    const messagesKey = `messages_${personId}`;
    const messages = JSON.parse(localStorage.getItem(messagesKey)) || [];
    messages.push(message);
    localStorage.setItem(messagesKey, JSON.stringify(messages));
}

/**
 * get all messages from chat with user
 * @param personId - person id
 * @returns {any|*[]} - list of messages objects
 */
export async function getAllMessages(personId) {
    const messagesKey = `messages_${personId}`;
    const messages = JSON.parse(localStorage.getItem(messagesKey)) || [];
    return messages;
}

/**
 * get user data: name, photo, id
 * @returns {{name: string, photo: string, id: string}}
 */
export function readUserData() {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser && Object.keys(storedUser).length > 0) {
        return storedUser;
    }
    const defaultUser = userData();
    localStorage.setItem('user', JSON.stringify(defaultUser));

    return defaultUser;
}

export function readFileAsDataURL(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
};

