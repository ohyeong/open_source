// 마커 데이터 배열
const markers = [
    { top: 50, left: 40, university: "서강대학교", club: "ACES", url: "../orchestraClubPages/aces_su.html" },
    { top: 75, left: 37, university: "서울대학교", club: "SNUPO", url: "../orchestraClubPages/snupo_snu.html" },
    { top: 40, left: 60, university: "경희대학교", club: "MDOP", url: "../orchestraClubPages/mdop_khu.html" },
    { top: 36, left: 48, university: "성균관대학교", club: "SKKUO", url: "../orchestraClubPages/skkuo_skku.html" },
    { top: 46, left: 60, university: "한양대학교", club: "HANAKLANG", url: "../orchestraClubPages/hanaklang_hu.html" },
    { top: 50, left: 65, university: "건국대학교", club: "KUPHIL", url: "../orchestraClubPages/kuphilharmonic_ku.html" },
    { top: 36, left: 55, university: "고려대학교", club: "Korea University Orchestra", url: "../orchestraClubPages/kuorchestra_ku.html" },
    { top: 24, left: 62, university: "광운대학교", club: "Da KAPO", url: "../orchestraClubPages/dakapo_kwu.html" },
    { top: 46, left: 51, university: "동국대학교", club: "OPUS", url: "../orchestraClubPages/opus_dgu.html" },
    { top: 53, left: 43, university: "숙명여자대학교", club: "S.O.Phi.A", url: "../orchestraClubPages/sophia_smwu.html" },
    { top: 38, left: 63, university: "서울시립대학교", club: "Cantabile", url: "../orchestraClubPages/cantabile_uos.html" },
    { top: 63, left: 41, university: "중앙대학교", club: "RUBATO", url: "../orchestraClubPages/rubato_cau.html" },
    { top: 49, left: 33, university: "홍익대학교", club: "HIAMO", url: "../orchestraClubPages/hiamo_hongik.html" }
];

// 지도 컨테이너 선택
const mapContainer = document.querySelector(".map");

function createMarker(top, left, university, club, url) {
    const marker = document.createElement("a");
    marker.className = "marker";
    marker.href = url;

    const markerImg = document.createElement("img");
    markerImg.src = "../../../public/images/map_marker.png";
    markerImg.alt = "Map Marker";
    markerImg.style.width = "30px";
    markerImg.style.height = "30px";
    markerImg.style.objectFit = "contain";

    // 툴팁 요소 생성
    const tooltip = document.createElement("div");
    tooltip.className = "marker-tooltip";
    tooltip.textContent = `${university} ${club}`;

    // 마커에 마우스 이벤트 추가
    marker.addEventListener("mouseover", () => {
        tooltip.style.display = "block";
    });

    marker.addEventListener("mouseout", () => {
        tooltip.style.display = "none";
    });

    // 마커 클릭 이벤트
    marker.addEventListener("click", (event) => {
        event.preventDefault();
        window.location.href = url;
    });

    marker.appendChild(markerImg);
    marker.appendChild(tooltip);

    marker.style.position = "absolute";
    marker.style.top = `${top}%`;
    marker.style.left = `${left}%`;

    return marker;
}

// 마커 추가
markers.forEach(markerData => {
    const marker = createMarker(
        markerData.top,
        markerData.left,
        markerData.university,
        markerData.club,
        markerData.url
    );
    mapContainer.appendChild(marker);
});
