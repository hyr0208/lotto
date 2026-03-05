# ☕ 커피 찾기

지뢰찾기에서 영감을 받은 실시간 멀티플레이어 팀 내기 게임입니다.
링크를 공유하면 각자 폰에서 접속해 함께 플레이할 수 있습니다.

## 게임 방법

1. 이름을 입력하고 **방 만들기** 버튼을 누릅니다
2. 생성된 링크를 친구에게 공유합니다
3. 참가자가 모이면 방장이 게임을 시작합니다
4. 자기 차례에 `?` 칸을 하나 선택합니다
5. `✓` 가 나오면 안전, `☕` 가 나오면 그 사람이 커피를 삽니다

## 주요 기능

- 🔗 **실시간 멀티플레이어** — 링크 공유로 각자 디바이스에서 참여
- 🎲 방 만들기 / 코드로 참가하기
- 📋 초대 링크 복사
- ⏳ 자기 차례에만 칸 선택 가능
- ☕ 칸 수 (9 / 12 / 16 / 20) 및 커피 수 (1 ~ 3개) 설정
- 🔄 같은 멤버로 바로 재시작 가능

## 기술 스택

| 항목       | 내용                       |
| ---------- | -------------------------- |
| 프레임워크 | React 19                   |
| 언어       | TypeScript                 |
| 스타일링   | Tailwind CSS v3            |
| 빌드 도구  | Vite 5                     |
| 실시간 DB  | Firebase Realtime Database |
| 라우팅     | React Router DOM           |

## 시작하기

```bash
npm install
npm run dev
```

> **Node.js 버전 참고**
> Vite 6은 Node.js 20.19+ / 22.12+ 를 요구합니다.
> Node v20.11 이하 환경에서는 이 프로젝트처럼 Vite 5를 사용하세요.

## 빌드

```bash
npm run build
```

## 배포

Jenkins + Docker 기반으로 자동 배포됩니다.

**파이프라인 흐름**

```
GitHub push → Jenkins 빌드 트리거
  → docker build (node:20-alpine → nginx:alpine)
  → docker run -p 3007:80
```

**배포 URL**: https://lotto.yyyerin.co.kr

---

Made with ❤️ by [yyyerin](https://github.com/yyyerin)
