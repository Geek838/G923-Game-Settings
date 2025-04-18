import requests
from bs4 import BeautifulSoup
import json
import re

BASE = "https://www.briankoponen.com"
INDEX = BASE + "/simracing.html"

def get_game_urls():
    r = requests.get(INDEX)
    r.raise_for_status()
    bs = BeautifulSoup(r.text, "html.parser")

    # find every link ending with "-settings/" (the per‑game pages)
    urls = set()
    for a in bs.select("a[href*='-logitech-g29-g920-settings']"):
        href = a["href"]
        urls.add(href if href.startswith("http") else BASE + href)
    return list(urls)

def parse_game(url):
    r = requests.get(url)
    r.raise_for_status()
    bs = BeautifulSoup(r.text, "html.parser")

    # derive a clean game title
    h1 = bs.find("h1")
    title = h1.text
    title = re.sub(r"^Best\s+", "", title)
    title = re.sub(r"\s+Settings.*$", "", title)

    out = {"G_HUB_Settings": {}, "In_Game_Settings": {}}

    # --- G HUB Settings (under <h3>G HUB Settings</h3>) ---
    hub_h3 = bs.find("h3", string=re.compile(r"^G HUB Settings$", re.I))
    if hub_h3:
        # grab all text until next <h3>
        text = []
        for sib in hub_h3.find_next_siblings():
            if sib.name == "h3":
                break
            text.append(sib.get_text("\n"))
        lines = "\n".join(text).splitlines()
        for line in lines:
            if "  " in line:
                k, v = line.split("  ", 1)
                k = k.strip(); v = v.strip()
                if k and v:
                    out["G_HUB_Settings"][k] = v

    # --- In‑Game Settings (under the next <h3> that ends with "Settings") ---
    game_h3 = None
    for h3 in bs.find_all("h3"):
        if h3 is not hub_h3 and h3.text.strip().endswith("Settings"):
            game_h3 = h3
            break

    if game_h3:
        # iterate every <h4> under this section as a category
        for h4 in game_h3.find_next_siblings():
            if h4.name == "h3":
                break
            if h4.name != "h4":
                continue

            cat = h4.text.strip()
            out["In_Game_Settings"][cat] = {}

            # collect lines until next h4 or h3
            buf = []
            for sib in h4.find_next_siblings():
                if sib.name in ("h3", "h4"):
                    break
                buf.append(sib.get_text("\n"))
            for line in "\n".join(buf).splitlines():
                if "  " in line:
                    k, v = line.split("  ", 1)
                    k = k.strip(); v = v.strip()
                    if k and v:
                        out["In_Game_Settings"][cat][k] = v

    return title, out

def main():
    games = get_game_urls()
    data = {}
    for url in games:
        title, settings = parse_game(url)
        data[title] = settings
        print(f" • Parsed {title}")
    with open("g29_settings.json", "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    print(f"\nDone. {len(data)} games written → g29_settings.json")

if __name__ == "__main__":
    main()
