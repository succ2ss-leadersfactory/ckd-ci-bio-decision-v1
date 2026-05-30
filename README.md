# C1바이오 영업팀장 AI 리더십 Development Lab

종근당홀딩스 영업직군 팀장 대상 8시간 교육에서 사용하는 React/Vite 기반 MVP입니다.

## Routes

- `/` 참여자 앱
- `/?view=instructor` 강사용 대시보드
- `/?view=check` 사전점검 화면

## Stack

React, Vite, TypeScript, Tailwind CSS, localStorage, Google Sheets + Apps Script 선택 연동 구조입니다.

## Local development

```bash
npm install
npm run dev
npm run typecheck
npm run build
```

## Vercel

- Framework: Vite
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`

## Environment Variable

Google Sheets 연동 시 Vercel에 아래 환경변수를 등록합니다.

```bash
VITE_GOOGLE_SCRIPT_WEBAPP_URL=<Apps Script Web App URL>
```

환경변수가 없으면 앱은 localStorage 모드로 정상 작동합니다.
