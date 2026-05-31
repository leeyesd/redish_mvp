# Plati Worker 배포 안내!

Cloudflare Workers Static Assets 방식으로 배포하는 구성입니다.

## 파일 구성

- `public/index.html`: Plati 웹페이지
- `src/index.js`: `/api/generate`를 처리하는 Worker 코드
- `wrangler.toml`: Worker와 static assets 연결 설정

## 왜 이 구조가 필요한가

Cloudflare에서 `Variables cannot be added to a Worker that only has static assets.`가 뜨는 이유는, HTML 같은 정적 파일만 있는 프로젝트에는 런타임 Worker 코드가 없기 때문입니다.

비밀키를 쓰려면 `src/index.js` 같은 Worker 코드가 있어야 하고, 정적 파일은 `env.ASSETS.fetch(request)`로 서빙해야 합니다.

## Cloudflare에서 넣을 Secret

필수:

```text
ANTHROPIC_API_KEY=본인 Anthropic API 키
```

선택:

```text
ANTHROPIC_MODEL=claude-sonnet-4-20250514
```

## 배포 설정

GitHub에는 이 폴더 안의 파일들을 저장소 루트에 올리면 됩니다.

Cloudflare Workers에서 GitHub repo를 연결할 때 이 파일들이 있어야 합니다:

```text
wrangler.toml
src/index.js
public/index.html
```

중요한 설정은 `wrangler.toml` 안의 이 부분입니다:

```toml
main = "src/index.js"

[assets]
directory = "./public"
binding = "ASSETS"
run_worker_first = ["/api/*"]
```

이 설정 때문에 `/api/generate`는 Worker가 처리하고, 나머지 페이지 파일은 정적 assets로 보여줍니다.
