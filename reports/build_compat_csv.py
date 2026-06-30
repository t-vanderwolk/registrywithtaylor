#!/usr/bin/env python3
"""Generate the TMBC travel-system compatibility CSV matrix from the 274-row
Stroller-table export. Read-only: produces a CSV, touches no database.

Columns: Brand, Model, Overall, then one column per infant-car-seat family with
Direct / Incl. / Sep. / blank, plus Adapter, Source, Notes.
"""
import csv, re

# Infant car seat family columns (universal + separate families)
SEAT_COLS = [
    ("pipa", "Nuna PIPA"), ("cybex", "Cybex Aton/Cloud"), ("maxicosi", "Maxi-Cosi Mico"),
    ("clek", "Clek Liing"), ("britax", "Britax Willow/B-Safe"), ("chicco", "Chicco KeyFit"),
    ("graco", "Graco SnugRide"), ("peg", "Peg Perego Primo Viaggio"), ("mesa", "UPPAbaby Mesa/Aria"),
    ("evenflo", "Evenflo LiteMax"), ("babytrend", "Baby Trend EZ-Lift"), ("orbit", "Orbit Baby"),
    ("joie", "Joie carrier"),
]
EURO = ["pipa", "cybex", "maxicosi", "clek"]  # the shared "euro-click" universal group

def prof(seats, adapter, source, overall, notes=""):
    """seats: dict seat_key -> status ('Direct'/'Incl.'/'Sep.')."""
    return {"seats": seats, "adapter": adapter, "source": source, "overall": overall, "notes": notes}

def euro(status):
    return {k: status for k in EURO}

# ---- 274 rows: (brand, model) exactly as exported ----
ROWS = [
("Baby Jogger","City Mini 2"),("Baby Jogger","City Mini Air"),("Baby Jogger","City Mini Double"),
("Baby Jogger","City Mini GT2"),("Baby Jogger","City Mini GT2 Double"),("Baby Jogger","City Mini GT3"),
("Baby Jogger","City Mini GT3 All-Terrain"),("Baby Jogger","City Mini GT3 Single"),("Baby Jogger","City Prix Jogger"),
("Baby Jogger","City Prix Jogger x Bike Trailer"),("Baby Jogger","City Select 2"),("Baby Jogger","City Sights"),
("Baby Jogger","City Tour 2"),("Baby Jogger","City Tour 2 Double"),("Baby Jogger","City Tour 2 Single"),
("Baby Jogger","Summit X3"),("Baby Jogger","Summit X3 Double"),("Baby Jogger","Summit X3 Double Jogging"),
("Baby Jogger","Summit X3 Single"),("Baby Jogger","Summit X3 Single Jogging"),
("Baby Trend","Expedition 2-in-1"),("Baby Trend","Expedition Zero Flat Jogger with LED Lights"),
("Babyzen","YOYO+"),
("Bellini","Juno Auto-Folding"),("Bellini","Juno Compact Auto-Folding"),
("BOB","Alterrain Pro"),("BOB","Rambler"),("BOB","Renegade Wagon"),("BOB","Revolution Flex 3.0"),
("BOB","Revolution Flex 3.0 Duallie"),("BOB","Wayfinder"),
("Britax","B-Clever"),("Britax","B-Lively"),("Britax","BOB - Wayfinder"),("Britax","Brook+ Modular Baby"),
("Britax","Grove Modular"),("Britax","Juniper On-The-Go"),("Britax","Prism Modular"),
("Bugaboo","Ant"),("Bugaboo","Bee 5"),("Bugaboo","Butterfly"),("Bugaboo","Butterfly 2"),
("Bugaboo","Butterfly 2 Complete"),("Bugaboo","Butterfly Complete"),("Bugaboo","Donkey 3"),
("Bugaboo","Donkey 5 Mono Single-to-Double"),("Bugaboo","Donkey 6"),("Bugaboo","Dragonfly"),
("Bugaboo","Fox 2"),("Bugaboo","Fox 5"),("Bugaboo","Kangaroo"),
("Bumbleride","Era"),("Bumbleride","Indie"),("Bumbleride","Indie Twin"),("Bumbleride","Indie Twin Double"),
("Bumbleride","Indie Twin Double Jogging"),("Bumbleride","Speed"),
("Chicco","BravoFor2 Standing/Sitting Double"),("Chicco","Bravo LE ClearTex Quick-Fold"),("Chicco","Bravo Quick-Fold"),
("Chicco","Corso Flex Convertible"),("Chicco","Corso Primo Modular"),("Chicco","Cortina Together Double"),
("Chicco","Presto Self-Folding"),("Chicco","TRE"),("Chicco","TRE Jogging"),
("Cybex","e-Gazelle S"),("Cybex","LIBELLE Ultra Travel"),("CYBEX","Balios S Lux"),("CYBEX","Beezy"),
("CYBEX","Coya"),("CYBEX","Eezy S Twist"),("CYBEX","Eos"),("CYBEX","Gazelle S"),("CYBEX","Melio"),
("CYBEX","Mios"),("CYBEX","Priam"),
("Delta","Children - Baby Gap 2-In-1 Carriage"),("Delta","Children - BabyGap Classic"),
("Delta","Children - BabyGap Classic Side-by-Side Double"),("Delta","Gap Classic Umbrella"),
("Delta","Jeep Adventureglyde"),("Delta Children","Icon Ultra Everyday & Travel"),("Delta Children","Jeep Aries"),
("Delta Children","Jeep Sport"),("Delta Children","Jeep Sport All-Terrain"),("Delta Children","Jeep Wrangler Deluxe 4 Seater"),
("DFY","R1"),("Doona","Liki Trike S3"),("Egg","Egg"),
("Ergobaby","Metro 3"),("Ergobaby","Metro 3 Compact"),("Ergobaby","Metro 3 Deluxe Baby"),
("Ergobaby","Metro 3 Travel"),("Ergobaby","Metro+ Deluxe"),("Ergobaby","Metro+ Deluxe Baby"),
("Evenflo","Hummingbird Carbon Fiber"),("Evenflo","Hummingbird Carbon Fiber Lightweight"),("Evenflo","Pivot Xpand Modular"),
("Evenflo","Pivot Xpand NXT"),("Evenflo","Pivot Xplore"),("Evenflo","Pivot Xplore All-Terrain"),("Evenflo","Shyft Intuiti+"),
("Graco","FastAction Jogger LX"),("Graco","Merge"),("Graco","Modes Nest"),("Graco","Modes Nest2Grow"),
("Graco","Modes Pramette"),("Graco","Outpace LX"),("Graco","Ready2Grow 2.0 Double"),("Graco","Ready2Grow LX 2.0 Double"),
("Graco","Ready2Jet"),("Graco","Ready2Jet Compact"),
("Guava Family","Roam"),("Guava Family","Roam Jogging"),
("Ingenuity","3DSuite Modular"),("Inglesina","Quid³"),
("Joie","Caraway Whirl"),("Joie","Chive"),("Joie","Chive Single to Double"),("Joie","Ginger"),("Joie","Ginger DLX"),
("Joie","Hazel"),("Joie","Kava"),("Joie","Nutmeg"),("Joie","Poppy Whirl"),("Joie","Rosemary"),
("Joie","Rosemary Double"),("Joie","Tansy"),
("Joolz","Aer+"),("Joolz","Aer2"),("Joolz","Day"),("Joolz","Day+"),("Joolz","Day+ Complete"),
("Joolz","Dot Ultra Travel"),("Joolz","Geo"),("Joolz","Hub"),("Joolz","Hub 2"),
("Joovy","Caboose S"),("Joovy","Caboose Ultralight Graphite"),("Joovy","Qool"),("Joovy","Twin Roo+"),
("Larktale","Caravan Coupe Quad"),("Larktale","Caravan Coupe V2"),("Larktale","Caravan Quad"),
("Maxi-Cosi","Fame Modular"),("Maxi-Cosi","Lila"),("Maxi-Cosi","Oxford Cabin Travel"),("Maxi-Cosi","Tayla"),
("Maxi-Cosi","Tayla Max Modular"),
("Mercedes","Amg Gt² Single"),("Mercedes","Performance Single"),
("Mima","Creo"),("Mima","Miro"),("Mima","Xari"),("Mima","Xari Sport"),("Mima","Zigi"),
("Mockingbird","Single"),("Mockingbird","Single 3.0"),("Mockingbird","Single-to-Double"),("Mockingbird","Single-to-Double 3.0"),
("Momcozy","ChangeGo Baby"),("Momcozy","Clickgo"),("Momcozy","ClickGo Lightweight"),
("Mompush","Lithe Double"),("Mompush","Lithe V2"),("Mompush","Meteor 2"),("Mompush","Ultimate 2 Seat"),
("Mompush","Velo Travel"),("Mompush","Wiz"),
("Nuna","BMW x SWIV"),("Nuna","DEMI icon"),("Nuna","DEMI next"),("Nuna","MIXX next"),("Nuna","Mixx Next Bmw"),
("Nuna","Mixx Next With Magnetic Buckle"),("Nuna","SWIV"),("Nuna","TAVO next"),("Nuna","Tavo Next Granite"),
("Nuna","TRIV LX"),("Nuna","TRIV next"),("Nuna","Triv Next Bmw"),("Nuna","Triv Next With Magnetic Buckle Caviar/Chocolate"),
("Nuna","Triv Next W Magnetic Buckle"),("Nuna","Trvl Double"),("Nuna","TRVL Dubl"),("Nuna","TRVL Easy Fold Compact"),
("Nuna","TRVL lx"),("Nuna","VIAA Cabn"),("Nuna","x BMW MIXX next"),("Nuna","x BMW TRIV next"),("Nuna","x BMW TRVL lx"),
("Orbit Baby","G5"),("Orbit Baby","M+"),("Orbit Baby","X5"),
("Peg Perego","City Loop"),("Peg Perego","Selfie"),("Peg Perego","Vivace"),("Peg Perego","Vivace Single"),
("Peg Perego","Volo"),("Peg Perego","Volo Ultra Carry On Compliant Travel"),
("Peg Perego","Volo Ultra Carry On Compliant Travel Strolle"),("Peg Perego","YPSI"),("Peg Perego","Z4"),
("Radio Flyer","Voya XT Baby"),("Romer","Tura"),
("Safety 1st","Disney Baby Character Umbrella"),("Safety 1st","Easy-Fold"),("Safety 1st","Easy-Fold Compact"),
("Safety 1st","Summit Quad Wagon"),
("Silver Cross","Breez"),("Silver Cross","Clic"),("Silver Cross","Clic Compact"),("Silver Cross","Comet"),
("Silver Cross","Cove 2"),("Silver Cross","Dune"),("Silver Cross","Dune 2"),("Silver Cross","Jet 5"),
("Silver Cross","Jet Double"),("Silver Cross","Nia Travel"),("Silver Cross","Reef"),("Silver Cross","Reef 2"),
("Silver Cross","Wave"),("Silver Cross","Wave 3"),("Silver Cross","Wave 3 Single to Double"),
("Stokke","Yoyo 3"),
("Thule","Chariot Cross 2 Double"),("Thule","Chariot Cross 2 Single"),("Thule","Chariot Sport 2 Double"),
("Thule","Chariot Sport 2 Single"),("Thule","Glide 2"),("Thule","Sleek"),("Thule","Spring 2"),
("Thule","Urban Glide 2"),("Thule","Urban Glide 2 Double"),("Thule","Urban Glide 3"),("Thule","Urban Glide 3 Double"),
("Thule","Urban Glide 4-wheel"),("Thule","Urban Glide 4-Wheel Single Child"),
("UPPAbaby","Cruz V2"),("UPPAbaby","Cruz V3"),("UPPAbaby","G-LUXE"),("UPPAbaby","Minu Duo"),
("UPPAbaby","Minu Duo Side By Side Double"),("UPPAbaby","Minu V2"),("UPPAbaby","Minu V3"),("UPPAbaby","Ridge"),
("UPPAbaby","Ridge V2"),("UPPAbaby","Vista V2"),("UPPAbaby","Vista V3"),
("Veer","All-Terrain Cruiser"),("Veer","Cruiser"),("Veer","Cruiser City"),("Veer","Cruiser City XL Essentials"),
("Veer","Cruiser Wagon Comfort Seat for Toddlers"),("Veer","Cruiser Wagon XL Comfort Seat for Toddlers"),
("Veer","Cruiser XL Nap System"),("Veer","Switch&Jog"),("Veer","Switch&Jog Jogging"),("Veer","Switch&Roll"),
("WonderFold","L2 Double 2-Seater"),("WonderFold","Volkswagon Special Edition Double"),("WonderFold","W2 Luxe Double"),
("WonderFold","W4 Luxe Pro Quad"),("WonderFold Wagon","L2 Double"),("WonderFold Wagon","L4 Quad"),
("WonderFold Wagon","VW Edition Quad"),("WonderFold Wagon","W2 Elite Pro"),("WonderFold Wagon","W2 Luxe Pro Double Seater"),
("WonderFold Wagon","W4 Elite Pro"),("WonderFold Wagon","W4 Luxe Pro"),("WonderFold Wagon","W6 Luxe Pro"),
("Zoe","The Journey"),("Zoe","Traveler"),
]

def classify(brand, model):
    b = brand.lower(); m = model.lower()
    src = {}  # filled per-brand below
    # ---- NONE: wagons / umbrellas / toddler-only / not-a-stroller ----
    if b=="momcozy" and "changego" in m: return prof({}, "", "—", "Excluded", "Not a stroller (changing station)")
    if b=="doona": return prof({}, "", "—", "Excluded", "Doona excluded per task rules")
    if b=="safety 1st": return prof({}, "", "safety1st.com", "None", "Umbrella/wagon — no infant car seat")
    if b=="bellini": return prof({}, "", "—", "Review", "Compact auto-fold — likely no infant seat; verify")
    if b=="momcozy": return prof({}, "", "—", "Review", "Compact — confirm own seat vs none")
    if b=="radio flyer": return prof({}, "", "radioflyer.com", "None", "Stroller-wagon — confirm")
    if b=="bugaboo" and ("kangaroo" in m or m=="ant"): return prof({}, "", "bugaboo.com", "None", "No Bugaboo car seat adapter for this frame")
    if b=="uppababy" and "g-luxe" in m: return prof({}, "", "uppababy.com", "None", "Umbrella — no adapter")
    if b=="evenflo" and "hummingbird" in m: return prof({}, "", "evenflo.com", "None", "Ultra-compact — no car seat adapter")
    if b=="mompush" and "lithe" in m: return prof({}, "", "mompush.com", "None", "Integrated seat — cannot use car seat")
    if b=="veer" and ("comfort seat for toddlers" in m or "nap system" in m): return prof({}, "", "goveer.com", "None", "Toddler-seat / nap config — not an infant car seat")
    if b=="delta" and ("umbrella" in m or "babygap classic" in m or "baby gap 2-in-1" in m): return prof({}, "", "deltachildren.com", "None", "Umbrella/lightweight — no infant seat")
    if b=="delta children" and "jeep" in m and ("aries" in m or "wrangler" in m): return prof({}, "", "deltachildren.com", "None", "Lightweight/4-seat Jeep — no infant seat")
    if b=="delta" and "adventureglyde" in m: return prof({"chicco":"Sep."}, "Delta Jeep Chicco KeyFit 30 adapter", "deltachildren.com", "Sep.", "Jeep jogger takes Chicco KeyFit 30 via Delta adapter")
    if b=="delta children" and "jeep sport" in m: return prof({"chicco":"Sep."}, "Delta Jeep Chicco KeyFit 30 adapter", "deltachildren.com", "Sep.", "Jeep jogger takes Chicco KeyFit 30 via Delta adapter")
    if b=="delta children" and "icon ultra" in m: return prof({}, "", "—", "Review", "Confirm infant-seat support")
    if b=="bob" and "renegade wagon" in m: return prof({}, "", "bobgear.com", "None", "Wagon — confirm")
    if b=="bob" and m=="rambler": return prof({"britax":"Sep.","graco":"Sep.","chicco":"Sep."}, "BOB infant car seat adapter (per Adapter Finder)", "bobgear.com", "Review", "Older BOB — confirm current adapter")
    # ---- NUNA (closed, PIPA only, ring adapter included) ----
    if b=="nuna":
        return prof({"pipa":"Incl."}, "Nuna ring adapter (included)", "nunababy.com", "Incl.", "Closed ecosystem — Nuna PIPA only")
    # ---- UPPAbaby ----
    if b=="uppababy" and ("vista" in m or "cruz" in m):
        return prof({**euro("Sep."), "mesa":"Direct","chicco":"Sep."}, "UPPAbaby Vista/Cruz adapter (Maxi-Cosi/Nuna/Cybex/Clek); Chicco adapter; Mesa direct", "uppababy.com", "Direct + Sep.", "Mesa/Aria click on directly")
    if b=="uppababy" and ("minu" in m or "ridge" in m):
        return prof({**euro("Sep."), "mesa":"Sep."}, "UPPAbaby Minu/Ridge adapter (Mesa/Aria or Maxi-Cosi/Nuna/Cybex)", "uppababy.com", "Sep.")
    # ---- Bugaboo ----
    if b=="bugaboo":
        incl = ("fox 5" in m) or ("dragonfly" in m)
        st = "Incl." if incl else "Sep."
        return prof(euro(st), f"Bugaboo car seat adapter ({'included' if incl else 'sold separately'})", "bugaboo.com", st, "Bugaboo Turtle/Maxi-Cosi/Nuna/Cybex/Clek")
    # ---- Cybex ----
    if b=="cybex":
        if "priam" in m or "mios" in m:
            return prof({"cybex":"Incl.","maxicosi":"Sep.","pipa":"Sep."}, "Cybex adapter (incl. for Cybex; Maxi-Cosi/Nuna compatible)", "cybex-online.com", "Incl.")
        if "gazelle" in m:
            return prof({"cybex":"Sep.","maxicosi":"Sep.","pipa":"Sep."}, "Cybex Gazelle S Car Seat Adapter", "cybex-online.com", "Sep.", "Cybex + Maxi-Cosi Mico 30 + Nuna PIPA")
        # Balios / Beezy / Coya / Melio / Eezy / Eos / Libelle — Cybex-seat only
        return prof({"cybex":"Sep."}, "Cybex model-specific adapter (Aton/Cloud)", "cybex-online.com", "Sep.", "Cybex Aton/Cloud ONLY — Nuna/Maxi-Cosi not supported")
    # ---- Silver Cross ----
    if b=="silver cross":
        return prof({**euro("Sep.")}, "Silver Cross car seat adapter (model-specific)", "silvercrossus.com", "Sep.", "Nuna/Cybex/Maxi-Cosi/Clek")
    # ---- Thule ----
    if b=="thule":
        if "chariot" in m: return prof({}, "Thule Chariot infant sling (not a car seat)", "thule.com", "None", "Uses Thule infant SLING, not a standard infant car seat")
        return prof({**euro("Sep."), "chicco":"Sep."}, "Thule Urban Glide / Spring / Sleek car seat adapter", "thule.com", "Sep.", "UG2 vs UG3 adapters not interchangeable")
    # ---- BOB ----
    if b=="bob" or (b=="britax" and "wayfinder" in m):
        return prof({"britax":"Sep.","graco":"Sep.","chicco":"Sep.","peg":"Sep.",**euro("Sep.")}, "BOB infant car seat adapter (per Adapter Finder)", "bobgear.com", "Sep.", "Britax/Graco/Chicco/Cybex/Nuna/Maxi-Cosi/Peg")
    # ---- Baby Jogger ----
    if b=="baby jogger":
        if "bike trailer" in m: return prof({}, "", "—", "Review", "Trailer bundle — not a clean stroller row")
        return prof({"graco":"Sep.","chicco":"Sep.","peg":"Sep.",**euro("Sep.")}, "Baby Jogger car seat adapter (Graco; Chicco/Peg; Maxi-Cosi/Cybex/Nuna)", "babyjogger.com", "Sep.", "City GO direct on some")
    # ---- Peg Perego ----
    if b=="peg perego":
        if "city loop" in m:
            return prof({"peg":"Direct","chicco":"Sep.","graco":"Sep.",**euro("Sep.")}, "Primo Viaggio Links (direct); Foldable Car Seat Adapter (other brands)", "us.pegperego.com", "Direct + Sep.")
        if "volo" in m or "selfie" in m:
            return prof({"peg":"Direct"}, "Primo Viaggio Links", "us.pegperego.com", "Review", "Carry-on/compact — confirm Links support")
        return prof({"peg":"Direct"}, "Peg Perego Primo Viaggio Links", "us.pegperego.com", "Direct", "Primo Viaggio 4-35")
    # ---- Veer ----
    if b=="veer":
        return prof({"cybex":"Sep.","maxicosi":"Sep.","pipa":"Sep.","clek":"Sep."}, "Veer Cruiser / Switchback ICS adapter", "goveer.com", "Sep.", "Veer frames only")
    # ---- Joolz ----
    if b=="joolz":
        return prof({**euro("Sep."), "britax":"Sep."}, "Joolz car seat adapter (Hub/Geo/Day/Aer)", "joolz.com", "Sep.", "Maxi-Cosi/Cybex/Nuna/BeSafe/Britax")
    # ---- Orbit Baby ----
    if b=="orbit baby":
        return prof({"orbit":"Direct","maxicosi":"Sep.","cybex":"Sep.","pipa":"Sep."}, "Orbit Baby Infant Car Seat Stroller Adapter", "orbitbaby.com", "Direct + Sep.", "X5: confirm same as G5")
    # ---- Inglesina ----
    if b=="inglesina":
        return prof({**euro("Sep.")}, "Inglesina Quid³ car seat adapter", "inglesina.us", "Sep.")
    # ---- Mima ----
    if b=="mima":
        ov = "Review" if "miro" in m else "Sep."
        return prof({**euro("Sep.")}, "Mima Xari/Zigi/Creo car seat adapter", "mimakidsusa.com", ov, "Miro: confirm adapter" if "miro" in m else "")
    # ---- Chicco (direct) ----
    if b=="chicco":
        return prof({"chicco":"Direct"}, "—", "chiccousa.com", "Direct", "KeyFit/Fit2 click on; no adapter")
    # ---- Graco (direct) ----
    if b=="graco":
        return prof({"graco":"Direct"}, "—", "gracobaby.com", "Direct", "SnugRide Click Connect only")
    # ---- Britax ----
    if b=="britax":
        if "grove" in m or "brook" in m or "prism" in m:
            return prof({"britax":"Direct"}, "—", "us.britax.com", "Direct", "Willow/Willow S/SC/Cypress")
        if "b-lively" in m or "b-clever" in m:
            return prof({"britax":"Sep."}, "Britax Click & Go infant car seat adapter", "us.britax.com", "Sep.", "Willow via adapter")
        return prof({"britax":"Direct"}, "Britax (confirm Juniper seat)", "us.britax.com", "Review")
    # ---- Evenflo ----
    if b=="evenflo":
        if "xplore" in m: return prof({"evenflo":"Sep."}, "Evenflo Pivot Xplore Infant Car Seat Adapter", "evenflo.com", "Sep.", "LiteMax/SafeMax/SecureMax")
        return prof({"evenflo":"Direct"}, "—", "evenflo.com", "Direct", "LiteMax/SecureMax click on")
    # ---- Baby Trend (direct) ----
    if b=="baby trend":
        return prof({"babytrend":"Direct"}, "—", "babytrend.com", "Direct", "EZ-Lift/Secure-Lift")
    # ---- Maxi-Cosi ----
    if b=="maxi-cosi":
        if "lila" in m: return prof({"maxicosi":"Sep."}, "Maxi-Cosi Lila/Tayla adapter", "maxi-cosi.com", "Sep.")
        return prof({"maxicosi":"Incl."}, "Maxi-Cosi adapter (included)", "maxi-cosi.com", "Incl.", "All Maxi-Cosi Mico seats")
    # ---- Bumbleride ----
    if b=="bumbleride":
        return prof({**euro("Sep."), "graco":"Sep.","chicco":"Sep."}, "Bumbleride car seat adapter (Indie/Speed/Era/Indie Twin)", "bumbleride.com", "Sep.", "Indie Twin uses its own adapter")
    # ---- Stokke / Babyzen ----
    if b in ("stokke","babyzen"):
        return prof({"maxicosi":"Sep.","cybex":"Sep.","pipa":"Sep."}, "Babyzen / Stokke YOYO car seat adapter", "stokke.com", "Sep.", "Yoyo 3 = Babyzen YOYO")
    # ---- Mockingbird ----
    if b=="mockingbird":
        return prof({**euro("Sep."), "britax":"Sep.","chicco":"Sep.","graco":"Sep.","mesa":"Sep."}, "Mockingbird car seat adapter (40+ seats)", "hellomockingbird.com", "Sep.", "Mesa Max/Aria not in double")
    # ---- Zoe ----
    if b=="zoe":
        return prof({"chicco":"Sep.","britax":"Sep.","evenflo":"Sep.",**euro("Sep.")}, "Zoe The Journey car seat adapter (Chicco; Nuna/Maxi-Cosi/Cybex/Britax)", "zoebaby.com", "Sep.", "Traveler: confirm shares Journey adapter")
    # ---- Larktale ----
    if b=="larktale":
        return prof({"maxicosi":"Sep.","pipa":"Sep.","clek":"Sep.","chicco":"Sep."}, "Larktale Caravan car seat adapter (Maxi-Cosi/Nuna/Clek; Chicco)", "larktale.com", "Sep.", "Not Britax Willow/Cypress")
    # ---- Ergobaby ----
    if b=="ergobaby":
        return prof({"cybex":"Sep.","pipa":"Sep.","maxicosi":"Sep.","britax":"Sep."}, "Ergobaby Metro+/Metro 3 car seat adapter", "ergobaby.com", "Sep.", "Cybex/Nuna/Maxi-Cosi/BeSafe/Britax")
    # ---- Mompush ----
    if b=="mompush":
        if "ultimate" in m or "meteor" in m:
            return prof({"maxicosi":"Incl.","pipa":"Incl.","cybex":"Incl."}, "Mompush car seat adapter (included)", "mompush.com", "Incl.")
        if "wiz" in m: return prof({"maxicosi":"Sep.","pipa":"Sep.","cybex":"Sep.","chicco":"Sep."}, "Mompush Wiz car seat adapter (+ separate Chicco)", "mompush.com", "Sep.")
        if "velo" in m: return prof({"maxicosi":"Sep.","pipa":"Sep.","cybex":"Sep."}, "Mompush Velo car seat adapter", "mompush.com", "Sep.")
        return prof({}, "", "mompush.com", "Review")
    # ---- WonderFold ----
    if "wonderfold" in b:
        return prof({**euro("Sep."), "britax":"Sep.","graco":"Sep.","chicco":"Sep.","mesa":"Sep."}, "WonderFold Car Seat Adapter (W & L Series, 360°)", "wonderfold.com", "Sep.", "W4 two adapters; W2 one")
    # ---- Joovy ----
    if b=="joovy":
        return prof({"graco":"Sep.","chicco":"Sep.","britax":"Sep.","peg":"Sep.",**euro("Sep.")}, "Joovy Caboose/Qool/Twin Roo+ adapter", "joovy.com", "Sep.")
    # ---- Joie ----
    if b=="joie":
        return prof({"joie":"Incl."}, "Joie car seat adapter (included)", "joiebaby.com", "Incl.", "Joie gemm/i-Gemm/i-Snug; confirm US carrier")
    # ---- Guava ----
    if b=="guava family":
        return prof({"britax":"Sep.","cybex":"Sep.","pipa":"Sep.","mesa":"Sep.","graco":"Sep.","chicco":"Sep."}, "Guava Roam car seat adapter", "guavafamily.com", "Sep.", "Smooth terrain only with car seat")
    # ---- Niche / unresolved ----
    if b=="mercedes": return prof({"maxicosi":"Sep."}, "Hartan/Mercedes adapter (Maxi-Cosi) — verify", "—", "Review", "Hartan-made; confirm exact seats")
    if b=="romer": return prof({"britax":"Direct"}, "Britax-Römer Click & Go — verify", "—", "Review", "Confirm US Baby-Safe seat")
    if b=="egg": return prof({"maxicosi":"Sep.","cybex":"Sep."}, "Egg car seat adapter — verify", "—", "Review", "UK brand; confirm model + US seats")
    if b=="ingenuity": return prof({}, "", "—", "Review", "Confirm InRight/own-seat click")
    if b=="dfy": return prof({}, "", "—", "Review", "Niche — no manufacturer list found")
    return prof({}, "", "—", "Review", "Unclassified — verify")

# ---- emit CSV ----
out_path = "TMBC-Travel-System-Compatibility-Matrix.csv"
header = ["Brand","Model","Overall"] + [label for _,label in SEAT_COLS] + ["Adapter","Source","Notes"]
with open(out_path, "w", newline="") as f:
    w = csv.writer(f)
    w.writerow(header)
    counts = {}
    for brand, model in ROWS:
        p = classify(brand, model)
        seats = p["seats"]
        row = [brand, model, p["overall"]] + [seats.get(k,"") for k,_ in SEAT_COLS] + [p["adapter"], p["source"], p["notes"]]
        w.writerow(row)
        counts[p["overall"]] = counts.get(p["overall"],0)+1
print(f"Wrote {out_path} with {len(ROWS)} rows")
print("Overall breakdown:", dict(sorted(counts.items())))
