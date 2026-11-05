#!/usr/bin/env python3
"""把桌面的 App 影片與截圖同步進官網。

來源：
  ~/Desktop/所有的app 介紹影片/<App 名>/*.mp4
  ~/Desktop/所有的app 截圖/<App 名>/*.png
輸出：
  public/videos/<id>/<n>.mp4      （720 寬、H.264、faststart）
  public/screenshots/<id>/<n>.jpg （640 寬）
  data/videos.json、data/screenshots.json

檔名「1_說明.mp4」「1_說明.png」的「說明」會當成標題／圖說。
用法：python3 scripts/sync_media.py        （只處理有變動的 App）
      python3 scripts/sync_media.py --all  （全部重做）
"""
import json
import shutil
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DESKTOP = Path.home() / "Desktop"
VIDEO_SRC = DESKTOP / "所有的app 介紹影片"
SHOT_SRC = DESKTOP / "所有的app 截圖"

# 資料夾名稱 → apps.json 的 id（大小寫不拘）
FOLDERS = {
    "諧音五十音": "kana5min",
    "壽司轉珠": "sushitower",
    "日日一字": "hitofude",
    "壽司日檢": "sushijp",
    "忍者信鴿": "ninja-pigeon",
    "koko": "koko",
    "披薩多益": "pizzatoeic",
    "公雞超人": "rooster-hero",
}


def title_of(path: Path) -> str:
    stem = path.stem
    if "_" in stem and stem.split("_", 1)[0].isdigit():
        return stem.split("_", 1)[1]
    return ""  # 隨機檔名沒有意義，不當標題


def source_dirs(base: Path):
    if not base.is_dir():
        return {}
    found = {}
    for d in base.iterdir():
        for name, app_id in FOLDERS.items():
            if d.is_dir() and d.name.lower() == name.lower():
                found[app_id] = d
    return found


def newest_mtime(files):
    return max((f.stat().st_mtime for f in files), default=0)


def sync(kind, src_base, pattern, out_dir, out_json, convert, force):
    data_path = ROOT / "data" / out_json
    data = json.loads(data_path.read_text()) if data_path.exists() else {}
    for app_id, d in sorted(source_dirs(src_base).items()):
        files = sorted(d.glob(pattern))
        if not files:
            continue
        dest = ROOT / "public" / out_dir / app_id
        if not force and dest.exists() and newest_mtime(dest.iterdir()) >= newest_mtime(files):
            continue
        shutil.rmtree(dest, ignore_errors=True)
        dest.mkdir(parents=True)
        items = []
        for i, f in enumerate(files, 1):
            out = convert(f, dest, i)
            items.append({"src": f"/{out_dir}/{app_id}/{out.name}", "title": title_of(f)})
        data[app_id] = items
        print(f"{kind} {app_id}: {len(items)}")
    data_path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n")


def video(f, dest, i):
    out = dest / f"{i}.mp4"
    subprocess.run(
        ["ffmpeg", "-v", "error", "-y", "-i", str(f), "-vf", "scale=720:-2",
         "-c:v", "libx264", "-preset", "slow", "-crf", "27", "-pix_fmt", "yuv420p",
         "-c:a", "aac", "-b:a", "64k", "-movflags", "+faststart", str(out)],
        check=True,
    )
    return out


def shot(f, dest, i):
    out = dest / f"{i}.jpg"
    subprocess.run(
        ["sips", "-s", "format", "jpeg", "-s", "formatOptions", "80", "-Z", "1400",
         str(f), "--out", str(out)],
        check=True, capture_output=True,
    )
    subprocess.run(["sips", "--resampleWidth", "640", str(out)], check=True, capture_output=True)
    return out


if __name__ == "__main__":
    force = "--all" in sys.argv
    sync("影片", VIDEO_SRC, "*.mp4", "videos", "videos.json", video, force)
    sync("截圖", SHOT_SRC, "*.png", "screenshots", "screenshots.json", shot, force)
