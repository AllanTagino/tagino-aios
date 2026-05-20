---
name: social-video-scrapper-aios
version: "1.2.0"
description: Download videos from YouTube/Instagram, extract and clean transcripts, and output .txt (for agents) + polished .docx / .pdf (for humans). Invoke when the user provides a video URL.
---

# Social Video Scrapper

Download videos from YouTube and Instagram, extract transcripts, and optionally run AI analysis — all from a single skill.

## Intent Routing

| User says | Action |
|-----------|--------|
| "download this video [URL]" | Run download only |
| "transcribe this video [URL]" | Download + extract subtitles (fallback: Whisper) |
| "summarize / analyze this video [URL]" | Download + subtitles + AI analysis |
| "full pipeline [URL]" | Download + subtitles + AI analysis |
| Non-English video | Download + subtitles, translate in output table |

## Preflight Checklist

Before running any command:
- [ ] A valid YouTube or Instagram URL was provided
- [ ] `yt-dlp` is installed: run `yt-dlp --version` to confirm
- [ ] An output path is chosen (default: `~/Downloads/<video_id>.mp4`)

If `yt-dlp` is missing, install it:
```bash
pip install yt-dlp
```

## Usage Examples

### Download only
```bash
python ~/.claude/skills/social-video-scrapper/scripts/download_and_extract.py \
  --url "https://www.youtube.com/watch?v=EXAMPLE" \
  --output ~/Downloads/video.mp4
```

### Download + transcript (subtitles preferred, Whisper fallback)
```bash
python ~/.claude/skills/social-video-scrapper/scripts/download_and_extract.py \
  --url "https://www.youtube.com/watch?v=EXAMPLE" \
  --output ~/Downloads/video.mp4 \
  --transcribe
```

### Download + transcript + AI analysis (full pipeline)
```bash
python ~/.claude/skills/social-video-scrapper/scripts/download_and_extract.py \
  --url "https://www.youtube.com/watch?v=EXAMPLE" \
  --output ~/Downloads/video.mp4 \
  --transcribe \
  --analyze \
  --prompt "Summarize the video and list the main points."
```

### Force Whisper transcription (offline, no subtitles needed)
```bash
python ~/.claude/skills/social-video-scrapper/scripts/download_and_extract.py \
  --url "https://www.youtube.com/watch?v=EXAMPLE" \
  --output ~/Downloads/video.mp4 \
  --transcribe \
  --whisper
```

You can also invoke `yt-dlp` directly for advanced options:
```bash
yt-dlp -o "~/Downloads/%(title)s.%(ext)s" "VIDEO_URL"
```

## Parameters

| Flag | Required | Description |
|------|----------|-------------|
| `--url` | Yes | YouTube or Instagram URL |
| `--output` | No | Output video file path (default: `~/Downloads/video.mp4`) |
| `--transcribe` | No | Extract transcript (auto-saves cleaned `.txt` alongside video) |
| `--whisper` | No | Force Whisper transcription (ignores subtitles) |
| `--lang` | No | Subtitle language code (default: `en`) |
| `--docx` | No | Also write a polished `.docx` with paragraph breaks (for humans) |
| `--pdf` | No | Also convert to `.pdf` (implies `--docx`; requires MS Word on Windows) |
| `--title` | No | Title for DOCX/PDF (default: `Video Summary`) |

**Outputs** (beside the video file):
- `.txt` — cleaned raw transcript (for agents, small tokens)
- `.docx` — formatted with paragraphs, headings, Calibri font (for humans)
- `.pdf` — same, converted via Word (Windows) or LibreOffice

**Auto-cleanup** is applied to every transcript:
- `clawed` → `Claude`, `Claw Code` → `Claude Code`, `claw.ai` → `claude.ai`
- `muchneeded` → `much-needed`, `MGB` → `MB`, `NodeJS` → `Node.js`
- Whitespace normalized, punctuation spacing fixed

## Output Format

When presenting transcripts, use this table format (add Translation column for non-English):

```markdown
### Transcript
| Timestamp | Original Text | English Translation |
| :--- | :--- | :--- |
| **00:00 - 00:10** | [text] | [translation] |
| **00:10 - 00:25** | [text] | [translation] |
```

For analysis output, present as a structured summary with headers for each section (Summary, Key Points, Quotes).

## Error Handling

### YouTube bot detection
If `yt-dlp` returns "Sign in to confirm you're not a bot":
1. Open YouTube in your browser and sign in
2. Retry the command
3. If still failing, pass cookies from your browser:
   ```bash
   yt-dlp --cookies-from-browser chrome -o OUTPUT_PATH URL
   ```

### No subtitles available
If YouTube has no subtitles for the video, the script automatically falls back to Whisper (local speech-to-text). Install Whisper if not present:
```bash
pip install openai-whisper
```
Or force Whisper explicitly with `--whisper`.

### Instagram private content
Private Instagram reels require authentication. Export cookies from a logged-in browser session and pass them with `--cookies COOKIES_FILE`.
