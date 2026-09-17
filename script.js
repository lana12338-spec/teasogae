
/* 카드 리사이징 */

function resizeCard() {
  const wrapper = document.querySelector('.card-scale-wrapper');
  const card = document.querySelector('.profile-card');
  const layout = document.querySelector('.page-layout');

  card.style.transform = 'none';

  const cardWidth = card.offsetWidth;
  const cardHeight = card.offsetHeight;

  const wrapperWidth = wrapper.clientWidth;

  const widthScale = wrapperWidth / cardWidth;

  let heightScale = 1;

  const isMobile = window.matchMedia('(max-width: 768px)').matches;

  if (!isMobile) {
    const layoutHeight = layout.clientHeight;
    heightScale = layoutHeight / cardHeight;
  }

  const scale = Math.min(widthScale, heightScale, 1);

  card.style.transform = 'scale(' + scale + ')';
  if (isMobile) {
  wrapper.style.height = (cardHeight * scale) + 'px';
} else {
  wrapper.style.height = '100%';
}
}

const cardWrapper = document.querySelector('.card-scale-wrapper');

const cardResizeObserver = new ResizeObserver(function () {
  resizeCard();
});

cardResizeObserver.observe(cardWrapper);

window.addEventListener('resize', resizeCard);

resizeCard();

/* 프로필 이미지 출력 */

const photoInput = document.querySelector('#input-photo');
const outputPhoto = document.querySelector('#output-photo');
const photoPlaceholder = document.querySelector('#photo-placeholder');
const removePhotoBtn = document.querySelector('#remove-photo-btn');
const photoFileName = document.querySelector('#photo-file-name');
const maxPhotoSize = 5 * 1024 * 1024;


photoInput.addEventListener('change', function () {
  const file = photoInput.files[0];

  if (!file) {
    return;
  }


  if (!file.type.startsWith('image/')) {
    alert('이미지 파일만 선택할 수 있습니다.');

    photoInput.value = '';
    photoFileName.textContent = '선택된 파일 없음';

    return;
  }

  if (file.size > maxPhotoSize) {
    alert('프로필 이미지는 5MB 이하로 선택해주세요.');

    photoInput.value = '';
    photoFileName.textContent = '선택된 파일 없음';

    return;
  }

  photoFileName.textContent = file.name;

  const reader = new FileReader();


  reader.addEventListener('load', function () {
    outputPhoto.src = reader.result;
  });


  reader.addEventListener('error', function () {
    alert('이미지를 불러오는 데 실패했습니다.');

    photoInput.value = '';
    photoFileName.textContent = '선택된 파일 없음';
  });


  reader.readAsDataURL(file);
});


outputPhoto.addEventListener('load', function () {
  outputPhoto.style.display = 'block';
  photoPlaceholder.style.display = 'none';
});


outputPhoto.addEventListener('error', function () {
  outputPhoto.src = '';
  outputPhoto.style.display = 'none';

  photoPlaceholder.style.display = 'block';

  alert('이미지 파일을 표시할 수 없습니다.');

  photoFileName.textContent = '선택된 파일 없음'; 
});


removePhotoBtn.addEventListener('click', function () {
  photoInput.value = '';

  outputPhoto.src = '';
  outputPhoto.style.display = 'none';

  photoPlaceholder.style.display = 'block';

  photoFileName.textContent = '선택된 파일 없음';
});

/*입력 필드*/

const fields = [
  'nick',
  'id',
  'other'
];

const textLists = [  'likecha',
  'likedogu',
  'likewith',
  'hate',
  ];

  /* 폼 입력 제한 관련 */

  const maxListItems = 5;

  /* 폼 입력 제한 반환 */

  function getListItemCount(value) {
  const lines = value.split('\n').filter(function (line) {
    return line.trim() !== '';
  });

  return lines.length;
}

/* 카운터 내용 실시간 업데이트 */

textLists.forEach(function (field) {
  const inputEl = document.querySelector('#input-' + field);

  inputEl.addEventListener('input', function () {
    updateListCount(field);
  });
});

/* 폼 내용 실시간 카운터 */

function updateListCount(field) {
  const inputEl = document.querySelector('#input-' + field);
  const countEl = document.querySelector('#count-' + field);

  const count = getListItemCount(inputEl.value);

  if (count > maxListItems) {
    countEl.textContent =
      count + ' / ' + maxListItems +
      '개 · 최대 ' + maxListItems + '개까지 표시';

    countEl.classList.add('over-limit');
  } else {
    countEl.textContent =
      count + ' / ' + maxListItems + '개';

    countEl.classList.remove('over-limit');
  }
}

/* 최종 반영 버튼 */

textLists.forEach(function (field) {
  updateListCount(field);
});

const sunteck = [ 'gender',
  'age',
];  


const applyBtn = document.querySelector('#apply-btn');

function updateCard() {

  fields.forEach(function (field) {
    const inputEl = document.querySelector('#input-' + field);
    const outputEl = document.querySelector('#output-' + field);

    outputEl.textContent = inputEl.value.trim();
  });

textLists.forEach(function (field) {
  const inputEl = document.querySelector('#input-' + field);
  const outputEl = document.querySelector('#output-' + field);

  const lines = inputEl.value.split('\n').filter(function (line) {
    return line.trim() !== '';
  });

  const limitedLines = lines.slice(0, maxListItems);

  outputEl.innerHTML = '';

  limitedLines.forEach(function (line) {
    const li = document.createElement('li');
    li.textContent = line.trim();
    outputEl.appendChild(li);
  });
});


  sunteck.forEach(function (field) {
    const inputEl = document.querySelector('#input-' + field);
    const outputEl = document.querySelector('#sunteck-' + field);
    const dolglelist = outputEl.querySelectorAll('.dolgle');

    dolglelist.forEach(function (dolgleEl) {
      if (inputEl.value === dolgleEl.textContent) {
        dolgleEl.classList.add('selected');
      } else {
        dolgleEl.classList.remove('selected');
      }
    });
  });

  resizeCard();

}

applyBtn.addEventListener('click', function () {
  updateCard();
});

/* 카드 이미지 출력 */

const downloadBtn = document.querySelector('#download-btn');

downloadBtn.addEventListener('click', async function () {
  updateCard();

  const cardEl = document.querySelector('#profile-card');

  const originalButtonText = downloadBtn.textContent;

  downloadBtn.disabled = true;
  downloadBtn.textContent = '이미지 저장 중...';

try {
  const exportScale = 2;
  const exportPadding = 40;

  const cardCanvas = await html2canvas(cardEl, {
    scale: exportScale,
    useCORS: true,
    backgroundColor: null,

    onclone: function (clonedDocument) {
      const clonedCard = clonedDocument.querySelector('#profile-card');

      clonedCard.style.transform = 'none';
    }
  });

  const padding = exportPadding * exportScale;

  const finalCanvas = document.createElement('canvas');

  finalCanvas.width = cardCanvas.width + padding * 2;
  finalCanvas.height = cardCanvas.height + padding * 2;

  const ctx = finalCanvas.getContext('2d');

  ctx.fillStyle = '#f7f3ec';
  ctx.fillRect(
    0,
    0,
    finalCanvas.width,
    finalCanvas.height
  );

  ctx.drawImage(
    cardCanvas,
    padding,
    padding
  );

  const link = document.createElement('a');

  link.download = '프로필카드.png';
  link.href = finalCanvas.toDataURL('image/png');

  link.click();

} catch (error) {
  console.error('이미지 저장 오류:', error);
  alert('이미지 저장 중 오류가 발생했습니다.');

} finally {
  downloadBtn.disabled = false;
  downloadBtn.textContent = originalButtonText;
}
});

