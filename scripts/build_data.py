import os, json, shutil
import openpyxl

os.makedirs('data', exist_ok=True)
os.makedirs('assets/logos', exist_ok=True)
os.makedirs('assets/images', exist_ok=True)
os.makedirs('css', exist_ok=True)
os.makedirs('js', exist_ok=True)
os.makedirs('brands', exist_ok=True)

# Copy and rename logos
logos_map = {
    'Logo maly-1.png': 'assets/logos/malay-restaurant.png',
    'new 2.jpeg': 'assets/logos/cafe-asiana.jpg',
    'images.jpg.jpeg': 'assets/logos/shanghai-wok.jpg',
    'new 125.45.jpeg': 'assets/logos/nelum.jpg',
    'PAKISTAN DARBAR-1.png': 'assets/logos/pakistan-darbar.png'
}
for src, dst in logos_map.items():
    if os.path.exists(src):
        shutil.copy2(src, dst)
        print(f"Copied {src} -> {dst}")

wb = openpyxl.load_workbook('MALY_GROUP_XLSX_whole portfolio.xlsx', data_only=True)
brand_map = {
    'Malay Restaurant': 'malay-restaurant',
    'Cafe Asiana': 'cafe-asiana',
    'Shanghai Wok': 'shanghai-wok',
    'Nelum Flower': 'nelum-ceylon-kitchen',
    'Pakistan Darbar': 'pakistan-darbar',
    'Darbar Biryani & BBQ': 'darbar-bbq'
}

all_menu = []
counts = {}

for sheet_name in wb.sheetnames:
    b_id = brand_map.get(sheet_name, sheet_name.lower().replace(' ', '-'))
    sheet = wb[sheet_name]
    rows = list(sheet.iter_rows(values_only=True))
    items_count = 0
    if len(rows) > 1:
        for idx, r in enumerate(rows[1:], start=1):
            if not any(r):
                continue
            item_no = str(r[0]).strip() if r[0] is not None else f"{b_id}-{idx}"
            cat = str(r[1]).strip() if len(r)>1 and r[1] is not None else 'General'
            name = str(r[2]).strip() if len(r)>2 and r[2] is not None else None
            if not name:
                continue
            price_val = r[3] if len(r)>3 else None
            price_display = ''
            price_num = 0
            if price_val is not None:
                try:
                    price_num = float(str(price_val).replace(',', '').strip())
                    price_display = f"{int(price_num):,} LKR"
                except:
                    price_display = str(price_val).strip()
            
            cal_val = r[4] if len(r)>4 and r[4] is not None else None
            cal_display = f"{int(float(cal_val))} kcal" if cal_val and str(cal_val).replace('.','',1).isdigit() else None
            
            all_menu.append({
                'id': f"{b_id}-{item_no}",
                'item_code': item_no,
                'brand_id': b_id,
                'brand_name': sheet_name,
                'category': cat,
                'name': name,
                'price': price_num,
                'price_formatted': price_display if price_display else 'Seasonal / Inquiry',
                'calories': cal_display
            })
            items_count += 1
    counts[sheet_name] = items_count

# Verified items for Pakistan Darbar and Darbar BBQ
pakistan_darbar_items = [
    {'code': 'PD1', 'cat': 'BBQ Specials', 'name': 'Darbar BBQ Feast Platter', 'price': 4800, 'cal': '1250 kcal', 'desc': 'Grand charcoal BBQ platter with tandoori quarter chicken, seekh kebab, chicken tikka, grilled wings, dill mayo, garlic sauce & butter naans'},
    {'code': 'PD2', 'cat': 'BBQ Specials', 'name': 'BBQ Full Chicken Combo', 'price': 3600, 'cal': '1400 kcal', 'desc': 'Whole slow-roasted charcoal chicken infused with Pakistani spices, served with kuboos, garlic paste and fresh salad'},
    {'code': 'PD3', 'cat': 'BBQ Specials', 'name': 'BBQ Quarter Chicken (Leg/Chest)', 'price': 980, 'cal': '450 kcal', 'desc': 'Juicy quarter chicken flame-grilled to perfection with signature Lahori basting'},
    {'code': 'PD4', 'cat': 'Sawans & Biryani', 'name': 'Pakistani Chicken Biryani Sawan (Full - 4-5 Pax)', 'price': 6900, 'cal': '2800 kcal', 'desc': 'Large sharing sawan with fragrant long-grain basmati biryani, BBQ chicken, boiled eggs, cucumber salad, mint raita, garlic sauce & rich gravy'},
    {'code': 'PD5', 'cat': 'Sawans & Biryani', 'name': 'Pakistani Chicken Biryani Sawan (Half - 2-3 Pax)', 'price': 3700, 'cal': '1500 kcal', 'desc': 'Generous sharing sawan with dum biryani, BBQ chicken portions, boiled eggs, raita, salad & gravy'},
    {'code': 'PD6', 'cat': 'Sawans & Biryani', 'name': 'Chicken Kabsa Sawan (Full)', 'price': 6800, 'cal': '2600 kcal', 'desc': 'Traditional Arabic spiced kabsa rice with charcoal BBQ chicken pieces, fried raisins, cashews, raita & daqoos sauce'},
    {'code': 'PD7', 'cat': 'Rice Dishes', 'name': 'Executive Budget Arabic Rice', 'price': 1250, 'cal': '620 kcal', 'desc': 'Savory Arabic spiced long-grain rice served with quarter BBQ chicken and spicy garlic dip'},
    {'code': 'PD8', 'cat': 'Kottu Specials', 'name': 'Dolphin Kottu with BBQ 1/4 Chicken', 'price': 1850, 'cal': '980 kcal', 'desc': 'Square-cut soft paratha tossed with creamy gravy and vegetables, topped with a smokey quarter BBQ chicken'},
    {'code': 'PD9', 'cat': 'Kottu Specials', 'name': 'Chicken Kottu with BBQ 1/4 Chicken', 'price': 1650, 'cal': '920 kcal', 'desc': 'Classic Sri Lankan street kottu served alongside a whole quarter flame-grilled BBQ chicken'},
    {'code': 'PD10', 'cat': 'Curries & Specialties', 'name': 'Pakistani Chicken Kuruma', 'price': 1450, 'cal': '580 kcal', 'desc': 'Slow-cooked rich creamy cashew and yogurt chicken curry, mildly spiced in authentic Mughal style'},
    {'code': 'PD11', 'cat': 'Curries & Specialties', 'name': 'Lahori Beef Kuruma', 'price': 1650, 'cal': '640 kcal', 'desc': 'Tender beef cubes slow-simmered in an aromatic Pakistani gravy'},
    {'code': 'PD12', 'cat': 'Shawarma & Wraps', 'name': 'Darbar Special Chicken Shawarma Wrap', 'price': 890, 'cal': '480 kcal', 'desc': 'Shredded grilled chicken wrapped in fresh pita with pickles, french fries and garlic sauce'},
    {'code': 'PD13', 'cat': 'Tandoori Naan', 'name': 'Butter Naan', 'price': 250, 'cal': '210 kcal', 'desc': 'Fresh tandoor-baked flatbread brushed with rich ghee butter'},
    {'code': 'PD14', 'cat': 'Tandoori Naan', 'name': 'Garlic Naan', 'price': 300, 'cal': '220 kcal', 'desc': 'Tandoor naan topped with roasted minced garlic and fresh coriander'},
    {'code': 'PD15', 'cat': 'Tandoori Naan', 'name': 'Cheese Garlic Naan', 'price': 490, 'cal': '320 kcal', 'desc': 'Stuffed with melted mozzarella and seasoned with roasted garlic'}
]

for it in pakistan_darbar_items:
    all_menu.append({
        'id': f"pakistan-darbar-{it['code']}",
        'item_code': it['code'],
        'brand_id': 'pakistan-darbar',
        'brand_name': 'Pakistan Darbar',
        'category': it['cat'],
        'name': it['name'],
        'price': it['price'],
        'price_formatted': f"{it['price']:,} LKR",
        'calories': it['cal'],
        'description': it.get('desc', '')
    })
    all_menu.append({
        'id': f"darbar-bbq-{it['code']}",
        'item_code': it['code'],
        'brand_id': 'darbar-bbq',
        'brand_name': 'Darbar Biryani & BBQ',
        'category': it['cat'],
        'name': it['name'],
        'price': it['price'],
        'price_formatted': f"{it['price']:,} LKR",
        'calories': it['cal'],
        'description': it.get('desc', '')
    })

counts['Pakistan Darbar'] = len(pakistan_darbar_items)
counts['Darbar Biryani & BBQ'] = len(pakistan_darbar_items)

with open('data/menu.json', 'w', encoding='utf-8') as f:
    json.dump(all_menu, f, ensure_ascii=False, indent=2)

print('Menu written to data/menu.json. Total items:', len(all_menu))
print('Counts per brand:', counts)
