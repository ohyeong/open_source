document.addEventListener('DOMContentLoaded', () => {
    
    const selectedOptions = {}; // 선택된 옵션 저장
    const selectedOptionsList = document.getElementById('selected-options-list');

    const suggestedMusic = document.querySelector('.suggested-music');
    const suggestedMusicTitle = document.getElementById('suggested-music-title');
    const suggestedConcert = document.getElementById("suggested-concert");

    let musicData = []; // 음악 데이터를 저장할 변수
    let concertData = []; // 공연 데이터를 저장할 변수
    let isMusicDataLoaded = false; // JSON 데이터 로드 상태를 확인하는 변수

    //JSON 데이터 로드
    Promise.all([
        fetch('../../data/composer_music.json').then(response => response.json()),
        fetch('../../data/concert_infos.json').then(response => response.json())
    ])
        .then(([music, concerts]) => {
            musicData = music;
            concertData = concerts;
            isMusicDataLoaded = true; // 데이터가 성공적으로 로드되었음을 표시
        })
        .catch(error => console.error('Error loading JSON:', error));


    // 카테고리 옵션 클릭 이벤트 처리
    document.querySelectorAll('.options div').forEach(option => {
        option.addEventListener('click', () => {
            const category = option.closest('.category').id; // 상위 카테고리 ID
            if (!selectedOptions[category]) {
                selectedOptions[category] = [];
            }
            if (selectedOptions[category].includes(option.innerText)) {
                // 선택 해제
                selectedOptions[category] = selectedOptions[category].filter(opt => opt !== option.innerText);
                option.classList.remove('selected');
            } else {
                // 선택 추가
                selectedOptions[category].push(option.innerText);
                option.classList.add('selected');
            }
            updateSelectedOptions();
        });
    });

    // 선택된 옵션 업데이트
    function updateSelectedOptions() {
        selectedOptionsList.innerHTML = ''; // 초기화
        Object.keys(selectedOptions).forEach(category => {
            selectedOptions[category].forEach(option => {
                const optionDiv = document.createElement('div');
                optionDiv.textContent = `${option} ×`;
                optionDiv.className = 'selected-option';
                optionDiv.addEventListener('click', () => {
                    selectedOptions[category] = selectedOptions[category].filter(opt => opt !== option);
                    updateSelectedOptions();
                    document.querySelectorAll('.options div').forEach(optDiv => {
                        if (optDiv.innerText === option) optDiv.classList.remove('selected');
                    });
                });
                selectedOptionsList.appendChild(optionDiv);
            });
        });
    }

    // Suggested Concert 카드 생성 함수
    function createConcertCards(concerts) {
        const concertCardsContainer = document.querySelector('.concert-cards');
        concertCardsContainer.innerHTML = ''; // 기존 콘텐츠 초기화

        concerts.forEach(concert => {
            // 카드 생성
            const card = document.createElement('div');
            card.className = 'concert-card';

            // 이미지 추가
            const img = document.createElement('img');
            img.src = concert.image || 'placeholder.jpg'; // 이미지가 없을 경우 기본 이미지 사용
            img.alt = concert.title;

            // 설명 추가
            const description = document.createElement('div');
            description.className = 'card-description';

            const title = document.createElement('h3');
            title.textContent = concert.title; // title 값 설정

            const date = document.createElement('p');
            date.textContent = concert.date; // date 값 설정

            // 구성 추가
            description.appendChild(title);
            description.appendChild(date);
            card.appendChild(img);
            card.appendChild(description);

            // 클릭 시 이동
            card.addEventListener('click', () => {
                const url = `../classicConcertPages/${concert.link}`; // URL 경로 설정
                window.location.href = url;
            });

            // 컨테이너에 추가
            concertCardsContainer.appendChild(card);
        });
    }

    // 추천 버튼 클릭 이벤트
    document.getElementById('recommend-btn').addEventListener('click', () => {
        if (!isMusicDataLoaded) {
            alert('Music data is not loaded yet. Please wait.');
            return;
        }

        if (Object.keys(selectedOptions).length === 0) {
            alert('Please select at least one option.');
            return;
        }

        // 콘서트 카드 컨테이너 초기화
        const concertCardsContainer = document.querySelector('.concert-cards');
        concertCardsContainer.innerHTML = ''; 
        
        // 선택된 태그와 일치하는 곡 필터링
        let filteredMusic = musicData.filter(music => {
            return Object.keys(selectedOptions).every(category => {
                if (!selectedOptions[category].length) return true; // 해당 카테고리에 선택된 옵션이 없는 경우 통과
                return selectedOptions[category].some(option => option.toLowerCase() === music[category].toLowerCase());
            });
        });

        // 필터링된 곡이 없으면 전체 음악 데이터 중 랜덤 추천
        let message = '';
        if (filteredMusic.length === 0) {
            filteredMusic = [musicData[Math.floor(Math.random() * musicData.length)]];
            message = `
                <div style="margin-bottom: 10px; font-size: 14px; color: #555;">
                    We couldn't find any matches for your selected options.<br>
                    But don't worry! We've picked a great piece for you to explore :
                </div>
            `;
        }

        // 랜덤 곡 선택
        const randomMusic = filteredMusic[Math.floor(Math.random() * filteredMusic.length)];
        suggestedMusicTitle.innerHTML = `${message} ${randomMusic.composer} - ${randomMusic.title}`;
        
        // Suggested Concert 로직
        if (randomMusic.eventDetailsAvailable === 1) {
            
            // 관련 콘서트 필터링
            const relatedConcerts = concertData.filter(concert => concert.music.includes(randomMusic.idx));
            if (relatedConcerts.length > 0) {
                createConcertCards(relatedConcerts); // 카드 생성 함수 호출
                document.getElementById('suggested-concert').style.display = 'block'; // 관련 콘서트 표시
                suggestedConcert.style.alignItems = 'flex-start';
            } 
            else {
                const concertCardsContainer = document.querySelector('.concert-cards');
                concertCardsContainer.innerHTML = ''; // 기존 콘텐츠 초기화
                const noConcertMessage = document.createElement('div');
                noConcertMessage.textContent = 'No related concerts found.';
                noConcertMessage.style.textAlign = 'center';
                noConcertMessage.style.color = '#777';
                noConcertMessage.style.fontSize = '16px';
                concertCardsContainer.appendChild(noConcertMessage);
                suggestedConcert.style.alignItems = 'center';
                document.getElementById('suggested-concert').style.display = 'block'; // No concert 메시지 표시
            }
        } else if (randomMusic.eventDetailsAvailable === 0 || randomMusic.eventDetailsAvailable === -1) {
            // 이벤트 세부 정보가 없는 경우
            const concertCardsContainer = document.querySelector('.concert-cards');
            concertCardsContainer.innerHTML = ''; // 기존 콘텐츠 초기화
            const noConcertMessage = document.createElement('div');
            noConcertMessage.textContent = 'No related concerts found.';
            noConcertMessage.style.textAlign = 'center';
            noConcertMessage.style.color = '#777';
            noConcertMessage.style.fontSize = '16px';
            concertCardsContainer.appendChild(noConcertMessage);
            suggestedConcert.style.alignItems = 'center';
            document.getElementById('suggested-concert').style.display = 'block'; // No concert 메시지 표시
        }

        suggestedMusic.style.display = 'flex'; // Suggested Music 표시
        suggestedConcert.style.display = 'flex'; // Suggested Concert 표시
    });
});