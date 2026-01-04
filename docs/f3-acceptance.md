# F3 Acceptance Criteria & Verification

## Overview

This document outlines the verification steps for the F3 Settings UI implementation, ensuring voice, privacy, tool, and session preferences work as intended.

## Pre-requisites

- Backend running (`poetry run uvicorn src.main:app --reload`)
- Frontend running (`npm run dev`)
- Logged in user

## Test Cases

### 1. Settings Navigation

- [ ] Navigate to `/settings` via URL or app navigation.
- [ ] Verify 4 tabs present: Voice, Privacy, Tools, UI.
- [ ] Verify accessing `/settings?tab=tools` opens the Tools tab.

### 2. Voice Settings

- [ ] Toggle "Preferred Input Mode" between Text and Voice.
  - Verification: Refresh page, setting should persist.
- [ ] Toggle "Mic Default".
  - Verification: Refresh page, setting persists.
- [ ] Change "VAD Sensitivity".
- [ ] Change "Audio Chunk Size".
  - Verification: In Console, voice interactions should still work (no crash).

### 3. Privacy Settings

- [ ] Toggle "Store Transcripts".
- [ ] Enable "Store Audio".
  - Verification: **Warning Modal** appears.
  - Verification: Must check "I understand" to enable "Enable Storage" button.
  - Verification: Confirming enables the toggle.
- [ ] Disable "Store Audio".
  - Verification: Toggles off immediately without modal.
- [ ] Change "Retention Days".

### 4. Tool Permissions

- [ ] View list of tools grouped by category.
- [ ] Toggle a scope OFF (e.g. `tool.web.search`).
  - Verification: Backend settings updated.
- [ ] Change confirmation policy to "Always Deny" for a tool.
- [ ] **Reset Defaults**: Click "Reset tools defaults" in header.
  - Verification: Toggles revert to default state (enabled).

### 5. UI Settings & Application

- [ ] Change "Session Refresh Rate" to 5 seconds.
  - Verification: Console polling reduces frequency (check network tab session_history calls).
- [ ] Enable "Observability Panel".
  - Verification: Green stats overlay appears in Console top-right.
- [ ] Enable "Compact Mode".
  - Verification: Chat text size reduces in Console.

### 6. System Integration

- [ ] **Permissions Snapshot**: Check Console header for "All Systems Nominal" or "X Tools Blocked" pill.
- [ ] **Data Persistence**: Reload page or logout/login -> settings must remain.

## Automated Verification

Run frontend build to ensure type safety:

```bash
npm run build
```
