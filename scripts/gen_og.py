"""產生分享圖 public/og/<id>.png 與 default.png（1200x630）。
用法：python3 scripts/gen_og.py   （需要 Pillow、macOS 的 STHeiti 字型；改 data/apps.json 後重跑）"""
import json, os, textwrap
from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FONT = "/System/Library/Fonts/STHeiti Medium.ttc"
INK, SALMON, SOFT = (23, 24, 26), (196, 68, 47), (244, 244, 242)
W, H = 1200, 630
os.makedirs(f"{ROOT}/public/og", exist_ok=True)
f = lambda n: ImageFont.truetype(FONT, n)

def wrap(draw, text, font, width):
    lines, cur = [], ""
    for ch in text:
        if draw.textlength(cur + ch, font=font) > width:
            lines.append(cur); cur = ch
        else:
            cur += ch
    return lines + [cur]

def make(name, meta, tagline, icon, out):
    im = Image.new("RGB", (W, H), "white")
    d = ImageDraw.Draw(im)
    d.rectangle([0, 0, 24, H], fill=SALMON)
    x = 90
    if icon and os.path.exists(icon):
        ic = Image.open(icon).convert("RGBA").resize((220, 220))
        mask = Image.new("L", (220, 220), 0)
        ImageDraw.Draw(mask).rounded_rectangle([0, 0, 220, 220], 50, fill=255)
        im.paste(ic, (x, 120), mask)
        tx = x + 220 + 60
    else:
        tx = x
    d.text((tx, 120), meta, font=f(34), fill=SALMON)
    d.text((tx, 175), name, font=f(96), fill=INK)
    y = 330 if icon else 300
    for line in wrap(d, tagline, f(42), W - tx - 90)[:3]:
        d.text((tx, y), line, font=f(42), fill=(90, 92, 96)); y += 62
    d.rectangle([0, H - 90, W, H], fill=SOFT)
    d.text((x, H - 66), "PTalk 學習地圖", font=f(34), fill=INK)
    im.save(out, optimize=True)

LANG = {"jp": "日文", "en": "英文", "none": "學習輔助"}
for a in json.load(open(f"{ROOT}/data/apps.json", encoding="utf-8")):
    st = a["stages"]
    rng = "多益" if a["language"] == "en" else ("全階段" if not st else st[0] if len(st) == 1 else f"{st[0]}–{st[-1]}")
    make(a["name"], f"{LANG[a['language']]} {rng}", a["tagline"], f"{ROOT}/public/icons/{a['id']}.png", f"{ROOT}/public/og/{a['id']}.png")
make("PTalk 學習地圖", "日文、多益、學習輔助", "台灣團隊開發的語言學習 App 系列，回答一個問題，找到現在該下載哪一款。", None, f"{ROOT}/public/og/default.png")
