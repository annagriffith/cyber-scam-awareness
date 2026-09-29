# BREACH POINT User Guide

## Cyber Scam Awareness - Breach Point 

**Document type:** User Guide
**Application:** BREACH POINT
**Project:** scam and deepfake awareness
**Audience:**  students


## 1. Purpose and Scope

Breach Point is a fictional, browser-based social-engineering awareness simulation. The application lets a user select fictional targets, choose simulated attack techniques, complete awareness training, and review the effect of an attack against the company's fictional funds and exposure controls.

The experience is educational, local, and sandboxed. It does not send real phishing messages, send SMS messages, place phone calls, contact real people, submit real credentials, or connect to a production company system.

This guide explains how to install, run, use, and troubleshoot the application. It also records the current technical and deployment limitations verified in the repository.

## 2. Before You Start

### Required for the frontend

- Node.js version `>=24 <25`, as declared in `package.json`.
- npm, installed with Node.js.
- A modern browser with JavaScript enabled.
- Browser audio enabled if using narration, music, or vishing clips.

### Optional for voice-clone demonstrations

- Python 3.11.
- A working microphone and browser microphone permission.
- The local Python virtual environment and dependencies described in [services/voice-clone/README.md](services/voice-clone/README.md).
- Internet access for the first Chatterbox model download.
- Suitable PyTorch and torchaudio packages for the computer's platform.

The voice-clone service is optional. The main React application can run without it.

[Word screenshot suggestion: Gameplay dashboard]

## 3. Installation and Quick Start

### 3.1 Install frontend dependencies

Open a terminal in the repository root and run:

```powershell
npm install
```

### 3.2 Start the frontend

The current `package.json` defines `dev`, `build`, `lint`, and `preview` scripts. It does not define an `npm start` script.

Start the development server with:

```powershell
npm run dev
```

Open the Vite URL printed in the terminal, normally:

```text
http://localhost:5173/gameplay
```

If port 5173 is already in use, choose another port:

```powershell
npm run dev -- --host 127.0.0.1 --port 4175
```

Then open:

```text
http://127.0.0.1:4175/gameplay
```

Stop the development server with `Ctrl+C` in its terminal.

### 3.3 Reset BREACH POINT training progress

Training completion is stored in browser session storage. To reset only the BREACH POINT progress for the current browser origin, open the browser developer console and run:

```javascript
sessionStorage.removeItem('breach-point:learning-progress:v1');
location.reload();
```

This targeted command leaves unrelated session-storage entries untouched.

### 3.4 Optional voice-clone setup

The service is separate from the frontend. From `services/voice-clone`, create its environment and install its requirements:

```powershell
python -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
```

The startup script normally uses:

```text
services/voice-clone/.venv/Scripts/python.exe
```

Start it from the repository root with:

```powershell
.\services\voice-clone\start-service.ps1
```

The local service uses `127.0.0.1:8000`. Check its health endpoint at:

```text
http://127.0.0.1:8000/health
```

You can override the service interpreter or device without editing the startup script:

```powershell
$env:VOICE_CLONE_PYTHON = "C:\path\to\environment\Scripts\python.exe"
$env:VOICE_CLONE_DEVICE = "cpu"
.\services\voice-clone\start-service.ps1
```

Keep the service terminal open while testing voice generation.

## 4. System Overview

| Area | Implementation |
|---|---|
| Frontend | React 19 with React DOM, using the dependency ranges declared in `package.json` |
| Development and build tool | Vite 8, using the dependency range declared in `package.json` |
| Routing | `react-router-dom` with `BrowserRouter` |
| Language | JavaScript and JSX using ES modules |
| Styling | Component and page CSS files |
| Browser persistence | Session storage for learning completion only |
| Audio | Browser speech synthesis, local MP3 assets, and HTML audio playback |
| Runtime requirement | Node.js `>=24 <25` |

The application entry point is [src/main.jsx](src/main.jsx). It mounts the React application into the `#root` element in [index.html](index.html). The page title is `BREACH POINT`.

### Application routes

| Route | Screen | Purpose |
|---|---|---|
| `/` | Home | Project introduction and entry point |
| `/how-to-play` | How to Play | Objective, rules, and win/loss conditions |
| `/learn-about-scams` | Learn About Scams | Educational and reporting resources |
| `/gameplay` | Gameplay | Main simulation and Learning Library |
| `/game-over` | Game Over | Displayed when attacker exposure reaches 100% |
| `/victory` | Victory | Displayed when funds reach zero or the CEO is successfully attacked |

## 5. Using BREACH POINT

### 5.1 First-Time User Flow

1. Open `/gameplay` in the browser.
2. Review the currently selected fictional target and scenario information.
3. Select a technique: **Phishing**, **Fake Social Profile**, or **Deepfake**.
4. Select an available attack type from that technique's type menu.
5. If the selected type is locked, open **LEARNING** and complete the required module.
6. Return to the gameplay dashboard after completing training.
7. Launch the unlocked simulation.
8. Review the Aegis defence selection and the Round Result, including damage, exposure change, defensive dialogue, and the outcome.
9. Continue with another round or reach a Victory or Game Over screen.

### 5.2 Select a target

The available fictional targets are:

- Jordan Malik - Service Desk employee.
- Priya Nandakumar - Receptionist.
- Derek Combs - IT Manager.
- Sarah Lindqvist - HR Manager.
- Marcus Reyes - CEO.

Jordan and Priya are the initial employee targets. Manager targets are locked until the user completes an effective attack against Jordan or Priya. Marcus is locked until the user completes an effective attack against a manager.

A successful target is marked as completed and cannot be selected again during that session. Target vulnerabilities, resistances, intelligence, and previous attempts affect the simulation result.

### 5.3 Select a technique

The gameplay screen provides three technique families:

| Technique | Available types |
|---|---|
| Phishing | Email, SMS, Vishing / voice call, Teams / Slack DM |
| Fake Social Profile | Facebook, Instagram, LinkedIn |
| Deepfake | Voice clone, Video / image |

Required learning modules lock individual attack types until the corresponding training is complete. The Teams / Slack module is currently unavailable in the Learning Library.

[Word screenshot suggestion: Technique selection and locked training state]

## 6. Game Rules and Progression

The simulation begins with fictional company funds of **AUD 5,000,000**. The user is trying to reduce those funds before attacker exposure reaches 100%.

### Win conditions

The simulation reaches Victory when:

- Company funds reach zero; or
- The CEO, Marcus Reyes, is successfully attacked.

### Loss condition

The simulation reaches Game Over when attacker exposure reaches 100% before a Victory condition is reached.

### Round progression

1. Select a target.
2. Select a technique and attack type.
3. Complete required training if the type is locked.
4. Launch the simulation.
5. Aegis selects the matching company defence automatically.
6. Review the pending defence response and display the Round Result.
7. Funds, exposure, target progress, intelligence, and technique counts are updated.
8. Continue to the next round when available.

## 7. Aegis Defence System

Aegis is the company-controlled defence layer. It automatically pairs the selected attack type with a relevant security control. The user cannot change the control because the user is acting as the attacker; Aegis represents the environment being tested.

| Attack type | Aegis control | Purpose |
|---|---|---|
| Email | Secure Email Gateway | Scans links and attachments, detects spoofed domains, and checks SPF, DKIM, and DMARC. |
| SMS | Mobile Threat Defence | Flags suspicious senders and malicious links before interaction. |
| Vishing | Trusted Callback Verification | Requires sensitive requests to be checked through a known company number. |
| Facebook | Identity and Impersonation Monitoring | Detects cloned profiles and encourages trusted-channel verification. |
| Instagram | Social Impersonation Detection | Monitors lookalike accounts and unverified identities. |
| LinkedIn | Professional Network Verification | Checks mutual connections, profile history, and identity signals. |
| Voice clone | Voice Verification Protocol | Uses challenge-response and trusted callback verification. |
| Video / image deepfake | Liveness and Media Provenance Check | Reviews liveness, provenance, context, and second-channel confirmation. |

The defence modifier changes the calculated success chance. Aegis is not presented as perfect: a carefully disguised fictional request may still reach the simulated user, so independent verification and reporting remain important.

[Word screenshot suggestion: Company Defence System / Aegis panel]

## 8. Learning Library and Training Modules

The **LEARNING** control opens `TrainingLibrary.jsx`. Training completion is routed through the parent gameplay state and stored in session storage for the current browser session.

### Module availability

| Module ID | Module | Current repository status |
|---|---|---|
| `email` | Email Phishing | Available |
| `sms` | SMS Phishing | Available |
| `vishing` | Vishing / Voice Call | Available |
| `teams` | Teams / Slack Phishing | In development and unavailable |
| `facebook` | Facebook Impersonation | Available |
| `instagram` | Instagram Impersonation | Available |
| `linkedin` | LinkedIn Impersonation | Available |
| `voice-clone` | Voice-Clone Deepfake | Available |
| `video-deepfake` | Video / Image Deepfake | Available in the catalogue; content is marked as in development |

The labels above describe the current repository catalogue. Whether a module is considered complete for an assessment should be confirmed with the project owner.

### Email Phishing

Component: `src/training/phishing/EmailPhishingModule.jsx`

The module contains four steps:

1. **Spot the Signs:** Inspect 16 warning signs across four fictional emails.
2. **Choose the Email:** Select the safer email in four comparison decisions. All four must be correct to continue.
3. **How the Attack Works:** Explore the interactive five-stage email journey.
4. **Summary:** Review safer habits, official resources, and completion information.

The email journey stages are **Impersonation**, **Delivery**, **Interaction**, **Fake Sign-in**, and **Account Misuse**. The workspace explicitly states that the simulation sends no real email or sign-in activity.

### SMS Phishing

Component: `src/training/phishing/SmsPhishingModule.jsx`

The module covers suspicious fictional conversations, warning signs, emotional manipulation tactics, and safe response routes that leave the untrusted SMS conversation.

### Voice Phishing / Vishing

Component: `src/training/phishing/VishingModule.jsx`

The module includes take-the-call examples, challenge-the-caller decisions, trusted callback verification, and branching “what would happen” conversations. It can use local MP3 clips and falls back to browser speech synthesis when a clip cannot be played.

The safe callback sequence is:

```text
END THE UNVERIFIED CALL → FIND A TRUSTED CONTACT → CALL BACK INDEPENDENTLY → REPORT THE ATTEMPT
```

### Facebook, Instagram, and LinkedIn impersonation

Components:

- `src/training/social/FacebookModule.jsx`
- `src/training/social/InstagramModule.jsx`
- `src/training/social/LinkedInModule.jsx`
- Shared workflow: `src/training/social/SocialTrainingModule.jsx`

These modules cover profile and message inspection, red flags, safer decisions, attack simulation, and a defence summary for the relevant platform.

### Voice Clone

Components:

- `src/training/deepfake/VoiceCloneModule.jsx`
- `src/training/deepfake/voiceClone/VoiceCloneModule.jsx`

The module explains the voice-cloning process, supports an optional local demonstration, asks the user to identify contextual warning signs, and teaches independent verification. The browser recording is temporary and is deleted by the interface when the activity is completed or skipped.

The local service accepts a temporary reference audio recording and text for generation. The text limit is 140 characters and the browser recording limit is 20 seconds.

### Video / Image Deepfake

Component: `src/training/deepfake/VideoDeepfakeModule.jsx`

The module covers visual warning signs, real-or-fake media comparisons, verification principles, reporting, and official learning resources. Expected media files that are missing or fail to load are represented by “coming soon” placeholders.

## 9. Audio and Optional Voice-Clone Service

### 9.1 Frontend audio

The dashboard music asset is:

```text
/public/audio/max-brhon-cyberpunk.mp3
```

Gameplay narration uses the browser Speech Synthesis API when available. The interface provides Play, Pause, Replay, and Mute controls for the scenario narration. The voice-selection helper prioritises English voices, especially Australian English where available.

Vishing data references local MP3 files under:

```text
/audio/vishing/take-the-call/
/audio/vishing/challenge-the-caller/
/audio/vishing/what-would-happen/
```

If a vishing audio file cannot be played, the module uses speech synthesis where supported.

### 9.2 Voice-clone service behaviour

The service is an isolated, local-only Chatterbox Turbo proof of concept. It binds to `127.0.0.1`, does not use an external generation API, and stores uploaded, converted, and generated files in temporary request directories that are deleted after each request.

The service does not log supplied text, filenames, or audio. Requests are serialised to reduce concurrent GPU-memory spikes. Generated audio is not downloadable through the React interface.

The service tries compatible accelerators before CPU. The device can be overridden with `VOICE_CLONE_DEVICE`, including `cpu` when required.

## 10. Safety and Privacy

Breach Point is a fictional educational simulation:

- It does not send real emails, SMS messages, phone calls, or social-media requests.
- It does not connect to a real company system or external phishing service.
- The sign-in page is a visual simulation with prefilled training data; it does not submit or collect credentials.
- The social, email, SMS, and vishing content uses fictional scenarios and inactive or simulated interactions.
- The voice-clone reference recording is temporary and is cleaned up by the browser activity.
- Session learning progress is stored locally in browser session storage, not in a user account.
- Users should never enter real passwords, payment details, personal information, or private recordings into the demonstration.

## 11. Accessibility and Controls

- Visible transcripts provide an alternative when narration cannot be heard.
- Browser Speech Synthesis is used where supported; availability depends on the browser and installed voices.
- Training modules use labelled dialog regions with `role="dialog"` and `aria-modal="true"`.
- Press Escape to close training modules where supported.
- The Email construction workspace supports keyboard activation with Enter and Space.
- Buttons expose labels for actions such as Play, Pause, Replay, Mute, Continue, and Complete Module.
- Progress counters show clue, decision, or module progress.
- Keep browser zoom stable so panels and counters remain visible.
- Do not rely on colour alone when interpreting safe or unsafe feedback.
- Microphone permission is required only for the optional Voice Clone recording activity.

## 12. Build, Deployment and Technical Handover

### 12.1 Production build and preview

Create a production build:

```powershell
npm run build
```

Serve the built output locally with Vite Preview:

```powershell
npm run preview
```

The build may report a large-chunk warning for the main bundle. A successful `vite build` still indicates that the build completed. This warning is a performance consideration, not a documented runtime failure.

### 12.2 Docker status

Docker deployment is **not currently implemented**. The repository does not include a `Dockerfile` or `docker-compose.yml`, so it is not Docker-ready until a container definition is added and tested.

A future static-site handover would need to:

1. Run `npm run build`.
2. Serve `dist/` from a web server such as nginx.
3. Expose the agreed local port.
4. Configure history fallback so application routes serve `index.html`.
5. Include the required audio and image assets.
6. Run the optional voice-clone service separately and keep it bound to localhost.

Do not treat this proposed process as an existing repository command or deployment configuration.

### 12.3 Technical handover information

- Frontend source entry: `src/main.jsx`.
- Gameplay component: `src/Gameplay.jsx`.
- Training library: `src/training/TrainingLibrary.jsx`.
- Training progress hook: `src/training/useTrainingProgress.js`.
- Attack and module registry: `src/training/trainingRegistry.js`.
- Defence configuration: `src/gameLogic/defense/defenseConfig.js`.
- Optional service startup: `services/voice-clone/start-service.ps1`.
- Optional service documentation: `services/voice-clone/README.md`.
- Build configuration: `vite.config.js`.

## 13. Known Limitations

The following limitations are verified from the repository:

1. No Dockerfile or Compose file is currently included.
2. The repository does not define an `npm start` script.
3. The Video / Image Deepfake catalogue entry is available, but its format is marked “Module in development.”
4. Some expected deepfake media files may be unavailable and are replaced by coming-soon placeholders.
5. Voice-clone generation depends on the optional local service, compatible Python/PyTorch installation, hardware support, and model availability.
6. The first voice-clone service start may download the Chatterbox model and therefore requires internet access.
7. The Windows voice-clone prototype uses Perth's explicit `DummyWatermarker` because the real Perth audio-watermark implementation is unavailable in the current Windows package. Generated prototype audio is therefore not genuinely watermarked.
8. Browser speech-synthesis voices and microphone support vary by browser and computer.
9. Learning completion is session-only and is not a permanent user account record.
10. The current repository contains no configured automated test script in `package.json`.

## 14. Troubleshooting

| Problem | Action |
|---|---|
| `npm start` is not recognised | Use `npm run dev`; the repository does not define a `start` script. |
| Port 5173 is busy | Run `npm run dev -- --host 127.0.0.1 --port 4175` and open the printed URL. |
| No narration is heard | Check browser permissions, system volume, output device, mute state, and the visible transcript. |
| A vishing MP3 does not play | Confirm the asset path under `public/audio/vishing/`; speech synthesis can provide a fallback where supported. |
| An attack type remains locked | Complete the matching Learning Library module, then return to Gameplay. |
| Training progress is unexpected | Run the targeted reset command in Section 3.3. |
| The voice-clone service is unavailable | Confirm Python 3.11, `.venv`, installed requirements, the service terminal, and `http://127.0.0.1:8000/health`. The frontend can continue without the service. |
| The microphone cannot start | Check browser permission, microphone connection, and whether another application is using it. The Voice Clone activity can be skipped. |
| Deepfake media shows a placeholder | The referenced media file may be unavailable; the module is designed to show a coming-soon state instead of a broken player. |
| Docker handover cannot start | Docker is not currently implemented. A tested Dockerfile or Compose file must be supplied before deployment. |

## 15. Safety Reminder

Pause when a request creates urgency, secrecy, or pressure. Inspect the sender, context, destination, and requested action. Verify through a trusted channel that you found independently. Report suspicious activity early.

Breach Point is a fictional educational simulation. Never use real credentials, payment details, personal information, or private recordings in the application.
