const apiKey = '';
const weatherContainer = document.querySelector('.weather-container');
const locationElement = document.getElementById('location');
const iconElement = document.getElementById('weather-icon');
const tempElement = document.getElementById('temperature');
const descElement = document.getElementById('description');
const remarksElement = document.getElementById('custom-remarks');

const seoulLat = 37.5665;
const seoulLon = 126.9780;

async function fetchWeather(lat, lon) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        renderWeather(data);
    } catch (error) {
        handleError();
    }
}

function renderWeather(data) {
    const { name } = data;
    const { icon, description, id } = data.weather[0];
    const { temp } = data.main;

    // 기본 날씨 정보 렌더링
    locationElement.textContent = name;
    tempElement.textContent = `${Math.round(temp)}°C`;
    iconElement.className = `weather-icon wi wi-owm-${id}`;
    descElement.textContent = description.charAt(0).toUpperCase() + description.slice(1);

    // 날씨에 따른 멘트 설정
    const remark = getWeatherRemark(id);
    remarksElement.textContent = remark;
}

function getWeatherRemark(weatherId) {
    if (weatherId >= 200 && weatherId < 300) {
        return '오늘은 천둥번개가 칠 예정입니다. 실내 공연 관람을 추천드려요!';
    } else if (weatherId >= 300 && weatherId < 400) {
        return '가벼운 이슬비가 내릴 예정입니다. 우산을 챙기시고 공연장에 오세요!';
    } else if (weatherId >= 500 && weatherId < 600) {
        return '오늘은 비가 내리는 날씨입니다. 공연 후 따뜻한 차 한 잔 어떨까요?';
    } else if (weatherId >= 600 && weatherId < 700) {
        return '눈이 내리는 날씨입니다. 포근하고 로맨틱한 공연을 추천드려요!';
    } else if (weatherId >= 700 && weatherId < 800) {
        return '안개가 짙은 날씨입니다. 공연장으로 오실 때 안전히 이동하세요!';
    } else if (weatherId === 800) {
        return '오늘은 맑은 날씨입니다. 공연 관람하기 딱 좋은 날씨네요! 즐거운 하루 되세요.';
    } else if (weatherId > 800) {
        return '구름이 많은 날씨입니다. 포근한 분위기의 공연을 추천드려요!';
    } else {
        return '날씨 정보를 확인할 수 없습니다. 공연 정보를 참고하세요!';
    }
}

function handleError() {
    locationElement.textContent = 'Unable to fetch weather data';
    remarksElement.textContent = '날씨 정보를 가져올 수 없습니다. 공연 관련 문의는 고객센터로 연락해주세요.';
}

fetchWeather(seoulLat, seoulLon);