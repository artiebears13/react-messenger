
import { Centrifuge } from 'centrifuge';

export function connectToCentrifugo(userId, onMessageReceived) {
    const accessToken = localStorage.getItem('accessToken');
    const centrifugoUrl = 'wss://vkedu-fullstack-div2.ru/connection/websocket/';
         // 'ws://localhost:8080/connection/websocket/';  // for local development

    const headers = {
        'Authorization': `Bearer ${accessToken}`,
    };

    const centrifuge = new Centrifuge(centrifugoUrl, {
        getToken: (ctx) =>
            // fetch(`http://localhost:8080/api/centrifugo/connect/`, { //for local dev
            fetch(`https://vkedu-fullstack-div2.ru/api/centrifugo/connect/`, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(ctx),
            })
                .then((res) => {
                    if (!res.ok) {
                        throw new Error('Не удалось получить токен подключения');
                    }
                    return res.json();
                })
                .then((data) => data.token),
    });

    const subscription = centrifuge.newSubscription(userId.toString(), {
        getToken: (ctx) =>
            // fetch(`http://localhost:8080/api/centrifugo/subscribe/`, {
            fetch(`https://vkedu-fullstack-div2.ru/api/centrifugo/subscribe/`, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(ctx),
            })
                .then((res) => {
                    if (!res.ok) {
                        throw new Error('Не удалось получить токен подписки');
                    }
                    return res.json();
                })
                .then((data) => data.token),
    });

    subscription.on('publication', function (ctx) {
        if (onMessageReceived) {
            const { event, message } = ctx.data;
            onMessageReceived(event, message);
        }
    });

    centrifuge.on('connect', function () {
    });

    centrifuge.on('disconnect', function () {
    });

    centrifuge.on('error', function (ctx) {
        console.error('Ошибка Centrifugo:', ctx);
    });

    subscription.subscribe();
    centrifuge.connect();

    return centrifuge;

}
