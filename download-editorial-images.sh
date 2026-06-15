#!/usr/bin/env bash
# =============================================================================
# TMBC Academy — Editorial Image Downloader
# =============================================================================
# Usage:
#   cd /Users/taylorvanderwolk/Desktop/code/registrywithtaylor
#   chmod +x download-editorial-images.sh
#   ./download-editorial-images.sh
#
# All Pexels images are free for commercial use (Pexels License).
# All Unsplash images are free for commercial use (Unsplash License).
# No attribution required, but appreciated.
# =============================================================================

set -uo pipefail

DEST="$(cd "$(dirname "$0")" && pwd)/public/assets/editorial"
mkdir -p "$DEST"

PASS=0
FAIL=0

pexels() {
  local id="$1" filename="$2" desc="$3"
  local url="https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=1280&q=80"
  if curl -sLf --max-time 30 "$url" -o "${DEST}/${filename}"; then
    echo "  ✓  ${filename}"
    echo "     pexels.com/photo/${id} — ${desc}"
    PASS=$((PASS + 1))
  else
    echo "  ✗  ${filename}  FAILED"
    echo "     Manually download: https://www.pexels.com/photo/${id}/"
    echo "     Save to: ${DEST}/${filename}"
    FAIL=$((FAIL + 1))
  fi
  echo ""
}

unsplash() {
  local id="$1" filename="$2" desc="$3"
  local url="https://unsplash.com/photos/${id}/download?force=true"
  if curl -sLf --max-time 30 "$url" -o "${DEST}/${filename}"; then
    echo "  ✓  ${filename}"
    echo "     unsplash.com/photos/${id} — ${desc}"
    PASS=$((PASS + 1))
  else
    echo "  ✗  ${filename}  FAILED"
    echo "     Manually download: https://unsplash.com/photos/${id}"
    echo "     Save to: ${DEST}/${filename}"
    FAIL=$((FAIL + 1))
  fi
  echo ""
}

echo ""
echo "╔══════════════════════════════════════════════════════════════════╗"
echo "║         TMBC Academy — Editorial Image Downloader               ║"
echo "╚══════════════════════════════════════════════════════════════════╝"
echo "  Destination: ${DEST}"
echo ""

# ── POSTPARTUM PATH ──────────────────────────────────────────────────────────
echo "── Postpartum Path ─────────────────────────────────────────────────"
echo ""

pexels  6392902      "teddy-glow.png"      "Mother resting with sleeping baby, warm bedroom glow"
pexels  4713256      "babyroom.png"        "White wooden crib near white wall, clean minimal nursery"
unsplash 22TQ6nsH2vA "babyincrib.png"      "Baby in green onesie lying in white and brown crib"
unsplash bKSMXbqGN24 "notebook-bunny.png"  "Woman writing in notebook with coffee — journaling lifestyle"
pexels  4262005      "bear-blocks.png"     "People gathered around a table — community/connection"
pexels  3321416      "bunny-gift.png"      "Skincare products and candle flat lay — self-care routine"

# ── GEAR PATH ────────────────────────────────────────────────────────────────
echo "── Gear Path ───────────────────────────────────────────────────────"
echo ""

pexels  6393240      "stroller-folds.jpg"  "Baby in stroller outdoors (best available — no fold-demo found as free stock)"
pexels  11477553     "editorialstroller.png" "Couple walking with stroller on Oslo street, sunlit"
pexels  7669135      "fullsize.png"         "Man and woman walking at park with child — full-size stroller lifestyle"
pexels  110817       "strollers.png"        "Two mothers walking with strollers on graffiti-lined Berlin bridge"
pexels  4004226      "organize.png"         "Flat lay of travel bags and accessory pouches on wooden floor"
pexels  8293635      "clipboard.png"        "Checklist on clipboard — home inspection / research style"
pexels  25785858     "welcome.png"          "Happy parents playing with baby indoors, warm + bright"

# ── MANUAL DOWNLOADS NEEDED ──────────────────────────────────────────────────
echo "── Manual Downloads Required ───────────────────────────────────────"
echo ""
echo "  ⚠  gear.jpg"
echo "     No suitable free-stock baby gear flat-lay or lifestyle shot found."
echo "     Best options:"
echo "       • Ask your brand partners (Nuna, Ergobaby, Colugo) for a press kit image"
echo "       • Search Pexels: https://www.pexels.com/search/baby+stroller+carrier+bag/"
echo "       • Or use an Unsplash search: https://unsplash.com/s/photos/baby-gear"
echo "     Save to: ${DEST}/gear.jpg"
echo ""
echo "  ⚠  ipadblueprint.png"
echo "     No free-stock car seat installation / LATCH demo photo found."
echo "     Best options:"
echo "       • Ask Nuna, Chicco, Cybex, or Doona for press photography"
echo "       • Search Pexels: https://www.pexels.com/search/baby+car+seat+vehicle/"
echo "       • Or use an Unsplash search: https://unsplash.com/s/photos/car-seat-baby"
echo "     Save to: ${DEST}/ipadblueprint.png"
echo ""

# ── SUMMARY ──────────────────────────────────────────────────────────────────
echo "────────────────────────────────────────────────────────────────────"
echo ""
TOTAL=$((PASS + FAIL))
echo "  ${PASS}/${TOTAL} automated downloads completed"
echo "  2/15 require manual sourcing (see above)"
echo ""
if [ "$FAIL" -gt 0 ]; then
  echo "  ${FAIL} automated download(s) failed — see individual error messages above."
  echo ""
fi
echo "  Images saved to:"
echo "  ${DEST}/"
echo ""
