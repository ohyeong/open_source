document.addEventListener('DOMContentLoaded', () => {
    const today = new Date();
    const upcomingContainer = document.getElementById('upcoming');
    const pastContainer = document.getElementById('past');

    // 로컬 스토리지에서 하트 상태 불러오기
    const heartState = Object.keys(localStorage).reduce((acc, key) => {
        if (key.startsWith('heartLiked_')) {
            acc[key.replace('heartLiked_', '')] = localStorage.getItem(key) === 'true';
        }
        return acc;
    }, {});

    // JSON 데이터 가져오기 (공연 목록 표시용)
    fetch('../../data/concert_infos_date.json')
        .then(response => response.json())
        .then(data => {
            const renderConcerts = () => {
                upcomingContainer.innerHTML = '';
                pastContainer.innerHTML = '';
                
                data.forEach(concert => {
                    const concertDate = new Date(concert.date);

                    if (isNaN(concertDate)) {
                        console.error(`Invalid date for concert: ${concert.title}`);
                        return;
                    }

                    const heartKey = `${concert.idx}`; // idx를 로컬 스토리지 키로 활용

                    // 하트가 눌린 공연만 렌더링
                    if (!heartState[heartKey]) return;

                    const concertCard = `
                        <div class="history-item">
                            <div class="history-image">
                                <img src="${concert.image}" alt="${concert.title}">
                            </div>
                            <div class="reservation-info">
                                <h4><u>${concert.genre.join(', ')}</u></h4>
                                <h3>${concert.title}</h3>
                                <p>${concert.date}<br>${concert.location}</p>
                                <div class="action-buttons">
                                    <a href="../classicConcertPages/${concert.link}" class="btn-more">세부 정보</a>
                                    <button class="heart-button" data-heart-id="${concert.idx}">
                                        <i class="${heartState[heartKey] ? 'fas liked fa-heart' : 'far fa-heart'}"></i>
                                    </button>
                                    <button class="share-button" data-title="${concert.title}" data-image="${concert.image}" data-link="../classicConcertPages/${concert.link}" data-description="${concert.university}에서 주최합니다. 연주회 보러오세요!">
                                        <i class="fas fa-share-alt"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    `;

                    // 공연 날짜에 따라 분류
                    if (concertDate >= today) {
                        upcomingContainer.innerHTML += concertCard;
                    } else {
                        pastContainer.innerHTML += concertCard;
                    }
                });

                // 하트 버튼 이벤트 다시 추가
                document.querySelectorAll('.heart-button').forEach(button => {
                    const heartId = button.dataset.heartId;
                    const heartIcon = button.querySelector('i');

                    button.addEventListener('click', () => {
                        const isLiked = heartIcon.classList.contains('liked');
                        if (isLiked) {
                            // 하트 취소
                            heartIcon.classList.remove('fas', 'liked');
                            heartIcon.classList.add('far');
                            localStorage.setItem(`heartLiked_${heartId}`, 'false');
                            heartState[heartId] = false;
                        } else {
                            // 하트 활성화
                            heartIcon.classList.remove('far');
                            heartIcon.classList.add('fas', 'liked');
                            localStorage.setItem(`heartLiked_${heartId}`, 'true');
                            heartState[heartId] = true;
                        }

                        // 현재 탭 상태 유지하며 재렌더링
                        renderConcerts();
                    });
                });

                // 공유 버튼 이벤트 다시 추가
                document.querySelectorAll('.share-button').forEach(button => {
                    button.addEventListener('click', () => {
                        const modal = document.getElementById('share-modal');
                        const title = button.dataset.title;
                        const image = button.dataset.image;
                        const link = `${window.location.origin}/src/pages/classicConcertPages/${button.dataset.link}`;
                        const description = button.dataset.description; // 대학 이름 기반 설명 추가
                
                        // 공유 데이터 저장
                        modal.dataset.title = title;
                        modal.dataset.image = image;
                        modal.dataset.link = link;
                        modal.dataset.description = description;
                
                        // 팝업 열기
                        modal.style.display = 'block';
                    });
                });
            };

            renderConcerts();

            // 공연이 없을 경우 메시지 표시
            if (upcomingContainer.innerHTML.trim() === '') {
                upcomingContainer.innerHTML = '<p>예정된 공연이 없습니다.</p>';
            }
            if (pastContainer.innerHTML.trim() === '') {
                pastContainer.innerHTML = '<p>지난 공연이 없습니다.</p>';
            }
        })
        .catch(error => console.error('Error loading concert data:', error));

    // 팝업 닫기 버튼 이벤트 추가
    document.getElementById('close-modal').addEventListener('click', () => {
        const modal = document.getElementById('share-modal');
        modal.style.display = 'none';
    });

    // 팝업 외부 클릭 시 닫기
    window.addEventListener('click', event => {
        const modal = document.getElementById('share-modal');
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });

    // 카카오톡 공유 버튼 이벤트 추가
    document.getElementById('kakao-share-button').addEventListener('click', () => {
        const modal = document.getElementById('share-modal');
        const title = modal.dataset.title;
        const image = modal.dataset.image;
        const link = modal.dataset.link;
        const description = modal.dataset.description;

        Kakao.Share.sendDefault({
            objectType: 'feed',
            content: {
                title: title,
                description: description,
                imageUrl: image,
                link: {
                    mobileWebUrl: link,
                    webUrl: link
                }
            },
            buttons: [
                {
                    title: '자세히 보기',
                    link: {
                        mobileWebUrl: link,
                        webUrl: link
                    }
                }
            ]
        });

        // 팝업 닫기
        modal.style.display = 'none';
    });

    // 클립보드 공유 버튼 이벤트 추가
    document.getElementById('clipboard-share-button').addEventListener('click', () => {
        const modal = document.getElementById('share-modal');
        const link = modal.dataset.link;

        const tmpTextarea = document.createElement('textarea');
        tmpTextarea.value = link;
        tmpTextarea.setAttribute('readonly', '');
        tmpTextarea.style.position = 'absolute';
        tmpTextarea.style.left = '-9999px';
        document.body.appendChild(tmpTextarea);
        tmpTextarea.select();
        tmpTextarea.setSelectionRange(0, 9999);
        document.execCommand('copy');
        document.body.removeChild(tmpTextarea);

        alert('링크가 클립보드에 복사되었습니다!');
        modal.style.display = 'none';
    });

    // 탭 전환 기능
    document.querySelectorAll('.tab-button').forEach(button => {
        button.addEventListener('click', () => {
            document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const target = button.dataset.tab;
            document.querySelectorAll('.concert-list').forEach(list => list.style.display = 'none');
            document.getElementById(target).style.display = 'grid';
        });
    });
});
