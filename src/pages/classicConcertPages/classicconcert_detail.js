document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('section');
    
    if (sections.length === 0) {
        console.error("No sections found on the page. Please check your HTML structure.");
        return;
    }

    // 모든 버튼과 섹션 가져오기
    const buttons = document.querySelectorAll('.side-banner button');
    // 페이지가 처음 로드되었을 때 첫 번째 버튼 활성화 상태 설정
    buttons[0].classList.add('active');

    // 스크롤
    window.addEventListener('scroll', () => {
        let currentSectionIndex = -1;

        sections.forEach((section, index) => {
            if (!section) return;

            const rect = section.getBoundingClientRect();
            if (rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2) {
                currentSectionIndex = index;
            }
        });

        // 버튼 활성화 상태 업데이트
        buttons.forEach((button, index) => {
            if (index === currentSectionIndex) {
                button.classList.add('active');
            } else {
                button.classList.remove('active');
            }
        });
    });

    // 버튼 클릭 시 해당 섹션으로 스크롤 이동
    buttons.forEach((button, index) => {
        button.addEventListener('click', () => {
            const targetSection = sections[index];
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // 현재 HTML 파일의 클럽명을 구분하기 위한 dataset 사용
    const currentClub = document.body.dataset.club;

    // JSON 파일 불러오기
    fetch('../../data/concert_infos.json')
        .then(response => response.json())
        .then(data => {
            const concertData = data.find(concert => concert.club === currentClub);

            if (concertData) {
                const heartKey = `heartLiked_${concertData.idx}`; // idx를 고유 키로 활용
                const heartButton = document.querySelector('.heart-button');
                const heartIcon = heartButton.querySelector('i');

                //로컬 스토리지에서 하트 상태 로드
                const isLiked = localStorage.getItem(heartKey) === 'true';
                if (isLiked) {
                    heartIcon.classList.remove('far');
                    heartIcon.classList.add('fas', 'liked');
                }
            
                // 하트 버튼 클릭 시 상태 변경 및 로컬 스토리지에 저장
                heartButton.addEventListener('click', function() {
                    if (heartIcon.classList.contains('far')) {
                        heartIcon.classList.remove('far');
                        heartIcon.classList.add('fas', 'liked');
                        localStorage.setItem(heartKey, 'true');
                    } else {
                        heartIcon.classList.remove('fas', 'liked');
                        heartIcon.classList.add('far');
                        localStorage.setItem(heartKey, 'false');
                    }
                });

                 // 공유 버튼 이벤트
                // const shareButton = document.querySelector('.share-button');
                // shareButton.addEventListener('click', function () {
                //     if (navigator.share) {
                //         navigator.share({
                //             title: document.getElementById('concert-title').textContent,
                //             text: '연주회에 대해 알아보세요!',
                //             url: window.location.href
                //         }).then(() => {
                //             console.log('공유 성공!');
                //         }).catch((error) => {
                //             console.error('공유 실패:', error);
                //         });
                //     } else {
                //         alert('이 브라우저에서는 공유 기능이 지원되지 않습니다.');
                //     }
                // });
                
                //공연 정보 페이지에 렌더링
                document.querySelector('.menu-bar-link[href=""]').href = concertData.link; 
                document.getElementById('concert-link').textContent = concertData.club;

                document.getElementById('concert-title').textContent = concertData.title;
                document.getElementById('concert-date').textContent = concertData.date;
                document.getElementById('concert-time').textContent = concertData.time;
                document.getElementById('concert-location').textContent = concertData.location;
                document.getElementById('concert-univ').textContent = concertData.university;
                document.getElementById('concert-image').src = concertData.image;

            } else {
                console.error(`No concert information found for club: ${currentClub}`);
            }
        })
        .catch(error => console.error('Error fetching JSON data:', error));
});
