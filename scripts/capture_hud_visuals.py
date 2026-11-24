"""
scripts/capture_hud_visuals.py
Captures high-resolution screenshots of Neev v2.0 Constructive-inspired Full-Bleed HUD Interface:
1. World Map with BottomDock
2. Area Intelligence Drawer
3. Full-bleed Greenfield Plain-Land Studio (floating obsidian glass HUD drawers)
4. Full-bleed Urban In-Situ Redevelopment Studio (floating 9 levers + Feasibility KPIs)
5. Full-bleed 3D Immersive Massing view with HUD toggled off
"""

import os
import time
from playwright.sync_api import sync_playwright

ARTIFACT_DIR = "/Users/sudhanshu/.gemini/antigravity/brain/a9cbe4a9-8516-464a-80fd-fa648f5624dd"
os.makedirs(ARTIFACT_DIR, exist_ok=True)

def run():
    print("Launching Chromium via Playwright...")
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

        # ── 1. World Map Canvas ──
        print("Navigating to http://localhost:5173/ ...")
        page.goto("http://localhost:5173/", wait_until="domcontentloaded")
        page.wait_for_timeout(3000)

        path_map = os.path.join(ARTIFACT_DIR, "screenshot-hud-01-world-map.png")
        page.screenshot(path=path_map)
        print(f"Captured: {path_map}")

        # ── 2. Click preset to trigger Area Intelligence Drawer ──
        print("Clicking 'Delhi Old Town' preset on map...")
        try:
            page.locator("button:has-text('Delhi Old Town')").first.click()
            page.wait_for_timeout(2500)
        except Exception as e:
            print("Preset click note:", e)

        path_intel = os.path.join(ARTIFACT_DIR, "screenshot-hud-02-area-intel.png")
        page.screenshot(path=path_intel)
        print(f"Captured: {path_intel}")

        # ── 3. Switch to Plain Land Studio ──
        print("Switching to Plain Land Construction Studio...")
        try:
            page.locator("button:has-text('Plain Land Studio'), button:has-text('रिक्त भूमि स्टूडियो')").first.click()
            page.wait_for_timeout(3500)
        except Exception as e:
            print("Plain land switch note:", e)

        path_plain = os.path.join(ARTIFACT_DIR, "screenshot-hud-03-plain-land-studio.png")
        page.screenshot(path=path_plain)
        print(f"Captured: {path_plain}")

        # ── 4. Switch to Urban Studio ──
        print("Switching to Urban Redevelopment Studio...")
        try:
            page.locator("button:has-text('Urban Studio'), button:has-text('शहरी स्टूडियो')").first.click()
            page.wait_for_timeout(2000)
            # Select preset if on site tab
            preset_btn = page.locator("button:has-text('Tier-2 Market'), button:has-text('मार्केट')").first
            if preset_btn.is_visible():
                preset_btn.click()
                page.wait_for_timeout(2500)
        except Exception as e:
            print("Urban studio switch note:", e)

        path_urban = os.path.join(ARTIFACT_DIR, "screenshot-hud-04-urban-studio.png")
        page.screenshot(path=path_urban)
        print(f"Captured: {path_urban}")

        # ── 5. Full-bleed 3D with HUD hidden ──
        print("Toggling HUD off for full-bleed 3D massing view...")
        try:
            # Click the eye/toggle HUD button in BottomDock
            hud_btn = page.locator("button[title*='Hide HUD']").first
            if hud_btn.is_visible():
                hud_btn.click()
                page.wait_for_timeout(1500)
        except Exception as e:
            print("HUD toggle note:", e)

        path_clean = os.path.join(ARTIFACT_DIR, "screenshot-hud-05-full-bleed-3d.png")
        page.screenshot(path=path_clean)
        print(f"Captured: {path_clean}")

        browser.close()
        print("All visual captures complete!")

if __name__ == "__main__":
    run()
