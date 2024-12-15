document.addEventListener('DOMContentLoaded', () => {
    const subscribeToggle = document.getElementById('subscribeToggle');
    const subscriptionStatus = document.getElementById('subscriptionStatus');
    const now = new Date();
    
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    // 로컬 스토리지에서 하트 상태 불러오기
    const heartState = Object.keys(localStorage).reduce((acc, key) => {
        if (key.startsWith('heartLiked_')) {
            acc[key.replace('heartLiked_', '')] = localStorage.getItem(key) === 'true';
        }
        return acc;
    }, {});

    // 알림 설정 변경 시
    subscribeToggle.addEventListener('change', async () => {
        if (subscribeToggle.checked) {
            // 알림 권한이 "차단" 상태라면
            if (Notification.permission === 'denied') {
                alert('알림 권한이 차단되어 있습니다. 알림을 받으려면 브라우저 설정에서 알림 권한을 허용해주세요.');
                subscribeToggle.checked = false; // 다시 체크 해제
                return;
            }
            // 알림 권한 요청
            if (Notification.permission === 'default') {
                const permission = await Notification.requestPermission();
                if (permission !== 'granted') {
                    alert('알림 권한이 필요합니다.');
                    subscribeToggle.checked = false;
                    return;
                }
            }

            if (Notification.permission === 'granted') {
                subscriptionStatus.textContent = '알림 구독중';
                localStorage.setItem('notificationsEnabled', 'true');

                // 공연 데이터 가져오기
                fetch('../../data/concert_infos_date.json')
                    .then(response => response.json())
                    .then(data => {
                        const upcomingConcerts = data.filter(concert => {
                            const concertDate = new Date(concert.date);
                            // 공연 날짜가 오늘 또는 내일이면 푸쉬 알림
                            const heartKey = `${concert.idx}`;
                            return concertDate >= today && concertDate < new Date(tomorrow.getTime() + 24 * 60 * 60 * 1000) && heartState[heartKey];
                        });

                        // 푸쉬 알림 보내기
                        navigator.serviceWorker.ready.then(registration => {
                            upcomingConcerts.forEach(concert => {
                                registration.showNotification('다가오는 공연 알림', {
                                    body: `${concert.title} 공연이 오늘 또는 내일입니다!`,
                                    icon: concert.image,
                                    vibrate: [200, 100, 200],
                                    tag: `concert_${concert.idx}`, // 중복 방지 태그
                                    data: {
                                        url: `../classicConcertPages/${concert.link}` // 클릭 시 열릴 URL
                                    }
                                });
                            });
                        });
                    })
                    .catch(error => console.error('Error loading concert data:', error));
            }
        } else {
            // 알림 구독 취소 처리
            subscriptionStatus.textContent = '알림 구독';
            localStorage.setItem('notificationsEnabled', 'false');
        }
    });

    // 초기 상태 설정 (로컬 스토리지 기반)
    const isSubscribed = localStorage.getItem('notificationsEnabled') === 'true';
    subscribeToggle.checked = isSubscribed;
    subscriptionStatus.textContent = isSubscribed ? '알림 구독중' : '알림 구독';

    // 이미 구독 중이라면 공연 알림 체크
    if (isSubscribed && Notification.permission === 'granted') {
        fetch('../../data/concert_infos_date.json')
            .then(response => response.json())
            .then(data => {
                const upcomingConcerts = data.filter(concert => {
                    const concertDate = new Date(concert.date);
                    // 공연 날짜가 오늘 또는 내일이면 푸쉬 알림
                    const heartKey = `${concert.idx}`;
                    return concertDate >= today && concertDate < new Date(tomorrow.getTime() + 24 * 60 * 60 * 1000) && heartState[heartKey];
                });

                navigator.serviceWorker.ready.then(registration => {
                    upcomingConcerts.forEach(concert => {
                        registration.showNotification('다가오는 공연 알림', {
                            body: `${concert.title} 공연이 오늘 또는 내일입니다!`,
                            icon: concert.image,
                            vibrate: [200, 100, 200],
                            tag: `concert_${concert.idx}`,
                            data: {
                                url: `../classicConcertPages/${concert.link}`
                            }
                        });
                    });
                });
            })
            .catch(error => console.error('Error loading concert data:', error));
    }
});
