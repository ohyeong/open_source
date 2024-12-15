self.addEventListener('notificationclick', event => {
    event.notification.close(); // 알림 닫기
    const url = event.notification.data?.url;
    if (url) {
        event.waitUntil(
            clients.openWindow(url) // 지정된 URL로 이동
        );
    }
});
