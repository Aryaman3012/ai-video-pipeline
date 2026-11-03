# Sourced by render/stills scripts. Remotion's bundled headless shell crashes on some Macs;
# prefer REMOTION_CHROME, else a Puppeteer chrome-headless-shell if one is installed.
if [ -z "${REMOTION_CHROME:-}" ]; then
  REMOTION_CHROME=$(ls -d "$HOME"/.cache/puppeteer/chrome-headless-shell/*/chrome-headless-shell-*/chrome-headless-shell 2>/dev/null | tail -1 || true)
fi
BROWSER_ARGS=()
[ -n "${REMOTION_CHROME:-}" ] && BROWSER_ARGS=(--browser-executable="$REMOTION_CHROME")
