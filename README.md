# Malay Restaurant & Malay Fast Foods (Pvt) Ltd

> **Authentic Sri Lankan Malay Cuisine & Multi-Brand Hospitality Group**  
> Dehiwala, Sri Lanka • Established 1994 (Heritage dating to 1981 via *Rasa Sayang* Bambalapitiya) • 100% Halal Certified

[![Website Status](https://img.shields.io/badge/Website-Live_Ready-brightgreen)](http://localhost:3000)
[![Dishes Catalogued](https://img.shields.io/badge/Verified_Dishes-627-orange)](data/menu.json)
[![Halal Certified](https://img.shields.io/badge/Halal-100%25_Certified-green)](#)
[![Hill Street Cluster](https://img.shields.io/badge/Locations-Dehiwala_Hub-blue)](#)

---

## 📖 About the Group

**Malay Fast Foods (Pvt) Ltd** is one of Sri Lanka’s most renowned culinary groups, tracing its heritage to the legendary *Rasa Sayang* restaurant in Bambalapitiya (1981). In 1994, the flagship **Malay Restaurant** opened at **115 Hill Street, Dehiwala**, becoming a landmark for authentic Sri Lankan Malay beef specials, offal delicacies (babath & spleen curries), banana-leaf lamprais, and handcrafted mojitos.

Today, the group operates an integrated multi-concept dining hub spanning Hill Street in Dehiwala:
1. **Malay Restaurant** (115 Hill Street) — Flagship authentic Sri Lankan Malay & multi-cuisine (311 dishes).
2. **Café Asiana** (97 Hill Street) — Contemporary Asian & Indian fusion, Hyderabadi Dum Biryani, and tandoori grills (170 dishes).
3. **Shanghai Wok** (97 Hill Street) — High-flame wok cooking, hot butter cuttlefish, and Sri Lankan-Chinese stir-fries (29 dishes).
4. **Nelum - The Ceylon Kitchen** (93 Hill Street) — Pure island soul food, earthenware clay-pot rice & curry, and pol pittu (87 dishes).
5. **Pakistan Darbar** (93 Hill Street) — Royal Lahori Mughlai cuisine, Biryani sawans, Arabic kabsa, and tandoor naans (15 dishes).
6. **Darbar Biryani & BBQ** (93 Hill Street) — Charcoal flame BBQ full chickens, pit grills, and fusion dolphin kottu (15 dishes).

---

## 🍽️ Key Features

- **627 Verified Dishes**: Extracted from `MALY_GROUP_XLSX_whole portfolio.xlsx` with accurate LKR prices, categories, and caloric information (`kcal`).
- **Real-Time Menu Explorer**: Search and filter by brand or category with instant feedback.
- **Interactive Order Tray (Cart)**: Add dishes to an interactive drawer with item quantity controls and calculated subtotal.
- **1-Click WhatsApp Ordering**: Auto-formats selected dishes into a structured WhatsApp message sent to **+94 77 777 0363**.
- **Dedicated Brand Pages**: Custom sub-pages for [Café Asiana](brands/cafe-asiana.html), [Shanghai Wok](brands/shanghai-wok.html), [Nelum](brands/nelum.html), [Pakistan Darbar](brands/pakistan-darbar.html), and [Darbar Biryani & BBQ](brands/darbar-bbq.html).
- **Hill Street Locations Hub**: Interactive location profiles, operating hours, direct hotlines, and Google Maps links.
- **Catering & Sawan Booking**: WhatsApp-linked catering inquiry form for weddings, family gatherings, and bulk sawans.

---

## 🚀 How to Run Locally

Start a local HTTP server:
```bash
python -m http.server 3000
```
Open your browser and navigate to:
```
http://localhost:3000/
```

---

## 📁 Repository Structure

```
Malay Restaurant gravity/
├── index.html                   # Main restaurant group portal
├── css/
│   └── styles.css               # Core design system & responsive stylesheet
├── js/
│   └── main.js                  # Menu filtering, search, cart & WhatsApp logic
├── data/
│   ├── brands.json              # Verified brand profiles & metadata
│   └── menu.json                # Complete 627 verified items dataset
├── brands/                      # Dedicated individual brand experiences
│   ├── cafe-asiana.html
│   ├── shanghai-wok.html
│   ├── nelum.html
│   ├── pakistan-darbar.html
│   └── darbar-bbq.html
├── assets/
│   ├── logos/                   # Official brand logos
│   └── images/                  # High-resolution culinary photography
└── scripts/
    └── build_data.py            # Excel parsing & data build automation
```

---

## 📞 Contact Information

- **Flagship Hotline**: +94 117 777 999
- **Official WhatsApp**: +94 77 777 0363
- **Email**: appigomalay@gmail.com
- **Locations**: 115, 97 & 93 Hill Street, Dehiwala, Sri Lanka

---
© 2026 Malay Fast Foods (Pvt) Ltd. All Rights Reserved.
