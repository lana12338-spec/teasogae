
/*리사이징*/

function resizeCard() {
  const wrapper = document.querySelector('.card-scale-wrapper');
  const card = document.querySelector('.profile-card');

  card.style.transform = 'none';
  const realHeight = card.offsetHeight;

  const wrapperWidth = wrapper.clientWidth;
  const cardWidth = 900;

  let scale = wrapperWidth / cardWidth;
  scale = Math.min(scale, 1);

  card.style.transform = 'scale(' + scale + ')';
  wrapper.style.height = (realHeight * scale) + 'px';
}

window.addEventListener('resize', resizeCard);
window.addEventListener('load', resizeCard);

/* 프로필 이미지 출력 스크립트 */

const photoInput = document.querySelector('#input-photo');

photoInput.addEventListener('change', function () {
  const file = photoInput.files[0];

  if (file) {
    const reader = new FileReader();

    reader.addEventListener('load', function () {
      const outputPhoto = document.querySelector('#output-photo');
      outputPhoto.src = reader.result;
      outputPhoto.style.display = 'block';
      document.querySelector('#photo-placeholder').style.display = 'none';
    });

    reader.readAsDataURL(file);
  }
});


/*채워넣기 함수*/

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

const sunteck = [ 'gender',
  'age',];  

const applyBtn = document.querySelector('#apply-btn');

applyBtn.addEventListener('click', function () {
  fields.forEach(function (field) {
    const inputEl = document.querySelector('#input-' + field);
    const outputEl = document.querySelector('#output-' + field);
    if (inputEl.value.trim() !== '') {
      outputEl.textContent = inputEl.value;
      outputEl.classList.add('filled');   // 추가
    }
  });

  textLists.forEach(function (field) {
    const inputEl = document.querySelector('#input-' + field);
    const outputEl = document.querySelector('#output-' + field);

    const lines = inputEl.value.split('\n').filter(function (line) {
      return line.trim() !== '';
    });

    if (lines.length > 0) {
      outputEl.innerHTML = '';

      lines.forEach(function (line) {
        const li = document.createElement('li');
        li.textContent = line;
        outputEl.appendChild(li);
      });
    }
  });

  /*선택하기 함수*/

sunteck.forEach(function (field) {
    const inputEl = document.querySelector('#input-' + field);
    const outputEl = document.querySelector('#sunteck-' + field);
    const dolglelist = outputEl.querySelectorAll('.dolgle'); 
    
    dolglelist.forEach(function (dolgleE1) {
    if (inputEl.value === dolgleE1.textContent) {
      dolgleE1.classList.add('selected');
    }
    else {dolgleE1.classList.remove('selected')}
    });
  });
});

/*이미지출력*/

const downloadBtn = document.querySelector('#download-btn');

downloadBtn.addEventListener('click', function () {
  const cardEl = document.querySelector('#profile-card');

  const originalTransform = cardEl.style.transform;
  cardEl.style.transform = 'none';

  const wrapper = document.createElement('div');
  wrapper.className = 'capture-wrapper';

  cardEl.parentNode.insertBefore(wrapper, cardEl);
  wrapper.appendChild(cardEl);

  requestAnimationFrame(function () {
    html2canvas(wrapper, {
      scale: 1,
      useCORS: true,
      backgroundColor: '#f7f3ec'
    }).then(function (canvas) {
      const link = document.createElement('a');
      link.download = '프로필카드.png';
      link.href = canvas.toDataURL('image/png');
      link.click();

      wrapper.parentNode.insertBefore(cardEl, wrapper);
      wrapper.remove();
      cardEl.style.transform = originalTransform;
    });
  });
});