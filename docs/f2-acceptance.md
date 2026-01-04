# QA and Acceptance Plan for F2

## Automated Tests

- [ ] `npm run build` should pass without errors (verifies strict TS compliance).

## Manual Verification Steps

### 1. Unauthenticated Access

- [ ] Clear cookies/incognito.
- [ ] Visit `/`.
- [ ] Verify immediate redirect to `/login`.
- [ ] Visit `/sessions/some-random-id`.
- [ ] Verify redirect to `/login`.

### 2. Login Flow

- [ ] Enter invalid credentials.
- [ ] Verify error message appears.
- [ ] Enter valid credentials.
- [ ] Verify redirect to `/` (Console).
- [ ] Verify cookies `victus_session` and `csrf_token` are set.

### 3. Session Persistence

- [ ] Reload page (`Cmd+R`).
- [ ] Verify user remains logged in (no flicker to login page).
- [ ] Verify "User" email displayed in top right.

### 4. Logout

- [ ] Click Logout button in top right.
- [ ] Verify redirect to `/login`.
- [ ] Verify cookies are cleared (or invalid).
- [ ] Try back button -> should redirect to login.

### 5. CSRF Reliability

- [ ] Log in.
- [ ] Open DevTools Application tab -> Cookies.
- [ ] Delete `csrf_token` cookie manually.
- [ ] Send a chat message.
- [ ] Verify message sends successfully (frontend should auto-refresh CSRF and retry).
- [ ] Check Network tab: should see 403 (optional) -> GET /auth/csrf -> Retry POST /message 200.

### 6. Dev Tools

- [ ] Run in dev mode (`npm run dev`).
- [ ] Go to Login page.
- [ ] Verify "Dev Tools" panel is visible at bottom.
- [ ] Click "Bootstrap Dev Session".
- [ ] Verify auto-login and redirect to `/`.

### 7. Admin Session Summary

- [ ] Log in as Superuser.
- [ ] Navigate to `/admin/sessions/<active_session_id>`.
- [ ] Verify Admin Debug View loads with stats.
- [ ] Log in as Normal User.
- [ ] Navigate to same URL.
- [ ] Verify "Access denied" or redirect (depending on backend implementation of the view, frontend handles 403).

### 8. Expiry Warning

- [ ] (Hard to test manually without manipulating backend/cookies)
- [ ] Verify yellow "SESSION EXPIRING" banner if expiry < 10m.
