# v39 Steps 1-7 Storage Optimization Note

## 1. Purpose

This note records the first optimization pass for Steps 1-7 of the v39 preview journey.

The purpose is to reduce UI breakage caused by browser storage errors and to make the early journey reset behavior consistent with the later Step 8-13 flow.

## 2. Verified stable baseline before this note

Commit verified before this note:

```text
5f8d5508da4f06635cf9715c26e71bef510d9cba
```

Actions result:

```text
C1Bio MVP CI: success
v39 Smoke: success
v35 Smoke: success
v36 Smoke: success
v38 Smoke: success
v40-lite Smoke: success
```

## 3. Scope

This optimization affects the v39 preview route only:

```text
/journey-v39-preview.html
```

Protected files and production route remain untouched:

```text
/journey.html
src/full-flow-journey-v34.tsx
src/journey-active.tsx
src/full-flow-journey-v35.tsx
src/journey-v38-app-preview.tsx
```

## 4. Common storage helper hardening

Updated file:

```text
src/journey-storage.ts
```

The helper now includes:

```text
canUseLocalStorage()
getJson()
setJson()
removeStoredPrefix()
```

The goal is to avoid breaking the learner flow when localStorage is unavailable, blocked, full, or contains malformed JSON.

The helper intentionally treats storage errors as non-fatal:

```text
Storage quota, private-mode, or JSON serialization errors should not break the learning flow.
```

## 5. Full v39 reset behavior

Updated file:

```text
src/journey-v39-app-preview.tsx
```

The progress reset button now clears every v39-scoped storage item:

```text
removeStoredPrefix('ckd.v39.')
```

This prevents older practice data from leaking into a new learner run.

Before this change, reset mainly cleared:

```text
ckd.v39.participant.v1
ckd.v39.progress.v1
```

After this change, reset also clears result stores from Steps 3-13 that share the `ckd.v39.` prefix.

## 6. Steps 5-7 result stores converted to safe helpers

The following stores now use safe helpers instead of direct browser storage calls.

### Step 5

```text
src/journey-v39-dashboard-result-store.ts
```

Related screen:

```text
우리 팀 관리 지표 선정
```

Storage helper use:

```text
getJson()
setJson()
removeStoredPrefix()
```

### Step 6

```text
src/journey-v39-customer-judgment-result-store.ts
```

Related screen:

```text
고객 Data 확인 List
```

Storage helper use:

```text
getJson()
setJson()
removeStoredPrefix()
```

### Step 7

```text
src/journey-v39-customer-strategy-result-store.ts
```

Related screen:

```text
고객군별 2주 대응 방향
```

Storage helper use:

```text
getJson()
setJson()
removeStoredPrefix()
```

## 7. Why this matters for Steps 1-7

Steps 1-7 create the base context for the rest of the Lab Journey:

```text
1단계: 입장·역할 부여
2단계: AI 안전선
3단계: 프롬프트 기본 실습
4단계: AI 전략 리서치
5단계: 우리 팀 관리 지표 선정
6단계: 고객 Data 확인 List
7단계: 고객군별 2주 대응 방향
```

If stored results from Steps 5-7 become corrupted or fail to save, the later flow can become inconsistent.

The safe helper pattern makes the early flow more resilient and helps prevent broken screens when learners refresh, reopen, or reset the preview app.

## 8. Static smoke guard

Updated file:

```text
scripts/smoke-v39-static.mjs
```

The v39 static smoke now checks that the Step 5-7 stores include:

```text
getJson
setJson
removeStoredPrefix
```

It also checks that these stores do not return to direct browser storage calls:

```text
window.localStorage.setItem
window.localStorage.getItem
window.localStorage.removeItem
```

## 9. Future caution

Do not reintroduce direct `window.localStorage.*` calls in Step 5-7 result stores unless there is a very specific reason.

Preferred pattern:

```text
load = normalize(getJson(key, null))
save = setJson(key, normalizedResultWithUpdatedAt)
clear = removeStoredPrefix(key)
```

## 10. Next recommended work

Recommended next work:

```text
Run browser QA for Steps 1-7 on /journey-v39-preview.html.
```

Browser QA should verify:

```text
1. Enter participant info and move forward.
2. Complete AI safety step without entering real customer or product data.
3. Create a structured prompt in Step 3.
4. Generate or paste strategic research notes in Step 4.
5. Select management metrics in Step 5 and refresh.
6. Confirm Step 6 can read Step 5 context and save customer Data check items.
7. Confirm Step 7 can read Step 6 context and save two-week customer group directions.
8. Use 진행 초기화 and confirm v39 saved values are cleared.
```
