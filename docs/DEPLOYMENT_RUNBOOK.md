# Deployment Runbook

1. GitHub 저장소에 코드 반영
2. Vercel에서 저장소 연결
3. Framework는 Vite로 선택
4. `/`, `/?view=instructor`, `/?view=check` 접속 확인
5. Google Sheets 생성 후 Apps Script에 `apps-script/Code.gs` 붙여넣기
6. `setupSheetsC1Bio` 실행
7. Web App으로 배포
8. Vercel 환경변수 `VITE_GOOGLE_SCRIPT_WEBAPP_URL` 등록
9. 재배포 후 `/?view=check` 재확인

## Vercel Settings

- Framework: Vite
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`
