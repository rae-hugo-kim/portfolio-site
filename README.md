# portfolio-site

Hugo 서비스 포트폴리오 정적 페이지.

## 로컬 실행

```bash
cd portfolio-site
python3 -m http.server 8787
# http://localhost:8787
```

## 서비스 추가/수정

`services.json`에서 항목 추가:

- `name`: 서비스 이름
- `url`: 링크 (없으면 비공개 버튼 처리)
- `description`: 한 줄 설명
- `status`: `LIVE | WIP | CHECK | PRIVATE`
- `category`: 카테고리
- `emoji`: 카드 메타 이모지
- `ogImage`: 썸네일 URL (없으면 자동 플레이스홀더)

## Caddy 배포 예시

```caddy
portfolio.hugokim.kr {
    encode zstd gzip
    root * /srv/portfolio-site
    file_server

    header {
        X-Content-Type-Options "nosniff"
        X-Frame-Options "SAMEORIGIN"
        Referrer-Policy "strict-origin-when-cross-origin"
    }
}
```

배포 순서(예):

```bash
sudo mkdir -p /srv/portfolio-site
sudo rsync -av --delete ./ /srv/portfolio-site/
sudo systemctl reload caddy
```

## Cloudflare 권장

- DNS: `portfolio` 서브도메인 A/AAAA 또는 CNAME 설정
- 프록시: ON (주황 구름)
- SSL/TLS: Full (strict)
- 캐시 규칙: 정적 파일 길게 캐시, `services.json`은 짧게
