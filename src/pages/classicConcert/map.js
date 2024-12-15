var mapContainer = document.getElementById('map'),
mapOption = { 
    center: new kakao.maps.LatLng(37.5060235, 126.973263), // 지도 중심좌표
    level: 10 // 확대
};

var map = new kakao.maps.Map(mapContainer, mapOption);

var overlays = []; // 열린 오버레이를 저장할 배열

var placesService = new kakao.maps.services.Places();
var geocoder = new kakao.maps.services.Geocoder();
var markers = [];
var startPoint = null;
var endPoint = null;
var startMarker = null;
var endMarker = null;
var currentPolyline = null; 
let selectedStartEl = null;
let selectedEndEl = null;

// JSON 데이터 로드
fetch('../../data/positions.json') // JSON 파일 경로
    .then(response => response.json())
    .then(positions => {
        // 마커와 커스텀 오버레이 생성
        positions.forEach((position, index) => {
            // 마커 생성
            var marker = new kakao.maps.Marker({
                map: map,
                position: new kakao.maps.LatLng(position.latLng.lat, position.latLng.lng)
            });

            // 커스텀 오버레이 콘텐츠 생성
            var content = `
                <div class="wrap">
                    <div class="info">
                        <div class="title">
                            ${position.title}
                            <div class="close" onclick="closeOverlay(${index})" title="닫기"></div>
                        </div>
                        <div class="body">
                            <div class="img">
                                <img src="${position.image}" width="73" height="70">
                            </div>
                            <div class="desc">
                                <div class="ellipsis">${position.address}</div>
                                <div class="jibun ellipsis">${position.date}</div>
                                <div><a href="${position.link}" class="link">세부 페이지</a></div>
                            </div>
                        </div>
                    </div>
                </div>
            `;

            // 오버레이 생성
            var overlay = new kakao.maps.CustomOverlay({
                content: content,
                position: new kakao.maps.LatLng(position.latLng.lat, position.latLng.lng),
                map: null // 처음에는 보이지 않도록 설정
            });

            overlays.push(overlay);

            // 마커 클릭 시 오버레이 표시/닫기
            kakao.maps.event.addListener(marker, 'click', function() {
                if (overlay.getMap()) {
                    overlay.setMap(null); // 오버레이가 열려 있다면 닫기
                } else {
                    closeAllOverlays(); // 모든 오버레이 닫기
                    overlay.setMap(map); // 해당 오버레이 표시
                }
            });
        });
    });

// 모든 오버레이 닫기
function closeAllOverlays() {
    overlays.forEach(function(overlay) {
        overlay.setMap(null);
    });
}

// 특정 오버레이 닫기
function closeOverlay(index) {
    overlays[index].setMap(null);
}


// 마커 생성
function addMarker(position, idx) {
    var imageSrc = 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_number_blue.png',
        imageSize = new kakao.maps.Size(36, 37),
        imgOptions = {
            spriteSize: new kakao.maps.Size(36, 691),
            spriteOrigin: new kakao.maps.Point(0, (idx * 46) + 10),
            offset: new kakao.maps.Point(13, 37)
        },
        markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imgOptions),
        marker = new kakao.maps.Marker({
            position: position,
            image: markerImage 
        });

    marker.setMap(map);
    markers.push(marker);

    return marker;
}

// 검색 함수
function searchPlaces(type) {
    var keyword = document.getElementById(type + 'Keyword').value;

    if (!keyword.trim()) {
        alert('키워드를 입력해주세요.');
        return;
    }

    placesService.keywordSearch(keyword, function(result, status) {
        if (status === kakao.maps.services.Status.OK) {
            displayPlaces(result.slice(0, 5), type);
        } else if (status === kakao.maps.services.Status.ZERO_RESULT) {
            alert('검색 결과가 없습니다.');
        } else {
            alert('검색 중 오류가 발생했습니다.');
        }
    }, {size: 5});
}

// 검색 결과 표시
function displayPlaces(places, type) {
    var listEl = document.getElementById(type + 'PlacesList');
    listEl.innerHTML = '';

    removeMarkers();
    removePolyline();

    // 검색 결과의 중심 계산
    var bounds = new kakao.maps.LatLngBounds();

    places.forEach((place, index) => {
        var marker = addMarker(new kakao.maps.LatLng(place.y, place.x), index);

        var itemEl = document.createElement('li');
        itemEl.innerHTML = `
            <h3>${index + 1}. ${place.place_name}</h3>
            <div>${place.address_name}</div>
        `;
        listEl.appendChild(itemEl);

        itemEl.style.cursor = 'pointer'; // 클릭 가능 표시

        // 클릭 시 장소 선택 및 스타일 변경
        itemEl.addEventListener('click', function () {
            selectPlace(place.y, place.x, type);

            // 이전 선택된 항목 스타일 초기화
            if (type === 'start' && selectedStartEl) {
                selectedStartEl.style.backgroundColor = ''; // 초기화
            }
            if (type === 'end' && selectedEndEl) {
                selectedEndEl.style.backgroundColor = ''; // 초기화
            }

            // 선택 상태 업데이트
            if (type === 'start') {
                itemEl.style.backgroundColor = 'rgba(255, 166, 0, 0.3)'; // 출발지 색상
                selectedStartEl = itemEl;
            } else if (type === 'end') {
                itemEl.style.backgroundColor = 'rgba(255, 166, 0, 0.3)'; // 도착지 색상
                selectedEndEl = itemEl;
            }
        });
        
        // 마커 클릭 시 지도 이동
        kakao.maps.event.addListener(marker, 'click', function() {
            map.panTo(new kakao.maps.LatLng(place.y, place.x));
        });

        // Bounds에 포함
        bounds.extend(new kakao.maps.LatLng(place.y, place.x));
    });

    // 지도 중심을 검색 결과 중심으로 설정
    map.setBounds(bounds);
}

// 마커 제거
function removeMarkers() {
    markers.forEach(marker => marker.setMap(null));
    markers = [];
}

// 장소 선택
function selectPlace(lat, lng, type) {
    var selectedPoint = new kakao.maps.LatLng(lat, lng);

    removeMarkers();

    // 선택된 장소의 마커 이미지 설정
    var imageSrc = "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png"; 
    var imageSize = new kakao.maps.Size(24, 35); 
    var markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize);

    // 출발지 마커 설정
    if (type === 'start') {
        startPoint = selectedPoint;
        // 기존 마커 제거
        if (startMarker) {
            startMarker.setMap(null);
        }
        // 새 마커 생성 및 지도에 표시
        startMarker = new kakao.maps.Marker({
            position: selectedPoint,
            image: markerImage
        });
        startMarker.setMap(map);
    }
    // 도착지 마커 설정
    else if (type === 'end') {
        endPoint = selectedPoint;
        // 기존 마커 제거
        if (endMarker) {
            endMarker.setMap(null);
        }
        // 새 마커 생성 및 지도에 표시
        endMarker = new kakao.maps.Marker({
            position: selectedPoint,
            image: markerImage
        });
        endMarker.setMap(map);
    }
    // 선택한 위치로 지도 이동
    map.panTo(selectedPoint);
}

// 길찾기 실행
async function findRoute() {
    if (startPoint && endPoint) {
        const startLat = startPoint.getLat();
        const startLng = startPoint.getLng();
        const endLat = endPoint.getLat();
        const endLng = endPoint.getLng();

        // API 요청 URL 생성
        const apiUrl = `https://apis-navi.kakaomobility.com/v1/directions?` +
            `origin=${startLng},${startLat}` +
            `&destination=${endLng},${endLat}`;

        try {
            // GET 요청
            const response = await fetch(apiUrl, {
                method: 'GET',
                headers: {
                    'Authorization': 'KakaoAK ',              // 여기에 REST API 키 넣기
                    'Content-Type': 'application/json'
                }
            });

            /// 응답 처리
            if (response.ok) {
                const data = await response.json();

                const linePath = []; // 경로를 저장할 배열
                const routes = data.routes;

                if (routes && routes.length > 0) {
                    const route = routes[0]; // 추천 경로

                    // 경로 정보에서 선형 좌표 추출
                    route.sections[0].roads.forEach(road => {
                        road.vertexes.forEach((vertex, index) => {
                            if (index % 2 === 0) {
                                linePath.push(new kakao.maps.LatLng(
                                    road.vertexes[index + 1], // lat
                                    road.vertexes[index] // lng
                                ));
                            }
                        });
                    });

                    // 기존 Polyline 제거
                    removePolyline();

                    // 지도에 Polyline 추가
                    currentPolyline = new kakao.maps.Polyline({
                        path: linePath,
                        strokeWeight: 5,
                        strokeColor: '#FF0000',
                        strokeOpacity: 0.7,
                        strokeStyle: 'solid'
                    });

                    currentPolyline.setMap(map); // 지도에 경로 표시

                    // 지도 범위를 출발지와 목적지를 포함하도록 설정
                    const bounds = new kakao.maps.LatLngBounds();
                    bounds.extend(startPoint); // 출발지 추가
                    bounds.extend(endPoint); // 도착지 추가
                    map.setBounds(bounds); // 지도 범위 설정

                    const totalDistance = route.summary.distance >= 1000 
                        ? `${(route.summary.distance / 1000).toFixed(1)}km` // 소숫점 1자리 반올림
                        : `${route.summary.distance}m`;

                    // 예상시간: 60분 이상일 경우 ~시간 ~분 형태로 변환
                    const durationInMinutes = Math.round(route.summary.duration / 60); // 반올림
                    const hours = Math.floor(durationInMinutes / 60);
                    const minutes = durationInMinutes % 60;
                    const estimatedTime = hours > 0 
                        ? `${hours}시간 ${minutes}분`
                        : `${minutes}분`;

                    // 택시요금 및 통행요금: 세자리마다 콤마 추가
                    const taxiFare = `${route.summary.fare.taxi.toLocaleString()}원`;
                    const tollFare = `${route.summary.fare.toll.toLocaleString()}원`;

                    // HTML에 업데이트
                    document.getElementById('totalDistance').innerText = totalDistance;
                    document.getElementById('estimatedTime').innerText = estimatedTime;
                    document.getElementById('taxiFare').innerText = taxiFare;
                    document.getElementById('tollFare').innerText = tollFare;

                } else {
                    alert('경로를 찾을 수 없습니다.');
                }
            } else {
                alert(`API 요청 실패: ${response.status}`);
            }
        } catch (error) {
            console.error('길찾기 중 오류 발생:', error);
            alert('길찾기 중 오류가 발생했습니다.');
        }
    } else {
        alert('출발지와 도착지를 모두 설정하세요.');
    }
}

function removePolyline() {
    if (currentPolyline) {
        currentPolyline.setMap(null); // 지도에서 제거
        currentPolyline = null; // 변수 초기화
    }
}