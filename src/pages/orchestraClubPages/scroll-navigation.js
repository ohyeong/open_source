// 페이지 로드 시 "소개" 버튼을 기본 활성화 상태로 설정
document.addEventListener('DOMContentLoaded', () => {
    const introButton = document.querySelector('.btn-intro');
    introButton.classList.add('active');
});

// 스크롤 위치에 따라 버튼 스타일을 변경하는 함수
window.addEventListener('scroll', () => {
    const introSection = document.getElementById('intro');
    const historySection = document.getElementById('history');
    const introButton = document.querySelector('.btn-intro');
    const historyButton = document.querySelector('.btn-history');

    const introPosition = introSection.getBoundingClientRect().top;
    const historyPosition = historySection.getBoundingClientRect().top;

    // 스크롤 위치에 따라 버튼 스타일을 변경
    if (introPosition <= window.innerHeight / 2 && historyPosition > window.innerHeight / 2) {
        introButton.classList.add('active');
        historyButton.classList.remove('active');
    } else if (historyPosition <= window.innerHeight / 2) {
        introButton.classList.remove('active');
        historyButton.classList.add('active');
    }
});


document.querySelector('.btn-intro').addEventListener('click', () => {
    const introSection = document.getElementById('intro');
    const offset = -150;
    const elementPosition = introSection.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.scrollY + offset;

    window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
    });
});

document.querySelector('.btn-history').addEventListener('click', () => {
    const historySection = document.getElementById('history');
    const offset = -170; // -170px 위로 보이게 조정 -> 물어보기!!
    const elementPosition = historySection.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.scrollY + offset;

    window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
    });
});
