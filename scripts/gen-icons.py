from PIL import Image

SRC = "assets/logo.jpg"
im = Image.open(SRC).convert("RGB")

w, h = im.size
side = min(w, h)
left = (w - side) // 2
top = (h - side) // 2
square = im.crop((left, top, left + side, top + side))

# Crop tighter to isolate just the leaf mark, excluding the green ring border,
# so it can be recomposed cleanly for Android adaptive icon layers.
ring_margin = int(side * 0.13)
leaf_only = square.crop((ring_margin, ring_margin, side - ring_margin, side - ring_margin))


def make_transparent_leaf(source, threshold=235):
    """Turn near-white background pixels transparent, keep the leaf artwork."""
    rgba = source.convert("RGBA")
    pixels = rgba.load()
    for y in range(rgba.height):
        for x in range(rgba.width):
            r, g, b, a = pixels[x, y]
            if r >= threshold and g >= threshold and b >= threshold:
                pixels[x, y] = (r, g, b, 0)
    return rgba


leaf_transparent = make_transparent_leaf(leaf_only)


def make_icon(size, bg_color, out_path, scale=0.94):
    canvas = Image.new("RGB", (size, size), bg_color)
    logo_size = int(size * scale)
    logo = square.resize((logo_size, logo_size), Image.LANCZOS)
    offset = ((size - logo_size) // 2, (size - logo_size) // 2)
    canvas.paste(logo, offset)
    canvas.save(out_path)


# App icon and web favicon: the logo already has its own circular border, so we
# scale it to nearly fill the canvas on a matching light background.
make_icon(1024, (255, 255, 255), "assets/icon.png")
make_icon(256, (255, 255, 255), "assets/favicon.png")

# Metro web (Expo SDK 57+) serves the browser favicon from public/favicon.ico,
# not from app.json's web.favicon, so we also need an .ico copy there.
icon_sizes = [16, 32, 48, 64]
icon_frames = []
for size in icon_sizes:
    canvas = Image.new("RGB", (size, size), (255, 255, 255))
    logo_size = int(size * 0.94)
    logo = square.resize((logo_size, logo_size), Image.LANCZOS)
    offset = ((size - logo_size) // 2, (size - logo_size) // 2)
    canvas.paste(logo, offset)
    icon_frames.append(canvas)
icon_frames[0].save(
    "public/favicon.ico",
    format="ICO",
    sizes=[(s, s) for s in icon_sizes],
    append_images=icon_frames[1:],
)

# Android adaptive icon: background is a flat brand-soft color, foreground is
# the transparent leaf mark scaled to fit the safe zone (~66% of canvas) so it
# isn't clipped by the circle/squircle mask Android applies at runtime.
size = 1024
bg = Image.new("RGB", (size, size), (232, 247, 239))
bg.save("assets/android-icon-background.png")

fg_canvas = Image.new("RGBA", (size, size), (0, 0, 0, 0))
fg_scale = 0.6
fg_size = int(size * fg_scale)
fg_logo = leaf_transparent.resize((fg_size, fg_size), Image.LANCZOS)
fg_offset = ((size - fg_size) // 2, (size - fg_size) // 2)
fg_canvas.alpha_composite(fg_logo, fg_offset)
fg_canvas.save("assets/android-icon-foreground.png")

# Monochrome layer (Android 13+ themed icons): alpha-only silhouette, filled white
# so the system can tint it to match the user's wallpaper theme.
mono_gray = leaf_only.convert("L")
mono_alpha = mono_gray.point(lambda p: 255 if p < 235 else 0)
mono_solid = Image.new("RGBA", leaf_only.size, (255, 255, 255, 255))
mono_solid.putalpha(mono_alpha)
mono_canvas = Image.new("RGBA", (size, size), (0, 0, 0, 0))
mono_size = int(size * fg_scale)
mono_resized = mono_solid.resize((mono_size, mono_size), Image.LANCZOS)
mono_offset = ((size - mono_size) // 2, (size - mono_size) // 2)
mono_canvas.alpha_composite(mono_resized, mono_offset)
mono_canvas.save("assets/android-icon-monochrome.png")

print("done")

