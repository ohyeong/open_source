// 슬라이더 이미지 데이터
const images = [
    "../../../public/images/main_banner/main_banner_1.jpg",
    "../../../public/images/main_banner/main_banner_2.jpg",
    "../../../public/images/main_banner/main_banner_3.jpg",
    "../../../public/images/main_banner/main_banner_4.jpg",
    "../../../public/images/main_banner/main_banner_5.jpg"
];

// 슬라이더 요소 선택
const sliderImages = document.getElementById('slider-images');
const prevBtn = document.querySelector('.prev');
const nextBtn = document.querySelector('.next');

// 이미지 추가 (클론 포함)
function setupSlider() {
    const firstClone = document.createElement('img');
    const lastClone = document.createElement('img');

    firstClone.src = images[0]; // 첫 번째 이미지 복사본
    lastClone.src = images[images.length - 1]; // 마지막 이미지 복사본

    firstClone.classList.add('clone');
    lastClone.classList.add('clone');

    sliderImages.insertBefore(lastClone, sliderImages.firstChild); // 앞에 마지막 이미지 복사
    images.forEach((src) => {
        const img = document.createElement('img');
        img.src = src;
        sliderImages.appendChild(img);
    });
    sliderImages.appendChild(firstClone); // 끝에 첫 번째 이미지 복사
}

setupSlider();

// 초기 상태
let index = 1; // 첫 번째 실제 이미지가 화면에 표시되도록 설정
const totalSlides = images.length + 2; // 원본 이미지 + 클론 이미지
const slideWidth = 100 / totalSlides; // 각 슬라이드의 너비 (%)
let autoSlideInterval; // 자동 슬라이드 타이머

// 슬라이더 스타일 초기화 (애니메이션 없이 초기 위치 설정)
sliderImages.style.transition = "none"; // 애니메이션 제거
sliderImages.style.width = `${totalSlides * 100}%`;
sliderImages.style.transform = `translateX(-${index * slideWidth}%)`; // 첫 번째 실제 이미지 위치
Array.from(sliderImages.children).forEach((img) => {
    img.style.width = `${slideWidth}%`;
});

// 웹페이지 로드 후 첫 이동 시 애니메이션 추가
window.addEventListener("load", () => {
    setTimeout(() => {
        sliderImages.style.transition = "transform 0.5s ease-in-out";
    }, 50); // 약간의 딜레이를 추가해 애니메이션 없이 초기화 후 활성화
    startAutoSlide(); // 자동 슬라이드 시작
});

// 슬라이드 이동 함수
function moveToSlide(i) {
    sliderImages.style.transition = "transform 1s ease-in-out"; // 이동 시 애니메이션 추가
    sliderImages.style.transform = `translateX(-${i * slideWidth}%)`;
    index = i;
}

// 무한 루프 처리
function handleTransitionEnd() {
    if (index === totalSlides - 1) {
        sliderImages.style.transition = "none"; // 애니메이션 제거
        index = 1; // 첫 번째 실제 이미지로 이동
        sliderImages.style.transform = `translateX(-${index * slideWidth}%)`;
    } else if (index === 0) {
        sliderImages.style.transition = "none"; // 애니메이션 제거
        index = totalSlides - 2; // 마지막 실제 이미지로 이동
        sliderImages.style.transform = `translateX(-${index * slideWidth}%)`;
    }
}

// 자동 슬라이드 기능
function startAutoSlide() {
    stopAutoSlide(); // 기존 타이머 초기화
    autoSlideInterval = setInterval(() => {
        moveToSlide(index + 1); // 다음 슬라이드로 이동
    }, 3000); // 3초마다 실행
}

// 자동 슬라이드 중지
function stopAutoSlide() {
    clearInterval(autoSlideInterval);
}

// 버튼 이벤트 추가
prevBtn.addEventListener('click', () => {
    stopAutoSlide(); // 사용자가 슬라이드 이동 시 타이머 중지
    moveToSlide(index - 1); // 이전 사진으로 이동
    startAutoSlide(); // 타이머 재설정
});

nextBtn.addEventListener('click', () => {
    stopAutoSlide(); // 사용자가 슬라이드 이동 시 타이머 중지
    moveToSlide(index + 1); // 다음 사진으로 이동
    startAutoSlide(); // 타이머 재설정
});

// 슬라이더의 무한 루프 처리
sliderImages.addEventListener("transitionend", handleTransitionEnd);

// 슬라이더 이미지 데이터와 링크 매핑
// const images = [
//     {
//         src: "../../../public/images/main_banner/main_banner_1.jpg",
//         link: ""
//     },
//     {
//         src: "../../../public/images/main_banner/main_banner_2.jpg",
//         link: "../orchestraClubPages/dakapo_kwu.html"
//     },
//     {
//         src: "../../../public/images/main_banner/main_banner_3.jpg",
//         link: "../classicConcertPages/DaKAPO_11.html"
//     },
//     {
//         src: "../../../public/images/main_banner/main_banner_4.jpg",
//         link: ""
//     },
//     {
//         src: "../../../public/images/main_banner/main_banner_5.jpg",
//         link: ""
//     }
// ];

// // 슬라이더 요소 선택
// const sliderImages = document.getElementById('slider-images');
// const prevBtn = document.querySelector('.prev');
// const nextBtn = document.querySelector('.next');

// // 이미지 추가 (클론 포함)
// function setupSlider() {
//     const firstClone = document.createElement('img');
//     const lastClone = document.createElement('img');

//     firstClone.src = images[0].src; // 첫 번째 이미지 복사본
//     firstClone.dataset.link = images[0].link; // 링크 정보 추가
//     lastClone.src = images[images.length - 1].src; // 마지막 이미지 복사본
//     lastClone.dataset.link = images[images.length - 1].link; // 링크 정보 추가

//     firstClone.classList.add('clone');
//     lastClone.classList.add('clone');

//     sliderImages.insertBefore(lastClone, sliderImages.firstChild); // 앞에 마지막 이미지 복사
//     images.forEach(({ src, link }) => {
//         const img = document.createElement('img');
//         img.src = src;
//         img.dataset.link = link; // 링크 정보 추가
//         img.addEventListener('click', () => {
//             window.location.href = link; // 이미지 클릭 시 해당 링크로 이동
//         });
//         sliderImages.appendChild(img);
//     });
//     sliderImages.appendChild(firstClone); // 끝에 첫 번째 이미지 복사

//     // 클론 이미지 클릭 이벤트 추가
//     firstClone.addEventListener('click', () => {
//         window.location.href = firstClone.dataset.link;
//     });
//     lastClone.addEventListener('click', () => {
//         window.location.href = lastClone.dataset.link;
//     });
// }

// setupSlider();

// // 초기 상태
// let index = 1; // 첫 번째 실제 이미지가 화면에 표시되도록 설정
// const totalSlides = images.length + 2; // 원본 이미지 + 클론 이미지
// const slideWidth = 100 / totalSlides; // 각 슬라이드의 너비 (%)
// let autoSlideInterval; // 자동 슬라이드 타이머

// // 슬라이더 스타일 초기화 (애니메이션 없이 초기 위치 설정)
// sliderImages.style.transition = "none"; // 애니메이션 제거
// sliderImages.style.width = `${totalSlides * 100}%`;
// sliderImages.style.transform = `translateX(-${index * slideWidth}%)`; // 첫 번째 실제 이미지 위치
// Array.from(sliderImages.children).forEach((img) => {
//     img.style.width = `${slideWidth}%`;
// });

// // 웹페이지 로드 후 첫 이동 시 애니메이션 추가
// window.addEventListener("load", () => {
//     setTimeout(() => {
//         sliderImages.style.transition = "transform 0.5s ease-in-out";
//     }, 50); // 약간의 딜레이를 추가해 애니메이션 없이 초기화 후 활성화
//     startAutoSlide(); // 자동 슬라이드 시작
// });

// // 슬라이드 이동 함수
// function moveToSlide(i) {
//     sliderImages.style.transition = "transform 1s ease-in-out"; // 이동 시 애니메이션 추가
//     sliderImages.style.transform = `translateX(-${i * slideWidth}%)`;
//     index = i;
// }

// // 무한 루프 처리
// function handleTransitionEnd() {
//     if (index === totalSlides - 1) {
//         sliderImages.style.transition = "none"; // 애니메이션 제거
//         index = 1; // 첫 번째 실제 이미지로 이동
//         sliderImages.style.transform = `translateX(-${index * slideWidth}%)`;
//     } else if (index === 0) {
//         sliderImages.style.transition = "none"; // 애니메이션 제거
//         index = totalSlides - 2; // 마지막 실제 이미지로 이동
//         sliderImages.style.transform = `translateX(-${index * slideWidth}%)`;
//     }
// }

// // 자동 슬라이드 기능
// function startAutoSlide() {
//     stopAutoSlide(); // 기존 타이머 초기화
//     autoSlideInterval = setInterval(() => {
//         moveToSlide(index + 1); // 다음 슬라이드로 이동
//     }, 3000); // 3초마다 실행
// }

// // 자동 슬라이드 중지
// function stopAutoSlide() {
//     clearInterval(autoSlideInterval);
// }

// // 버튼 이벤트 추가
// prevBtn.addEventListener('click', () => {
//     stopAutoSlide(); // 사용자가 슬라이드 이동 시 타이머 중지
//     moveToSlide(index - 1); // 이전 사진으로 이동
//     startAutoSlide(); // 타이머 재설정
// });

// nextBtn.addEventListener('click', () => {
//     stopAutoSlide(); // 사용자가 슬라이드 이동 시 타이머 중지
//     moveToSlide(index + 1); // 다음 사진으로 이동
//     startAutoSlide(); // 타이머 재설정
// });

// // 슬라이더의 무한 루프 처리
// sliderImages.addEventListener("transitionend", handleTransitionEnd);
