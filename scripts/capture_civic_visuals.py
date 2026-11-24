"""
scripts/capture_civic_visuals.py
Captures screenshots of the Constructive Civic aesthetic in Neev:
1. City Discovery Map with Legend & Instruction Pill
2. Site Observation Drawer (Fails/Meets chips + Lime "Open 3D study →")
3. 3D Street Study View (State/Scenario card, 5 Metric Bars with gradients, Screening Checks, Lime PDF button)
"""

import os
from playwright.sync_api import sync_playwright

ARTIFACT_DIR = "/Users/sudhanshu/.gemini/antigravity/brain/a9cbe4a9-8516-464a-80fd-fa648f5624dd"
os.makedirs(ARTIFACT_DIR, exist_ok=True)

def run():
    print("Launching Chromium...")
    with sync_playwright() as p:
        browser = p.chromium.launch(
            headless=True,
            args=[
                "--no-sandbox",
                "--disable-setuid-sandbox",
                "--disable-web-security",
                "--use-gl=swiftshader",
            ]
        )

        context = browser.new_context(
            viewport={"width": 1440, "height": 900},
            device_scale_factor=1.5,
        )

        page = context.new_page()

        # ── 1. City Discovery Map ──
        print("1. Capturing City Map with Constructive Legend & Instruction Pill...")
        page.goto("http://localhost:5173/", wait_until="domcontentloaded")
        page.wait_for_timeout(3000)

        path_map = os.path.join(ARTIFACT_DIR, "screenshot-civic-01-city-map.png")
        page.screenshot(path=path_map)
        print(f"Captured: {path_map}")

        # ── 2. Click location to show Site Observations drawer ──
        print("2. Clicking 'Delhi Old Town' to trigger Site Observations drawer...")
        try:
            page.locator("button:has-text('Delhi Old Town')").first.click()
            page.wait_for_timeout(2500)
        except Exception as e:
            print("Click note:", e)

        path_obs = os.path.join(ARTIFACT_DIR, "screenshot-civic-02-site-observation.png")
        page.screenshot(path=path_obs)
        print(f"Captured: {path_obs}")

        # ── 3. Click 'Open 3D study →' ──
        print("3. Clicking 'Open 3D study →' button...")
        try:
            btn = page.locator("button:has-text('Open 3D study')").first
            btn.click()
            page.wait_for_timeout(3500)
        except Exception as e:
            print("Open 3D study note:", e)

        path_3d = os.path.join(ARTIFACT_DIR, "screenshot-civic-03-3d-study-hud.png")
        page.screenshot(path=path_3d)
        print(f"Captured: {path_3d}")

        browser.close()
        print("Civic visual captures completed successfully!")

if __name__ == "__main__":
    run()
