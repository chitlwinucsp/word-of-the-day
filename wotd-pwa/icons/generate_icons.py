#!/usr/bin/env python3
from PIL import Image, ImageDraw, ImageFont
import os

sizes = [72, 96, 128, 144, 152, 192, 384, 512]

for size in sizes:
    img = Image.new("RGB", (size, size), color="#1a5e35")
    draw = ImageDraw.Draw(img)
    
    # Draw rounded background feel with a letter
    margin = size // 8
    draw.rectangle([margin, margin, size - margin, size - margin], fill="#2e7d32", outline="#43a047", width=max(1, size//48))
    
    # Draw "W" text centered
    font_size = size // 2
    try:
        font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSerif-Bold.ttf", font_size)
    except:
        font = ImageFont.load_default()
    
    text = "W"
    bbox = draw.textbbox((0, 0), text, font=font)
    text_width = bbox[2] - bbox[0]
    text_height = bbox[3] - bbox[1]
    x = (size - text_width) // 2
    y = (size - text_height) // 2 - bbox[1]
    draw.text((x, y), text, fill="#ffffff", font=font)
    
    img.save(f"/home/claude/wotd-pwa/icons/icon-{size}x{size}.png")
    print(f"Generated icon-{size}x{size}.png")

print("All icons generated!")
