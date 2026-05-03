"""
Generate professional IELTS-style chart PNGs for all 7 Task 1 questions.
Then upload them to Supabase question-images bucket and update ielts_library.
"""

import os
import json
import urllib.request
import urllib.parse
import subprocess
import tempfile

import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
import numpy as np

# ── Config ──────────────────────────────────────────────────────────────────
SUPABASE_URL = "https://jryjpjkutwrieneuaoxv.supabase.co"
OUTPUT_DIR = "/tmp/ielts_charts"
os.makedirs(OUTPUT_DIR, exist_ok=True)

# IELTS-style colour palette
COLORS = ["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd", "#8c564b"]
IELTS_STYLE = {
    "font.family": "sans-serif",
    "axes.spines.top": False,
    "axes.spines.right": False,
    "axes.grid": True,
    "grid.alpha": 0.3,
    "axes.labelsize": 11,
    "axes.titlesize": 13,
    "axes.titleweight": "bold",
    "xtick.labelsize": 10,
    "ytick.labelsize": 10,
    "legend.fontsize": 10,
    "figure.dpi": 150,
}
plt.rcParams.update(IELTS_STYLE)


# ── 1. Bar Chart: Further Education in Britain ───────────────────────────────
def chart_further_education():
    periods = ["1970/71", "1980/81", "1990/91"]
    series = {
        "Male full-time":   [1500, 2100, 1800],
        "Female full-time": [800,  1400, 1700],
        "Male part-time":   [2200, 2400, 2600],
        "Female part-time": [700,  1200, 2200],
    }
    x = np.arange(len(periods))
    width = 0.2
    fig, ax = plt.subplots(figsize=(10, 6))
    for i, (label, values) in enumerate(series.items()):
        ax.bar(x + i * width, values, width, label=label, color=COLORS[i])
    ax.set_xticks(x + width * 1.5)
    ax.set_xticklabels(periods)
    ax.set_xlabel("Time Period")
    ax.set_ylabel("Number of students (thousands)")
    ax.set_title("Full-time and Part-time Students in UK Further Education (thousands)")
    ax.legend()
    fig.tight_layout()
    path = f"{OUTPUT_DIR}/further_education.png"
    fig.savefig(path)
    plt.close(fig)
    print(f"✓ {path}")
    return path


# ── 2. Line Graph: Radio and Television Audiences ───────────────────────────
def chart_radio_tv():
    times = ["00:00","06:00","08:00","10:00","12:00","14:00","16:00","18:00","20:00","22:00","24:00"]
    radio = [1, 5, 25, 15, 12, 11, 9, 10, 8, 5, 2]
    tv    = [1, 2,  3,  8, 14, 15, 20, 35, 42, 28, 5]
    x = np.arange(len(times))
    fig, ax = plt.subplots(figsize=(11, 6))
    ax.plot(x, radio, marker="o", color=COLORS[0], label="Radio", linewidth=2.5)
    ax.plot(x, tv,    marker="s", color=COLORS[1], label="Television", linewidth=2.5)
    ax.set_xticks(x)
    ax.set_xticklabels(times, rotation=30, ha="right")
    ax.set_xlabel("Time of Day")
    ax.set_ylabel("Percentage of population (%)")
    ax.set_title("Percentage of UK Population Watching TV or Listening to Radio (1992)")
    ax.set_ylim(0, 50)
    ax.legend()
    fig.tight_layout()
    path = f"{OUTPUT_DIR}/radio_tv.png"
    fig.savefig(path)
    plt.close(fig)
    print(f"✓ {path}")
    return path


# ── 3. Process Diagram: Brick Manufacturing ─────────────────────────────────
def chart_brick_process():
    stages = [
        "1. Clay digging\n(heavy machinery)",
        "2. Sorting on\nmetal grid;\nrolled & cut",
        "3. Mixed with\nsand & water",
        "4. Shaped by\nmould or wire\ncutter",
        "5. Drying oven\n(24–48 hours)",
        "6. Kiln firing\n(200–1,300°C)",
        "7. Cooling chamber\n(24–48 hours)",
        "8. Packaged &\ndelivered",
    ]
    fig, ax = plt.subplots(figsize=(14, 3.5))
    ax.set_xlim(0, len(stages))
    ax.set_ylim(0, 1)
    ax.axis("off")
    ax.set_title("The Process of Brick Manufacturing for the Building Industry",
                 fontsize=13, fontweight="bold", pad=12)

    box_w, box_h = 0.75, 0.55
    for i, stage in enumerate(stages):
        x = i + 0.5
        rect = mpatches.FancyBboxPatch(
            (x - box_w / 2, 0.5 - box_h / 2), box_w, box_h,
            boxstyle="round,pad=0.04",
            facecolor="#d0e8ff", edgecolor="#1f77b4", linewidth=1.5,
        )
        ax.add_patch(rect)
        ax.text(x, 0.5, stage, ha="center", va="center",
                fontsize=7.5, fontweight="normal", wrap=True)
        if i < len(stages) - 1:
            ax.annotate("", xy=(x + box_w / 2 + 0.08, 0.5),
                        xytext=(x + box_w / 2, 0.5),
                        arrowprops=dict(arrowstyle="->", color="#333", lw=1.5))

    fig.tight_layout()
    path = f"{OUTPUT_DIR}/brick_process.png"
    fig.savefig(path)
    plt.close(fig)
    print(f"✓ {path}")
    return path


# ── 4. Line Graph: Elderly Population 1940–2040 ─────────────────────────────
def chart_elderly_population():
    years = [1940, 1960, 1980, 2000, 2020, 2040]
    data = {
        "Japan":  [5, 6, 9, 17, 30, 27],
        "Sweden": [7, 9, 15, 17, 22, 25],
        "USA":    [7, 8, 12, 13, 18, 23],
    }
    pivot = 2000  # historical | projected split
    fig, ax = plt.subplots(figsize=(10, 6))

    x_all = np.array(years)
    for i, (country, vals) in enumerate(data.items()):
        vals = np.array(vals)
        hist_mask = x_all <= pivot
        proj_mask = x_all >= pivot
        ax.plot(x_all[hist_mask], vals[hist_mask], marker="o",
                color=COLORS[i], linewidth=2.5, label=country)
        ax.plot(x_all[proj_mask], vals[proj_mask], marker="o",
                color=COLORS[i], linewidth=2.5, linestyle="--")

    ax.axvline(x=pivot, color="grey", linestyle=":", linewidth=1.2)
    ax.text(pivot + 1, ax.get_ylim()[1] * 0.92, "← historical  |  projected →",
            fontsize=8.5, color="grey")
    ax.set_xticks(years)
    ax.set_xlabel("Year")
    ax.set_ylabel("Percentage of population aged 65+ (%)")
    ax.set_title("Proportion of Population Aged 65 and Over: Japan, Sweden and USA (1940–2040)")
    ax.legend()
    fig.tight_layout()
    path = f"{OUTPUT_DIR}/elderly_population.png"
    fig.savefig(path)
    plt.close(fig)
    print(f"✓ {path}")
    return path


# ── 5. Bar Chart: Electricity Production 1980 vs 2000 ───────────────────────
def chart_electricity():
    sources = ["Coal", "Oil", "Natural Gas", "Hydropower", "Nuclear", "Other"]
    vals_1980 = [53.6, 20.5, 5.5, 12.5, 7.9, 0.0]
    vals_2000 = [28.5,  0.6, 28.5, 20.7, 19.7, 2.0]
    x = np.arange(len(sources))
    width = 0.35
    fig, ax = plt.subplots(figsize=(11, 6))
    ax.bar(x - width / 2, vals_1980, width, label="1980", color=COLORS[0])
    ax.bar(x + width / 2, vals_2000, width, label="2000", color=COLORS[1])
    ax.set_xticks(x)
    ax.set_xticklabels(sources, rotation=15, ha="right")
    ax.set_xlabel("Energy Source")
    ax.set_ylabel("Percentage of total electricity (%)")
    ax.set_title("Electricity Production by Source in Freedonia (% of Total, 1980 vs 2000)")
    ax.legend()
    fig.tight_layout()
    path = f"{OUTPUT_DIR}/electricity.png"
    fig.savefig(path)
    plt.close(fig)
    print(f"✓ {path}")
    return path


# ── 6. Table: Water Consumption by Country ──────────────────────────────────
def chart_water_table():
    countries = ["Brazil", "Canada", "China", "Egypt", "India", "USA"]
    cols = ["Agricultural", "Industrial", "Domestic", "Total"]
    data = [
        [359, 26,  59,  444],
        [94,  544, 163, 801],
        [561, 22,  31,  614],
        [936, 14,  68,  1018],
        [588, 15,  48,  651],
        [697, 512, 266, 1475],
    ]
    fig, ax = plt.subplots(figsize=(10, 4.5))
    ax.axis("off")
    ax.set_title("Water Used Per Person Per Day by Sector (litres, 2000)",
                 fontsize=13, fontweight="bold", pad=12)
    table = ax.table(
        cellText=[[str(v) for v in row] for row in data],
        rowLabels=countries,
        colLabels=cols,
        cellLoc="center",
        loc="center",
    )
    table.auto_set_font_size(False)
    table.set_fontsize(11)
    table.scale(1.4, 2.0)

    # Style header row
    for j in range(len(cols)):
        table[0, j].set_facecolor("#1f77b4")
        table[0, j].set_text_props(color="white", fontweight="bold")
    # Style row labels
    for i, country in enumerate(countries, start=1):
        table[i, -1].set_facecolor("#e8f0fe")
        table[i, -1].set_text_props(fontweight="bold")
        # Highlight Total column
        table[i, len(cols) - 1].set_facecolor("#fff3cd")

    fig.tight_layout()
    path = f"{OUTPUT_DIR}/water_table.png"
    fig.savefig(path, bbox_inches="tight")
    plt.close(fig)
    print(f"✓ {path}")
    return path


# ── 7. Map: Changes to Fonton ───────────────────────────────────────────────
def chart_fonton_map():
    features = [
        ("Small hotel", "Large hotel complex + swimming pool", "replaced"),
        ("Small cluster of shops", "Modern shopping centre", "replaced"),
        ("Open land behind hotel", "Large car park", "new"),
        ("Farmland (north)", "Golf course + tennis courts", "replaced"),
        ("Single road along seafront", "New dual carriageway", "new"),
        ("No cinema", "Cinema added to town centre", "new"),
        ("Beach & fishing harbour (south)", "Unchanged", "unchanged"),
    ]

    fig, ax = plt.subplots(figsize=(12, 5.5))
    ax.axis("off")
    ax.set_title("Changes to the Seaside Resort of Fonton: 1990 to the Present Day",
                 fontsize=13, fontweight="bold", pad=12)

    col_headers = ["Feature (1990)", "Present Day", "Change"]
    col_x = [0.02, 0.48, 0.82]
    col_widths = [0.44, 0.33, 0.17]
    row_h = 0.11
    header_y = 0.93
    palette = {
        "replaced":  "#ffe0b2",
        "new":       "#c8e6c9",
        "unchanged": "#e3f2fd",
    }
    label = {
        "replaced":  "Replaced",
        "new":       "New",
        "unchanged": "Unchanged",
    }

    # Header
    for x, w, hdr in zip(col_x, col_widths, col_headers):
        rect = mpatches.FancyBboxPatch((x, header_y - row_h * 0.85), w, row_h * 0.85,
                                       boxstyle="round,pad=0.01",
                                       facecolor="#1f77b4", edgecolor="none")
        ax.add_patch(rect)
        ax.text(x + w / 2, header_y - row_h * 0.85 / 2, hdr,
                ha="center", va="center", color="white", fontweight="bold", fontsize=9)

    for i, (before, after, change) in enumerate(features):
        y = header_y - (i + 1) * row_h
        row_color = palette[change]
        for x, w, text in zip(col_x, col_widths, [before, after, label[change]]):
            rect = mpatches.FancyBboxPatch((x, y - row_h * 0.85), w, row_h * 0.85,
                                           boxstyle="round,pad=0.01",
                                           facecolor=row_color, edgecolor="#ccc", linewidth=0.5)
            ax.add_patch(rect)
            ax.text(x + w / 2, y - row_h * 0.85 / 2, text,
                    ha="center", va="center", fontsize=8.5, wrap=True)

    # Legend
    patches = [mpatches.Patch(color=c, label=l) for l, c in
               [("Replaced", "#ffe0b2"), ("New", "#c8e6c9"), ("Unchanged", "#e3f2fd")]]
    ax.legend(handles=patches, loc="lower right", framealpha=0.8, fontsize=9)

    fig.tight_layout()
    path = f"{OUTPUT_DIR}/fonton_map.png"
    fig.savefig(path, bbox_inches="tight")
    plt.close(fig)
    print(f"✓ {path}")
    return path


# ── Upload & update DB ───────────────────────────────────────────────────────
CHARTS = [
    ("further_education.png",  "Further Education in Britain by Gender (1970–1990)"),
    ("radio_tv.png",           "Radio and Television Audiences Throughout the Day (1992)"),
    ("brick_process.png",      "The Brick Manufacturing Process"),
    ("elderly_population.png", "Proportion of Population Aged 65 and Over (1940–2040)"),
    ("electricity.png",        "Electricity Production from Different Sources (1980 and 2000)"),
    ("water_table.png",        "Water Consumption by Country (2000)"),
    ("fonton_map.png",         "Changes to Fonton: A Seaside Town (1990 to Present)"),
]


def upload_and_update(service_role_key: str):
    headers_base = {
        "Authorization": f"Bearer {service_role_key}",
        "apikey": service_role_key,
    }
    storage_url = f"{SUPABASE_URL}/storage/v1/object"
    rest_url = f"{SUPABASE_URL}/rest/v1/ielts_library"

    for filename, title in CHARTS:
        path = f"{OUTPUT_DIR}/{filename}"
        if not os.path.exists(path):
            print(f"✗ missing {path}, skipping")
            continue

        # Upload to storage
        storage_path = f"question-images/{filename}"
        upload_url = f"{storage_url}/{storage_path}"
        with open(path, "rb") as f:
            data = f.read()

        req = urllib.request.Request(
            upload_url, data=data, method="POST",
            headers={**headers_base, "Content-Type": "image/png",
                     "x-upsert": "true"},
        )
        try:
            with urllib.request.urlopen(req) as resp:
                resp_body = resp.read()
        except urllib.error.HTTPError as e:
            print(f"✗ upload failed {filename}: {e.code} {e.read()}")
            continue

        public_url = f"{SUPABASE_URL}/storage/v1/object/public/{storage_path}"

        # Update ielts_library
        update_url = f"{rest_url}?title=eq.{urllib.parse.quote(title)}"
        body = json.dumps({"question_image_url": public_url}).encode()
        req2 = urllib.request.Request(
            update_url, data=body, method="PATCH",
            headers={
                **headers_base,
                "Content-Type": "application/json",
                "Prefer": "return=representation",
            },
        )
        try:
            with urllib.request.urlopen(req2) as resp:
                result = json.loads(resp.read())
                if result:
                    print(f"✓ updated DB: {title}")
                else:
                    print(f"⚠ no row matched title: {title}")
        except urllib.error.HTTPError as e:
            print(f"✗ DB update failed {title}: {e.code} {e.read()}")


if __name__ == "__main__":
    import sys

    # Generate all charts
    print("Generating charts...")
    chart_further_education()
    chart_radio_tv()
    chart_brick_process()
    chart_elderly_population()
    chart_electricity()
    chart_water_table()
    chart_fonton_map()

    key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
    if not key:
        print("\nCharts saved to /tmp/ielts_charts/")
        print("Set SUPABASE_SERVICE_ROLE_KEY env var and rerun to upload.")
    else:
        print("\nUploading to Supabase...")
        upload_and_update(key)
        print("Done.")
