#!/usr/bin/env python3
"""
Procesa las decoraciones de public/decorations/ y genera stickers listos para la web.

Para cada imagen de las carpetas de categoría (flowers, animal-crossing, anime, objects, misc):
  1. Inspecciona formato, dimensiones, proporción y transparencia.
  2. Si ya tiene transparencia → la recorta a su contenido y la optimiza.
  3. Si tiene un fondo uniforme (blanco, negro o de un color liso) → elimina SOLO el fondo
     conectado con los bordes (el blanco de los ojos, por ejemplo, se conserva), suaviza el
     borde y elimina el halo del color de fondo.
  4. Si el fondo no es uniforme (una foto, un degradado) → NO lo recorta: guarda una copia
     optimizada marcada como «card» para mostrarla como una pequeña tarjeta de papel.
  5. Opcionalmente añade un borde blanco tipo sticker troquelado (personajes y objetos).

Los originales nunca se modifican. Los resultados van a public/decorations/processed/ en WebP
con transparencia, sin deformar la imagen (escalado proporcional, lado mayor ≤ --max px).

Además escribe:
  - src/data/decorations.manifest.json  (dimensiones de cada sticker, usado por la web)
  - docs/decorations-report.md           (informe de lo detectado y procesado)

Requisitos: Python 3 con Pillow y numpy (no necesita servicios externos).
Uso:  npm run decorations     (o)     python3 scripts/process-decorations.py
"""

from __future__ import annotations

import argparse
import json
import sys
from dataclasses import asdict, dataclass, field
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageOps

CATEGORIES = {
    "flowers": "flower",
    "animal-crossing": "animal-crossing",
    "anime": "anime",
    "objects": "object",
    "misc": "misc",
}
# Categorías que reciben borde blanco de sticker troquelado.
OUTLINE_CATEGORIES = {"animal-crossing", "anime", "object", "misc"}
EXTENSIONS = {".png", ".webp", ".jpg", ".jpeg", ".gif", ".bmp", ".avif"}


@dataclass
class Result:
    id: str
    category: str
    source: str
    format: str
    original_width: int
    original_height: int
    ratio: str
    had_alpha: bool
    background: str  # transparent | uniform | complex
    kind: str  # cutout | card
    processed: bool
    src: str = ""
    width: int = 0
    height: int = 0
    outline: bool = False
    notes: list[str] = field(default_factory=list)


def slugify(name: str) -> str:
    out = []
    for ch in name.lower():
        if ch.isalnum():
            out.append(ch)
        elif ch in " -_.":
            out.append("-")
    slug = "-".join(filter(None, "".join(out).split("-")))
    return slug or "sticker"


def ratio_label(w: int, h: int) -> str:
    from math import gcd

    g = gcd(w, h)
    a, b = w // g, h // g
    if a > 50 or b > 50:
        return f"{w / h:.2f}:1"
    return f"{a}:{b}"


def border_pixels(arr: np.ndarray, width: int = 3) -> np.ndarray:
    top = arr[:width].reshape(-1, arr.shape[2])
    bottom = arr[-width:].reshape(-1, arr.shape[2])
    left = arr[:, :width].reshape(-1, arr.shape[2])
    right = arr[:, -width:].reshape(-1, arr.shape[2])
    return np.concatenate([top, bottom, left, right])


def analyse_background(rgba: np.ndarray) -> tuple[str, np.ndarray | None, float]:
    """Devuelve (tipo, color_de_fondo, proporción_de_borde_uniforme)."""
    border = border_pixels(rgba)
    alpha = border[:, 3]
    if np.mean(alpha < 24) > 0.6:
        return "transparent", None, 1.0
    opaque = border[alpha > 200][:, :3].astype(np.float32)
    if len(opaque) == 0:
        return "transparent", None, 1.0
    bg = np.median(opaque, axis=0)
    dist = np.linalg.norm(opaque - bg, axis=1)
    uniform = float(np.mean(dist < 30))
    if uniform >= 0.88:
        return "uniform", bg, uniform
    return "complex", None, uniform


def remove_uniform_background(img: Image.Image, bg: np.ndarray, tol: float = 34.0) -> tuple[Image.Image, float]:
    """Elimina el fondo conectado a los bordes. Devuelve (imagen RGBA, fracción eliminada)."""
    rgba = np.asarray(img.convert("RGBA")).astype(np.float32)
    rgb = rgba[..., :3]
    h, w = rgb.shape[:2]
    dist = np.linalg.norm(rgb - bg, axis=2)

    # Píxeles «parecidos al fondo»; se rellenan solo los conectados con el borde.
    close = (dist < tol).astype(np.uint8) * 255
    padded = Image.new("L", (w + 2, h + 2), 255)
    padded.paste(Image.fromarray(close, "L"), (1, 1))
    ImageDraw.floodfill(padded, (0, 0), 128, thresh=0)
    region = np.asarray(padded)[1:-1, 1:-1] == 128  # True = fondo

    alpha = np.where(region, 0.0, 255.0)

    # Borde suave: anillo de 2 px alrededor del fondo con alfa según la distancia de color.
    region_img = Image.fromarray((region * 255).astype(np.uint8), "L")
    ring = np.asarray(region_img.filter(ImageFilter.MaxFilter(5))) > 0
    ring &= ~region
    # «Color a alfa» (como en GIMP): opacidad mínima que explica el color observado
    # como mezcla del color del primer plano con el del fondo.
    headroom = np.where(rgb > bg, 255.0 - bg, bg)
    per_channel = np.abs(rgb - bg) / np.maximum(headroom, 1.0)
    soft = np.clip(per_channel.max(axis=2), 0.0, 1.0) * 255.0
    alpha = np.where(ring, soft, alpha)

    # Descontaminación: quita el tinte del color de fondo en los bordes semitransparentes.
    a = (alpha / 255.0)[..., None]
    safe_a = np.maximum(a, 1e-3)
    unmixed = (rgb - (1.0 - a) * bg) / safe_a
    rgb_out = np.where((a > 0) & (a < 1), np.clip(unmixed, 0, 255), rgb)

    out = np.dstack([rgb_out, alpha]).astype(np.uint8)
    removed = float(np.mean(region))
    return Image.fromarray(out, "RGBA"), removed


def trim(img: Image.Image, pad_ratio: float = 0.02) -> Image.Image:
    alpha = img.getchannel("A").point(lambda v: 255 if v > 8 else 0)
    box = alpha.getbbox()
    if not box:
        return img
    pad = max(2, int(max(img.size) * pad_ratio))
    l, t, r, b = box
    return img.crop((max(0, l - pad), max(0, t - pad), min(img.width, r + pad), min(img.height, b + pad)))


def add_outline(img: Image.Image, thickness: int) -> Image.Image:
    """Borde blanco redondeado tipo sticker troquelado."""
    pad = thickness + 4
    canvas = Image.new("RGBA", (img.width + pad * 2, img.height + pad * 2), (0, 0, 0, 0))
    canvas.paste(img, (pad, pad), img)
    alpha = canvas.getchannel("A")
    # Dilatación redondeada: desenfoque + umbral, y un leve suavizado para el antialias.
    grown = alpha.filter(ImageFilter.GaussianBlur(thickness * 0.6)).point(lambda v: 255 if v > 20 else 0)
    grown = grown.filter(ImageFilter.GaussianBlur(0.7))
    white = Image.new("RGBA", canvas.size, (255, 253, 248, 255))
    white.putalpha(grown)
    return Image.alpha_composite(white, canvas)


def fit(img: Image.Image, max_side: int) -> Image.Image:
    if max(img.size) <= max_side:
        return img
    scale = max_side / max(img.size)
    return img.resize((max(1, round(img.width * scale)), max(1, round(img.height * scale))), Image.LANCZOS)


def process(path: Path, category: str, out_dir: Path, public_dir: Path, max_side: int, outline: bool) -> Result:
    img = Image.open(path)
    fmt = (img.format or path.suffix[1:]).upper()
    img = ImageOps.exif_transpose(img)
    if getattr(img, "is_animated", False):
        img.seek(0)
    rgba = img.convert("RGBA")
    had_alpha = int(np.asarray(rgba.getchannel("A")).min()) < 250
    w, h = rgba.size

    slug = f"{slugify(category)}-{slugify(path.stem)}"
    res = Result(
        id=slug,
        category=category,
        source=str(path.relative_to(public_dir.parent)),
        format=fmt,
        original_width=w,
        original_height=h,
        ratio=ratio_label(w, h),
        had_alpha=had_alpha,
        background="",
        kind="cutout",
        processed=False,
    )

    # Trabaja a un tamaño razonable (≈2× el tamaño final) para que el recorte sea rápido.
    work = fit(rgba, max_side * 2)
    kind, bg, uniform = analyse_background(np.asarray(work))
    res.background = kind

    if kind == "transparent":
        result = trim(work)
        res.notes.append("Ya tenía transparencia: solo se recortó el margen vacío y se optimizó.")
    elif kind == "uniform":
        cut, removed = remove_uniform_background(work, bg)
        if removed < 0.03 or removed > 0.97:
            res.kind = "card"
            result = work
            res.notes.append(
                f"Fondo uniforme detectado, pero el recorte no es fiable ({removed:.0%} eliminado): se conserva el fondo."
            )
        else:
            result = trim(cut)
            res.processed = True
            color = "#%02x%02x%02x" % tuple(int(c) for c in bg)
            res.notes.append(f"Fondo {color} eliminado ({removed:.0%} de la imagen).")
    else:
        res.kind = "card"
        result = work
        res.notes.append(
            f"Fondo no uniforme ({uniform:.0%} del borde similar): no se recorta para no dañar la imagen; "
            "se mostrará como tarjeta de papel."
        )

    result = fit(result, max_side)
    if outline and res.kind == "cutout" and category in OUTLINE_CATEGORIES:
        result = add_outline(result, max(4, round(max(result.size) * 0.025)))
        res.outline = True

    out_dir.mkdir(parents=True, exist_ok=True)
    out_path = out_dir / f"{slug}.webp"
    if res.kind == "card":
        result.convert("RGB").save(out_path, "WEBP", quality=82, method=6)
    else:
        result.save(out_path, "WEBP", quality=88, method=6, exact=False)
    res.src = "/" + str(out_path.relative_to(public_dir)).replace("\\", "/")
    res.width, res.height = result.size
    return res


def write_report(results: list[Result], skipped: list[tuple[str, str]], path: Path) -> None:
    lines = ["# Informe de decoraciones", "", "Generado por `scripts/process-decorations.py`.", ""]
    if not results and not skipped:
        lines.append("No se encontraron imágenes en `public/decorations/<categoría>/`.")
    if results:
        lines += [
            "| Archivo | Formato | Original | Proporción | Transparencia | Fondo | Resultado | Salida |",
            "|---|---|---|---|---|---|---|---|",
        ]
        for r in results:
            status = "recortada" if r.processed else ("tarjeta (sin recortar)" if r.kind == "card" else "optimizada")
            if r.outline:
                status += " + borde sticker"
            lines.append(
                f"| `{r.source}` | {r.format} | {r.original_width}×{r.original_height} | {r.ratio} | "
                f"{'sí' if r.had_alpha else 'no'} | {r.background} | {status} | `{r.src}` ({r.width}×{r.height}) |"
            )
        lines += ["", "## Notas", ""]
        for r in results:
            for n in r.notes:
                lines.append(f"- `{r.source}`: {n}")
    if skipped:
        lines += ["", "## No procesadas", ""]
        for name, why in skipped:
            lines.append(f"- `{name}`: {why}")
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text("\n".join(lines) + "\n", encoding="utf-8")


def main() -> int:
    root = Path(__file__).resolve().parent.parent
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    p.add_argument("--src", type=Path, default=root / "public" / "decorations")
    p.add_argument("--out", type=Path, default=None, help="por defecto <src>/processed")
    p.add_argument("--manifest", type=Path, default=root / "src" / "data" / "decorations.manifest.json")
    p.add_argument("--report", type=Path, default=root / "docs" / "decorations-report.md")
    p.add_argument("--max", type=int, default=520, help="lado mayor máximo en píxeles")
    p.add_argument("--no-outline", action="store_true", help="no añadir borde blanco de sticker")
    args = p.parse_args()

    src: Path = args.src.resolve()
    out: Path = (args.out or src / "processed").resolve()
    public_dir = src.parent  # rutas web relativas a public/

    results: list[Result] = []
    skipped: list[tuple[str, str]] = []
    for folder, category in CATEGORIES.items():
        d = src / folder
        if not d.is_dir():
            continue
        for f in sorted(d.iterdir()):
            if f.name.startswith(".") or not f.is_file():
                continue
            if f.suffix.lower() not in EXTENSIONS:
                skipped.append((f"{folder}/{f.name}", "formato no compatible"))
                continue
            try:
                r = process(f, category, out, public_dir, args.max, not args.no_outline)
                results.append(r)
                print(f"✓ {folder}/{f.name}: {r.background} → {r.kind} {r.width}×{r.height}")
            except Exception as e:  # noqa: BLE001 - se informa y se continúa
                skipped.append((f"{folder}/{f.name}", f"error al procesar: {e}"))
                print(f"✗ {folder}/{f.name}: {e}", file=sys.stderr)

    manifest = [
        {k: v for k, v in asdict(r).items() if k in ("id", "category", "src", "width", "height", "kind", "source")}
        for r in results
    ]
    args.manifest.parent.mkdir(parents=True, exist_ok=True)
    args.manifest.write_text(json.dumps(manifest, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    write_report(results, skipped, args.report)
    print(f"\n{len(results)} procesadas, {len(skipped)} omitidas.")
    print(f"Manifiesto: {args.manifest}\nInforme:    {args.report}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
