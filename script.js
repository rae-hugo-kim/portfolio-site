const statusClassMap = {
  LIVE: 'live',
  WIP: 'wip',
  CHECK: 'check',
  PRIVATE: 'private',
  ARCH: 'arch',
  EOL: 'eol',
};

const statusOrder = { LIVE: 0, WIP: 1, CHECK: 2, PRIVATE: 3, ARCH: 4, EOL: 5 };

function placeholder(name) {
  const svg = `
    <svg xmlns='http://www.w3.org/2000/svg' width='1200' height='630'>
      <defs>
        <linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>
          <stop offset='0%' stop-color='#0f172a'/>
          <stop offset='100%' stop-color='#1d4ed8'/>
        </linearGradient>
      </defs>
      <rect width='100%' height='100%' fill='url(#g)'/>
      <text x='60' y='300' fill='white' font-size='70' font-family='sans-serif' font-weight='700'>${name}</text>
      <text x='60' y='390' fill='#bfdbfe' font-size='36' font-family='sans-serif'>Service Preview</text>
    </svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

function renderCard(service) {
  const template = document.querySelector('#card-template');
  const node = template.content.firstElementChild.cloneNode(true);

  const thumb = node.querySelector('.thumb');
  const status = node.querySelector('.status');
  const meta = node.querySelector('.meta');
  const name = node.querySelector('.name');
  const desc = node.querySelector('.desc');
  const link = node.querySelector('.link');

  name.textContent = service.name;
  desc.textContent = service.description;
  meta.textContent = service.category || '기타';

  const statusValue = (service.status || 'CHECK').toUpperCase();
  status.textContent = statusValue;
  status.classList.add(statusClassMap[statusValue] || 'check');

  const autoThumb = service.url
    ? `https://image.thum.io/get/width/1200/crop/630/noanimate/${encodeURIComponent(service.url)}`
    : '';
  thumb.src = service.ogImage || autoThumb || placeholder(service.name);
  thumb.alt = `${service.name} 미리보기`;
  thumb.onerror = () => {
    thumb.src = placeholder(service.name);
  };

  if (service.url) {
    link.href = service.url;
    link.textContent = '서비스 열기 ↗';
  } else {
    link.href = '#';
    link.setAttribute('aria-disabled', 'true');
    link.textContent = '내부/비공개 서비스';
  }

  return node;
}

async function init() {
  const root = document.querySelector('#cards');

  try {
    const res = await fetch('./services.json', { cache: 'no-cache' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const services = await res.json();
    services.sort((a, b) => (statusOrder[a.status] ?? 3) - (statusOrder[b.status] ?? 3));
    services.forEach((service) => root.appendChild(renderCard(service)));
  } catch (e) {
    root.innerHTML = `<p>서비스 목록을 불러오지 못했어: ${e.message}</p>`;
  }
}

init();
