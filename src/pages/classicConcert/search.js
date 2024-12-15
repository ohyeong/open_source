const searchBar = document.getElementById("search-bar");
const searchResults = document.getElementById("search-results");
let clubs = []; // 데이터를 담을 배열

// JSON 데이터 로드
async function loadConcerts() {
    try {
        const response = await fetch("../../data/concert_infos.json"); // JSON 파일 경로
        const data = await response.json();
        // JSON 데이터를 검색용 데이터로 변환
        clubs = data.map(concert => ({
            title: concert.title,
            name: concert.club,
            university: concert.university,
            url: `../classicConcertPages/${concert.link}`
        }));
    } catch (error) {
        console.error("Error loading JSON data:", error);
    }
}

// 검색 결과 업데이트 함수
function updateSearchResults(query) {
    searchResults.innerHTML = ""; // 기존 검색 결과 초기화

    if (query) {
        const filteredClubs = clubs.filter(
            club =>
                club.title.toLowerCase().includes(query) ||
                club.name.toLowerCase().includes(query) ||
                club.university.toLowerCase().includes(query)
        );

        if (filteredClubs.length > 0) {
            // 검색 결과가 있을 경우
            filteredClubs.forEach(club => {
                const listItem = document.createElement("li");
                listItem.textContent = `${club.title} / ${club.university} ${club.name}`;
                listItem.addEventListener("click", () => {
                    window.location.href = club.url; // 세부 페이지로 이동
                });
                searchResults.appendChild(listItem);
            });
            searchResults.style.display = "block"; // 검색 결과 표시
        } else {
            // 검색 결과가 없을 경우
            const noResultsItem = document.createElement("li");
            noResultsItem.className = "no-results"; // 스타일 적용
            noResultsItem.textContent = "No results found";
            searchResults.appendChild(noResultsItem);
            searchResults.style.display = "block"; // 검색 결과 표시
        }
    } else {
        searchResults.style.display = "none"; // 검색창이 비었을 때 숨김
    }
}

// 검색 입력 이벤트
searchBar.addEventListener("input", () => {
    const query = searchBar.value.toLowerCase();
    updateSearchResults(query);
});

// 화면의 다른 곳 클릭 시 목록 숨김
document.addEventListener("click", (event) => {
    if (!searchBar.contains(event.target) && !searchResults.contains(event.target)) {
        searchResults.style.display = "none";
    }
});

// 검색창 클릭 시 목록 재등장
searchBar.addEventListener("focus", () => {
    const query = searchBar.value.toLowerCase();
    if (query) {
        searchResults.style.display = "block"; // 검색값이 있을 경우만 목록 표시
    }
});

// 초기화
loadConcerts(); // JSON 데이터 로드
