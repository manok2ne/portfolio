const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

require('dotenv').config({ path: path.join(__dirname, '../.env.local') });

const SERVICE_KEY = process.env.BUSAN_FOOD_API_KEY;
if (!SERVICE_KEY) {
  console.error('.env.local 에 BUSAN_FOOD_API_KEY 가 없습니다.');
  process.exit(1);
}

const BASE_URL = 'http://apis.data.go.kr/6260000/FoodService/getFoodKr';
const TARGET_COUNT = 100;

function get(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    client.get(url, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        try { resolve(JSON.parse(body)); }
        catch (e) { reject(new Error('JSON 파싱 실패: ' + body.slice(0, 200))); }
      });
    }).on('error', reject);
  });
}

async function fetchAll() {
  const params = new URLSearchParams({
    serviceKey: SERVICE_KEY,
    numOfRows: TARGET_COUNT,
    pageNo: 1,
    resultType: 'json',
  });

  const url = `${BASE_URL}?${params}`;
  console.log('요청 중...');

  const data = await get(url);

  const items = data?.getFoodKr?.item;
  if (!items) {
    console.error('응답 구조 확인 필요:', JSON.stringify(data, null, 2).slice(0, 500));
    process.exit(1);
  }

  const list = Array.isArray(items) ? items : [items];

  const result = list.map((item) => ({
    id: item.UC_SEQ,
    name: item.MAIN_TITLE,
    district: item.GUGUN_NM,
    address: item.ADDR1,
    tel: item.CNTCT_TEL,
    menu: item.RPRSNTV_MENU,
    hours: item.USAGE_DAY_WEEK_AND_TIME,
    homepage: item.HOMEPAGE_URL,
    lat: item.LAT,
    lng: item.LNG,
    thumb: item.MAIN_IMG_THUMB,
    detail: item.ITEMCNTNTS,
  }));

  const out = path.join(__dirname, '../data/busan-food.json');
  fs.writeFileSync(out, JSON.stringify(result, null, 2), 'utf-8');
  console.log(`완료: ${result.length}건 → data/busan-food.json`);
}

fetchAll().catch((e) => { console.error(e); process.exit(1); });
