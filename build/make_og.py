"""Generate assets/img/og.png (1200x630) — run at build; needs Pillow."""
import os
def make(out):
    try:
        from PIL import Image, ImageDraw, ImageFont
    except ImportError:
        return False
    img = Image.new("RGB", (1200, 630), "#0b1f3a"); d = ImageDraw.Draw(img)
    d.rectangle([0, 0, 1200, 14], fill="#f2801e"); d.rectangle([0, 616, 1200, 630], fill="#1a8a4a")
    try:
        f1 = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 92); f2 = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 36)
    except Exception:
        f1 = f2 = ImageFont.load_default()
    x = 80; d.text((x, 220), "Defence", font=f1, fill="white"); x += d.textlength("Defence", font=f1)
    d.text((x, 220), "India", font=f1, fill="#ffa24a"); x += d.textlength("India", font=f1); d.text((x, 220), ".com", font=f1, fill="white")
    d.text((84, 340), "News · Careers · Equipment · Industry — India's Defence Hub", font=f2, fill="#c8d3e8")
    os.makedirs(os.path.dirname(out), exist_ok=True); img.save(out, optimize=True); return True
if __name__ == "__main__":
    import sys; print(make(sys.argv[1] if len(sys.argv) > 1 else "assets/img/og.png"))
