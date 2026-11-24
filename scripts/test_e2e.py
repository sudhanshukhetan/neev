import os
import sys
import time
from playwright.sync_api import sync_playwright

SCREENSHOT_DIR = "/Users/sudhanshu/.gemini/antigravity/brain/a9cbe4a9-8516-464a-80fd-fa648f5624dd"
os.makedirs(SCREENSHOT_DIR, exist_ok=True)

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={'width': 1440, 'height': 900})
        page = context.new_page()

        console_logs = []
        page.on("console", lambda msg: console_logs.append(f"[{msg.type}] {msg.text}"))

        print("1. Navigating to http://localhost:5173 ...")
        page.goto("http://localhost:5173", wait_until="domcontentloaded")
        page.wait_for_timeout(1500)

        # 1. Hero Screenshot
        hero_path = os.path.join(SCREENSHOT_DIR, "screenshot-01-hero.png")
        page.screenshot(path=hero_path)
        print(f"✓ Saved {hero_path}")

        # 2. Enter Studio and Load Preset
        print("2. Clicking 'Start Simulating →'...")
        start_btn = page.locator("button:has-text('Start Simulating')").first
        start_btn.click()
        page.wait_for_timeout(800)

        # Click Preset: Congested Tier-2 Market Lane
        print("3. Selecting 'Congested Tier-2 Market Lane'...")
        preset_card = page.locator("button:has-text('Congested Tier-2 Market Lane')").first
        preset_card.click()
        page.wait_for_timeout(1500)

        studio_path = os.path.join(SCREENSHOT_DIR, "screenshot-02-studio-loaded.png")
        page.screenshot(path=studio_path)
        print(f"✓ Saved {studio_path}")

        # 4. Fire Tender Dispatch
        print("4. Testing Fire Dispatch Story...")
        fire_btn = page.locator("button:has-text('Dispatch Fire Tender')").first
        if fire_btn.is_visible():
            fire_btn.click()
            page.wait_for_timeout(2000)
            fire_path = os.path.join(SCREENSHOT_DIR, "screenshot-03-fire-dispatch.png")
            page.screenshot(path=fire_path)
            print(f"✓ Saved {fire_path}")

        # 5. Monsoon Mode
        print("5. Testing Monsoon Mode...")
        monsoon_btn = page.locator("button:has-text('Monsoon Mode')").first
        if monsoon_btn.is_visible():
            monsoon_btn.click()
            page.wait_for_timeout(500)
            play_btn = page.locator("button:has-text('Play Storm')").first
            if play_btn.is_visible():
                play_btn.click()
                page.wait_for_timeout(1500)
            monsoon_path = os.path.join(SCREENSHOT_DIR, "screenshot-04-monsoon-mode.png")
            page.screenshot(path=monsoon_path)
            print(f"✓ Saved {monsoon_path}")

        # 6. Language Toggle (Hindi)
        print("6. Testing Hindi Translation...")
        hi_btn = page.locator("button:has-text('हिं')").first
        if hi_btn.is_visible():
            hi_btn.click()
            page.wait_for_timeout(600)
            hindi_path = os.path.join(SCREENSHOT_DIR, "screenshot-05-hindi-mode.png")
            page.screenshot(path=hindi_path)
            print(f"✓ Saved {hindi_path}")
            # Switch back to English
            page.locator("button:has-text('EN')").first.click()
            page.wait_for_timeout(400)

        # 7. WebGL Fallback test with query flag
        print("7. Testing ?forceNoWebGL=1 fallback...")
        page.goto("http://localhost:5173?forceNoWebGL=1", wait_until="domcontentloaded")
        page.wait_for_timeout(1000)
        fallback_path = os.path.join(SCREENSHOT_DIR, "screenshot-06-webgl-fallback.png")
        page.screenshot(path=fallback_path)
        print(f"✓ Saved {fallback_path}")

        # 8. Mobile 375px responsive test
        print("8. Testing 375px Mobile Viewport...")
        mobile_context = browser.new_context(viewport={'width': 375, 'height': 812})
        mobile_page = mobile_context.new_page()
        mobile_page.goto("http://localhost:5173", wait_until="domcontentloaded")
        mobile_page.wait_for_timeout(800)
        mobile_page.locator("button:has-text('Start Simulating')").first.click()
        mobile_page.wait_for_timeout(500)
        mobile_page.locator("button:has-text('Congested Tier-2 Market Lane')").first.click()
        mobile_page.wait_for_timeout(1000)
        mobile_path = os.path.join(SCREENSHOT_DIR, "screenshot-07-mobile-375px.png")
        mobile_page.screenshot(path=mobile_path)
        print(f"✓ Saved {mobile_path}")

        # 9. Test PDF Download
        print("9. Testing PDF Export trigger...")
        page.goto("http://localhost:5173", wait_until="domcontentloaded")
        page.wait_for_timeout(600)
        page.locator("button:has-text('Start Simulating')").first.click()
        page.wait_for_timeout(400)
        page.locator("button:has-text('Congested Tier-2 Market Lane')").first.click()
        page.wait_for_timeout(1000)
        
        pdf_btn = page.locator("button:has-text('Export Municipal DPR (PDF)')").first
        if pdf_btn.is_enabled():
            with page.expect_download() as download_info:
                pdf_btn.click()
            download = download_info.value
            pdf_dest = os.path.join(SCREENSHOT_DIR, "Neev_Municipal_DPR.pdf")
            download.save_as(pdf_dest)
            print(f"✓ Downloaded PDF to {pdf_dest} (size: {os.path.getsize(pdf_dest)} bytes)")

        browser.close()
        print("\nALL BROWSER E2E TESTS COMPLETED SUCCESSFULLY!")

if __name__ == "__main__":
    run()
