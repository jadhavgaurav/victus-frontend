# QA and Acceptance Plan for F1

## Manual Verification Steps

### 1. Chat Interface

- [ ] Open `http://localhost:5173`.
- [ ] Ensure title says "VICTUS CONSOLE".
- [ ] Type "Hello" in the chat input and press Enter.
- [ ] Verify message appears in feed (user role).
- [ ] Verify you receive an echoed response (if backend is mock) or actual response.
- [ ] Check console logs for session ID creation.

### 2. Voice Mode

- [ ] Verify microphone icon is present and labeled "Start Voice".
- [ ] Click "Start Voice". Browser should request microphone permission.
- [ ] Verify Jarvis indicator changes to "Listening" state (pulsing cyan circles).
- [ ] Speak into the mic.
- [ ] Verify visual feedback (if `onLevel` is working, circles pulse/scale).
- [ ] Stop speaking. Wait ~800ms.
- [ ] Verify state changes to "Processing" (indicator rotates).
- [ ] Verify transcript appears if backend sends it.
- [ ] Verify assistant speaks back (state "Speaking") and text is appended to chat.
- [ ] Click "Stop Voice".
- [ ] Verify indicator goes to "Wake Ready" (idle) if previously awake, or offline.
- [ ] Verify tracks are stopped (no red recording icon in tab).

### 3. Session History & Timeline

- [ ] Click "History View" or navigate to `/sessions/<uuid>`.
- [ ] Verify Timeline page loads.
- [ ] Check "Transcript" column matches your chat.
- [ ] Check "Tool Executions" column (if any tools ran).
- [ ] Check "Policy Decisions" column.
- [ ] Verify "Metadata" panel shows Session ID.

### 4. Confirmations

- [ ] Trigger a tool that requires confirmation (e.g. "Create a file named /etc/passwd").
- [ ] Verify "Confirmation Required" card appears in Console (above input).
- [ ] Verify "Confirmation Required" card appears in Timeline.
- [ ] In Console, try to type "cancel" or click Cancel. Verify card disappears.
- [ ] Trigger again. Click "Confirm" or type required phrase.
- [ ] Verify backend proceeds (mock or real).

### 5. Redaction

- [ ] In Timeline > Tool Executions, check Args/Result JSON.
- [ ] Ensure no visible JWT tokens or keys.
- [ ] Ensure `[REDACTED]` appears for sensitive keys.

### 6. Observability

- [ ] Check console logs for `X-CSRF-Token` header in network requests (except GET).
- [ ] Verify `apiFetch` does not throw 403.
