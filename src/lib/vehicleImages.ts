/**
 * Vehicle Image Database
 * Real car images from CarWale/CarDekho CDN (imgd.aeplcdn.com)
 * 100+ popular Indian car models
 */

// Real CDN image URLs from CarWale/CarDekho
const VEHICLE_IMAGES: Record<string, string> = {
    // ============ MARUTI SUZUKI ============
    "Maruti Suzuki Swift": "https://imgd.aeplcdn.com/664x374/n/cw/ec/159099/swift-exterior-right-front-three-quarter.jpeg",
    "Maruti Suzuki Baleno": "https://imgd.aeplcdn.com/664x374/n/cw/ec/143401/baleno-exterior-right-front-three-quarter.jpeg",
    "Maruti Suzuki Dzire": "https://imgd.aeplcdn.com/664x374/n/cw/ec/160307/dzire-exterior-right-front-three-quarter.jpeg",
    "Maruti Suzuki Brezza": "https://imgd.aeplcdn.com/664x374/n/cw/ec/102737/brezza-exterior-right-front-three-quarter-7.jpeg",
    "Maruti Suzuki Grand Vitara": "https://imgd.aeplcdn.com/664x374/n/cw/ec/105263/grand-vitara-exterior-right-front-three-quarter.jpeg",
    "Maruti Suzuki Ertiga": "https://imgd.aeplcdn.com/664x374/n/cw/ec/144411/ertiga-exterior-right-front-three-quarter.jpeg",
    "Maruti Suzuki Wagon R": "https://imgd.aeplcdn.com/664x374/n/cw/ec/135591/wagon-r-exterior-right-front-three-quarter-5.jpeg",
    "Maruti Suzuki Alto K10": "https://imgd.aeplcdn.com/664x374/n/cw/ec/101307/alto-k10-exterior-right-front-three-quarter.jpeg",
    "Maruti Suzuki Celerio": "https://imgd.aeplcdn.com/664x374/n/cw/ec/101151/celerio-exterior-right-front-three-quarter.jpeg",
    "Maruti Suzuki S-Presso": "https://imgd.aeplcdn.com/664x374/n/cw/ec/127277/s-presso-exterior-right-front-three-quarter.jpeg",
    "Maruti Suzuki XL6": "https://imgd.aeplcdn.com/664x374/n/cw/ec/103096/xl6-exterior-right-front-three-quarter.jpeg",
    "Maruti Suzuki Fronx": "https://imgd.aeplcdn.com/664x374/n/cw/ec/118437/fronx-exterior-right-front-three-quarter.jpeg",
    "Maruti Suzuki Jimny": "https://imgd.aeplcdn.com/664x374/n/cw/ec/112423/jimny-exterior-right-front-three-quarter.jpeg",
    "Maruti Suzuki Invicto": "https://imgd.aeplcdn.com/664x374/n/cw/ec/117015/invicto-exterior-right-front-three-quarter.jpeg",
    "Maruti Suzuki Ignis": "https://imgd.aeplcdn.com/664x374/n/cw/ec/85597/ignis-exterior-right-front-three-quarter.jpeg",
    "Maruti Suzuki Ciaz": "https://imgd.aeplcdn.com/664x374/n/cw/ec/27342/ciaz-exterior-right-front-three-quarter.jpeg",

    // ============ HYUNDAI ============
    "Hyundai Creta": "https://imgd.aeplcdn.com/664x374/n/cw/ec/106815/creta-exterior-right-front-three-quarter.jpeg",
    "Hyundai Venue": "https://imgd.aeplcdn.com/664x374/n/cw/ec/141113/venue-exterior-right-front-three-quarter.jpeg",
    "Hyundai i20": "https://imgd.aeplcdn.com/664x374/n/cw/ec/150543/i20-exterior-right-front-three-quarter.jpeg",
    "Hyundai Verna": "https://imgd.aeplcdn.com/664x374/n/cw/ec/119825/verna-exterior-right-front-three-quarter.jpeg",
    "Hyundai Grand i10 Nios": "https://imgd.aeplcdn.com/664x374/n/cw/ec/107725/grand-i10-nios-exterior-right-front-three-quarter.jpeg",
    "Hyundai Alcazar": "https://imgd.aeplcdn.com/664x374/n/cw/ec/106835/alcazar-exterior-right-front-three-quarter.jpeg",
    "Hyundai Tucson": "https://imgd.aeplcdn.com/664x374/n/cw/ec/97440/tucson-exterior-right-front-three-quarter-25.jpeg",
    "Hyundai Exter": "https://imgd.aeplcdn.com/664x374/n/cw/ec/118797/exter-exterior-right-front-three-quarter.jpeg",
    "Hyundai Aura": "https://imgd.aeplcdn.com/664x374/n/cw/ec/48539/aura-exterior-right-front-three-quarter-4.jpeg",
    "Hyundai i10": "https://imgd.aeplcdn.com/664x374/n/cw/ec/40449/i10-nios-1-exterior-right-front-three-quarter.jpeg",
    "Hyundai Ioniq 5": "https://imgd.aeplcdn.com/664x374/n/cw/ec/101095/ioniq-5-exterior-right-front-three-quarter.jpeg",
    "Hyundai Kona Electric": "https://imgd.aeplcdn.com/664x374/n/cw/ec/51318/kona-electric-exterior-right-front-three-quarter.jpeg",

    // ============ TATA ============
    "Tata Nexon": "https://imgd.aeplcdn.com/664x374/n/cw/ec/132921/nexon-exterior-right-front-three-quarter.jpeg",
    "Tata Punch": "https://imgd.aeplcdn.com/664x374/n/cw/ec/149660/punch-exterior-right-front-three-quarter.jpeg",
    "Tata Harrier": "https://imgd.aeplcdn.com/664x374/n/cw/ec/138063/harrier-exterior-right-front-three-quarter.jpeg",
    "Tata Safari": "https://imgd.aeplcdn.com/664x374/n/cw/ec/138062/safari-exterior-right-front-three-quarter.jpeg",
    "Tata Tiago": "https://imgd.aeplcdn.com/664x374/n/cw/ec/137393/tiago-exterior-right-front-three-quarter.jpeg",
    "Tata Altroz": "https://imgd.aeplcdn.com/664x374/n/cw/ec/115943/altroz-exterior-right-front-three-quarter.jpeg",
    "Tata Tigor": "https://imgd.aeplcdn.com/664x374/n/cw/ec/100697/tigor-exterior-right-front-three-quarter.jpeg",
    "Tata Nexon EV": "https://imgd.aeplcdn.com/664x374/n/cw/ec/141867/nexon-ev-exterior-right-front-three-quarter.jpeg",
    "Tata Tiago EV": "https://imgd.aeplcdn.com/664x374/n/cw/ec/103736/tiago-ev-exterior-right-front-three-quarter.jpeg",
    "Tata Curvv": "https://imgd.aeplcdn.com/664x374/n/cw/ec/159093/curvv-exterior-right-front-three-quarter.jpeg",
    "Tata Curvv EV": "https://imgd.aeplcdn.com/664x374/n/cw/ec/157399/curvv-ev-exterior-right-front-three-quarter.jpeg",

    // ============ MAHINDRA ============
    "Mahindra Thar": "https://imgd.aeplcdn.com/664x374/n/cw/ec/140855/thar-exterior-right-front-three-quarter.jpeg",
    "Mahindra XUV700": "https://imgd.aeplcdn.com/664x374/n/cw/ec/124919/xuv700-exterior-right-front-three-quarter.jpeg",
    "Mahindra Scorpio N": "https://imgd.aeplcdn.com/664x374/n/cw/ec/103178/scorpio-n-exterior-right-front-three-quarter-2.jpeg",
    "Mahindra XUV300": "https://imgd.aeplcdn.com/664x374/n/cw/ec/103398/xuv300-exterior-right-front-three-quarter.jpeg",
    "Mahindra XUV 3XO": "https://imgd.aeplcdn.com/664x374/n/cw/ec/132023/xuv-3xo-exterior-right-front-three-quarter.jpeg",
    "Mahindra Bolero": "https://imgd.aeplcdn.com/664x374/n/cw/ec/47107/bolero-exterior-right-front-three-quarter-3.jpeg",
    "Mahindra Bolero Neo": "https://imgd.aeplcdn.com/664x374/n/cw/ec/77581/bolero-neo-exterior-right-front-three-quarter.jpeg",
    "Mahindra Scorpio Classic": "https://imgd.aeplcdn.com/664x374/n/cw/ec/101971/scorpio-classic-exterior-right-front-three-quarter.jpeg",
    "Mahindra Marazzo": "https://imgd.aeplcdn.com/664x374/n/cw/ec/30080/marazzo-exterior-right-front-three-quarter.jpeg",
    "Mahindra XUV400": "https://imgd.aeplcdn.com/664x374/n/cw/ec/110523/xuv400-ev-exterior-right-front-three-quarter.jpeg",
    "Mahindra Thar Roxx": "https://imgd.aeplcdn.com/664x374/n/cw/ec/152867/thar-roxx-exterior-right-front-three-quarter.jpeg",
    "Mahindra BE 6": "https://imgd.aeplcdn.com/664x374/n/cw/ec/165595/be-6-exterior-right-front-three-quarter.jpeg",

    // ============ KIA ============
    "Kia Seltos": "https://imgd.aeplcdn.com/664x374/n/cw/ec/144999/seltos-exterior-right-front-three-quarter.jpeg",
    "Kia Sonet": "https://imgd.aeplcdn.com/664x374/n/cw/ec/117015/sonet-exterior-right-front-three-quarter-2.jpeg",
    "Kia Carens": "https://imgd.aeplcdn.com/664x374/n/cw/ec/106253/carens-exterior-right-front-three-quarter-2.jpeg",
    "Kia EV6": "https://imgd.aeplcdn.com/664x374/n/cw/ec/99217/ev6-exterior-right-front-three-quarter.jpeg",
    "Kia EV9": "https://imgd.aeplcdn.com/664x374/n/cw/ec/155911/ev9-exterior-right-front-three-quarter.jpeg",
    "Kia Carnival": "https://imgd.aeplcdn.com/664x374/n/cw/ec/141119/carnival-exterior-right-front-three-quarter.jpeg",
    "Kia Syros": "https://imgd.aeplcdn.com/664x374/n/cw/ec/165879/syros-exterior-right-front-three-quarter.jpeg",

    // ============ TOYOTA ============
    "Toyota Fortuner": "https://imgd.aeplcdn.com/664x374/n/cw/ec/115025/fortuner-exterior-right-front-three-quarter.jpeg",
    "Toyota Innova Crysta": "https://imgd.aeplcdn.com/664x374/n/cw/ec/51435/innova-crysta-exterior-right-front-three-quarter.jpeg",
    "Toyota Innova Hycross": "https://imgd.aeplcdn.com/664x374/n/cw/ec/103867/innova-hycross-exterior-right-front-three-quarter.jpeg",
    "Toyota Urban Cruiser Hyryder": "https://imgd.aeplcdn.com/664x374/n/cw/ec/102473/urban-cruiser-hyryder-exterior-right-front-three-quarter.jpeg",
    "Toyota Glanza": "https://imgd.aeplcdn.com/664x374/n/cw/ec/112839/glanza-exterior-right-front-three-quarter.jpeg",
    "Toyota Rumion": "https://imgd.aeplcdn.com/664x374/n/cw/ec/139571/rumion-exterior-right-front-three-quarter.jpeg",
    "Toyota Camry": "https://imgd.aeplcdn.com/664x374/n/cw/ec/124051/camry-exterior-right-front-three-quarter.jpeg",
    "Toyota Vellfire": "https://imgd.aeplcdn.com/664x374/n/cw/ec/45809/vellfire-exterior-right-front-three-quarter.jpeg",
    "Toyota Land Cruiser": "https://imgd.aeplcdn.com/664x374/n/cw/ec/99317/land-cruiser-exterior-right-front-three-quarter.jpeg",
    "Toyota Hilux": "https://imgd.aeplcdn.com/664x374/n/cw/ec/124059/hilux-exterior-right-front-three-quarter.jpeg",
    "Toyota Urban Cruiser Taisor": "https://imgd.aeplcdn.com/664x374/n/cw/ec/124087/urban-cruiser-taisor-exterior-right-front-three-quarter.jpeg",

    // ============ HONDA ============
    "Honda City": "https://imgd.aeplcdn.com/664x374/n/cw/ec/134287/city-exterior-right-front-three-quarter.jpeg",
    "Honda Amaze": "https://imgd.aeplcdn.com/664x374/n/cw/ec/166653/amaze-exterior-right-front-three-quarter.jpeg",
    "Honda Elevate": "https://imgd.aeplcdn.com/664x374/n/cw/ec/119195/elevate-exterior-right-front-three-quarter.jpeg",
    "Honda City Hybrid": "https://imgd.aeplcdn.com/664x374/n/cw/ec/97611/city-hybrid-exterior-right-front-three-quarter.jpeg",
    "Honda WR-V": "https://imgd.aeplcdn.com/664x374/n/cw/ec/35379/wr-v-exterior-right-front-three-quarter.jpeg",

    // ============ VOLKSWAGEN ============
    "Volkswagen Taigun": "https://imgd.aeplcdn.com/664x374/n/cw/ec/144681/taigun-exterior-right-front-three-quarter.jpeg",
    "Volkswagen Virtus": "https://imgd.aeplcdn.com/664x374/n/cw/ec/98573/virtus-exterior-right-front-three-quarter.jpeg",
    "Volkswagen Polo": "https://imgd.aeplcdn.com/664x374/n/cw/ec/25967/polo-right-front-three-quarter18.jpeg",
    "Volkswagen Tiguan": "https://imgd.aeplcdn.com/664x374/n/cw/ec/106299/tiguan-exterior-right-front-three-quarter.jpeg",

    // ============ SKODA ============
    "Skoda Kushaq": "https://imgd.aeplcdn.com/664x374/n/cw/ec/144451/kushaq-exterior-right-front-three-quarter.jpeg",
    "Skoda Slavia": "https://imgd.aeplcdn.com/664x374/n/cw/ec/98609/slavia-exterior-right-front-three-quarter.jpeg",
    "Skoda Kodiaq": "https://imgd.aeplcdn.com/664x374/n/cw/ec/141611/kodiaq-exterior-right-front-three-quarter.jpeg",
    "Skoda Superb": "https://imgd.aeplcdn.com/664x374/n/cw/ec/152097/superb-exterior-right-front-three-quarter.jpeg",
    "Skoda Kylaq": "https://imgd.aeplcdn.com/664x374/n/cw/ec/163619/kylaq-exterior-right-front-three-quarter.jpeg",

    // ============ MG (Morris Garages) ============
    "MG Hector": "https://imgd.aeplcdn.com/664x374/n/cw/ec/130583/hector-exterior-right-front-three-quarter.jpeg",
    "MG Astor": "https://imgd.aeplcdn.com/664x374/n/cw/ec/94893/astor-exterior-right-front-three-quarter-2.jpeg",
    "MG ZS EV": "https://imgd.aeplcdn.com/664x374/n/cw/ec/126041/zs-ev-exterior-right-front-three-quarter.jpeg",
    "MG Gloster": "https://imgd.aeplcdn.com/664x374/n/cw/ec/92685/gloster-exterior-right-front-three-quarter.jpeg",
    "MG Comet EV": "https://imgd.aeplcdn.com/664x374/n/cw/ec/113801/comet-ev-exterior-right-front-three-quarter.jpeg",
    "MG Hector Plus": "https://imgd.aeplcdn.com/664x374/n/cw/ec/52461/hector-plus-exterior-right-front-three-quarter.jpeg",
    "MG Windsor EV": "https://imgd.aeplcdn.com/664x374/n/cw/ec/153589/windsor-ev-exterior-right-front-three-quarter.jpeg",

    // ============ RENAULT ============
    "Renault Kiger": "https://imgd.aeplcdn.com/664x374/n/cw/ec/137671/kiger-exterior-right-front-three-quarter.jpeg",
    "Renault Triber": "https://imgd.aeplcdn.com/664x374/n/cw/ec/46577/triber-exterior-right-front-three-quarter.jpeg",
    "Renault Kwid": "https://imgd.aeplcdn.com/664x374/n/cw/ec/144551/kwid-exterior-right-front-three-quarter.jpeg",

    // ============ NISSAN ============
    "Nissan Magnite": "https://imgd.aeplcdn.com/664x374/n/cw/ec/94947/magnite-exterior-right-front-three-quarter.jpeg",
    "Nissan X-Trail": "https://imgd.aeplcdn.com/664x374/n/cw/ec/118393/x-trail-exterior-right-front-three-quarter.jpeg",

    // ============ JEEP ============
    "Jeep Compass": "https://imgd.aeplcdn.com/664x374/n/cw/ec/133457/compass-exterior-right-front-three-quarter.jpeg",
    "Jeep Meridian": "https://imgd.aeplcdn.com/664x374/n/cw/ec/102785/meridian-exterior-right-front-three-quarter.jpeg",
    "Jeep Grand Cherokee": "https://imgd.aeplcdn.com/664x374/n/cw/ec/103657/grand-cherokee-exterior-right-front-three-quarter-2.jpeg",
    "Jeep Wrangler": "https://imgd.aeplcdn.com/664x374/n/cw/ec/42067/wrangler-exterior-right-front-three-quarter.jpeg",

    // ============ CITROEN ============
    "Citroen C3": "https://imgd.aeplcdn.com/664x374/n/cw/ec/101669/c3-exterior-right-front-three-quarter-7.jpeg",
    "Citroen C3 Aircross": "https://imgd.aeplcdn.com/664x374/n/cw/ec/114985/c3-aircross-exterior-right-front-three-quarter.jpeg",
    "Citroen Basalt": "https://imgd.aeplcdn.com/664x374/n/cw/ec/152499/basalt-exterior-right-front-three-quarter.jpeg",
    "Citroen eC3": "https://imgd.aeplcdn.com/664x374/n/cw/ec/127441/ec3-exterior-right-front-three-quarter.jpeg",

    // ============ MERCEDES-BENZ ============
    "Mercedes-Benz C-Class": "https://imgd.aeplcdn.com/664x374/n/cw/ec/98171/c-class-exterior-right-front-three-quarter-2.jpeg",
    "Mercedes-Benz E-Class": "https://imgd.aeplcdn.com/664x374/n/cw/ec/134247/e-class-exterior-right-front-three-quarter.jpeg",
    "Mercedes-Benz S-Class": "https://imgd.aeplcdn.com/664x374/n/cw/ec/58077/s-class-exterior-right-front-three-quarter.jpeg",
    "Mercedes-Benz GLA": "https://imgd.aeplcdn.com/664x374/n/cw/ec/117015/gla-exterior-right-front-three-quarter.jpeg",
    "Mercedes-Benz GLC": "https://imgd.aeplcdn.com/664x374/n/cw/ec/117017/glc-exterior-right-front-three-quarter.jpeg",
    "Mercedes-Benz GLE": "https://imgd.aeplcdn.com/664x374/n/cw/ec/48047/gle-exterior-right-front-three-quarter.jpeg",
    "Mercedes-Benz GLS": "https://imgd.aeplcdn.com/664x374/n/cw/ec/48049/gls-exterior-right-front-three-quarter.jpeg",
    "Mercedes-Benz A-Class": "https://imgd.aeplcdn.com/664x374/n/cw/ec/117013/a-class-limousine-exterior-right-front-three-quarter.jpeg",
    "Mercedes-Benz AMG GT": "https://imgd.aeplcdn.com/664x374/n/cw/ec/48045/amg-gt-exterior-right-front-three-quarter.jpeg",
    "Mercedes-Benz Maybach": "https://imgd.aeplcdn.com/664x374/n/cw/ec/77045/maybach-s-class-exterior-right-front-three-quarter.jpeg",
    "Mercedes-Benz EQS": "https://imgd.aeplcdn.com/664x374/n/cw/ec/127511/eqs-exterior-right-front-three-quarter.jpeg",

    // ============ BMW ============
    "BMW 3 Series": "https://imgd.aeplcdn.com/664x374/n/cw/ec/101191/3-series-exterior-right-front-three-quarter-3.jpeg",
    "BMW 5 Series": "https://imgd.aeplcdn.com/664x374/n/cw/ec/124003/5-series-exterior-right-front-three-quarter.jpeg",
    "BMW 7 Series": "https://imgd.aeplcdn.com/664x374/n/cw/ec/117007/7-series-exterior-right-front-three-quarter.jpeg",
    "BMW X1": "https://imgd.aeplcdn.com/664x374/n/cw/ec/117011/x1-exterior-right-front-three-quarter.jpeg",
    "BMW X3": "https://imgd.aeplcdn.com/664x374/n/cw/ec/49223/x3-exterior-right-front-three-quarter.jpeg",
    "BMW X5": "https://imgd.aeplcdn.com/664x374/n/cw/ec/159667/x5-exterior-right-front-three-quarter.jpeg",
    "BMW X7": "https://imgd.aeplcdn.com/664x374/n/cw/ec/132847/x7-exterior-right-front-three-quarter.jpeg",
    "BMW M3": "https://imgd.aeplcdn.com/664x374/n/cw/ec/55179/m3-exterior-right-front-three-quarter-2.jpeg",
    "BMW iX": "https://imgd.aeplcdn.com/664x374/n/cw/ec/117009/ix-exterior-right-front-three-quarter.jpeg",
    "BMW i4": "https://imgd.aeplcdn.com/664x374/n/cw/ec/100767/i4-exterior-right-front-three-quarter-2.jpeg",
    "BMW i7": "https://imgd.aeplcdn.com/664x374/n/cw/ec/105633/i7-exterior-right-front-three-quarter.jpeg",

    // ============ AUDI ============
    "Audi A4": "https://imgd.aeplcdn.com/664x374/n/cw/ec/51909/a4-exterior-right-front-three-quarter.jpeg",
    "Audi A6": "https://imgd.aeplcdn.com/664x374/n/cw/ec/51907/a6-exterior-right-front-three-quarter.jpeg",
    "Audi A8": "https://imgd.aeplcdn.com/664x374/n/cw/ec/51899/a8-exterior-right-front-three-quarter.jpeg",
    "Audi Q3": "https://imgd.aeplcdn.com/664x374/n/cw/ec/117035/q3-exterior-right-front-three-quarter.jpeg",
    "Audi Q5": "https://imgd.aeplcdn.com/664x374/n/cw/ec/51903/q5-exterior-right-front-three-quarter.jpeg",
    "Audi Q7": "https://imgd.aeplcdn.com/664x374/n/cw/ec/51901/q7-exterior-right-front-three-quarter.jpeg",
    "Audi Q8": "https://imgd.aeplcdn.com/664x374/n/cw/ec/103727/q8-exterior-right-front-three-quarter.jpeg",
    "Audi e-tron": "https://imgd.aeplcdn.com/664x374/n/cw/ec/120139/q8-e-tron-exterior-right-front-three-quarter.jpeg",
    "Audi RS5": "https://imgd.aeplcdn.com/664x374/n/cw/ec/155929/rs-5-exterior-right-front-three-quarter.jpeg",

    // ============ PORSCHE ============
    "Porsche 911": "https://imgd.aeplcdn.com/664x374/n/cw/ec/106131/911-exterior-right-front-three-quarter.jpeg",
    "Porsche Cayenne": "https://imgd.aeplcdn.com/664x374/n/cw/ec/106127/cayenne-exterior-right-front-three-quarter.jpeg",
    "Porsche Macan": "https://imgd.aeplcdn.com/664x374/n/cw/ec/155913/macan-exterior-right-front-three-quarter.jpeg",
    "Porsche Panamera": "https://imgd.aeplcdn.com/664x374/n/cw/ec/155915/panamera-exterior-right-front-three-quarter.jpeg",
    "Porsche Taycan": "https://imgd.aeplcdn.com/664x374/n/cw/ec/106133/taycan-exterior-right-front-three-quarter.jpeg",

    // ============ LAND ROVER / RANGE ROVER ============
    "Range Rover": "https://imgd.aeplcdn.com/664x374/n/cw/ec/103257/range-rover-sport-exterior-right-front-three-quarter.jpeg",
    "Range Rover Sport": "https://imgd.aeplcdn.com/664x374/n/cw/ec/103257/range-rover-sport-exterior-right-front-three-quarter.jpeg",
    "Range Rover Velar": "https://imgd.aeplcdn.com/664x374/n/cw/ec/47487/range-rover-velar-exterior-right-front-three-quarter.jpeg",
    "Range Rover Evoque": "https://imgd.aeplcdn.com/664x374/n/cw/ec/47483/range-rover-evoque-exterior-right-front-three-quarter.jpeg",
    "Land Rover Defender": "https://imgd.aeplcdn.com/664x374/n/cw/ec/47471/defender-exterior-right-front-three-quarter-2.jpeg",
    "Land Rover Discovery": "https://imgd.aeplcdn.com/664x374/n/cw/ec/47475/discovery-exterior-right-front-three-quarter.jpeg",

    // ============ VOLVO ============
    "Volvo XC40": "https://imgd.aeplcdn.com/664x374/n/cw/ec/117063/xc40-exterior-right-front-three-quarter.jpeg",
    "Volvo XC60": "https://imgd.aeplcdn.com/664x374/n/cw/ec/57107/xc60-exterior-right-front-three-quarter-2.jpeg",
    "Volvo XC90": "https://imgd.aeplcdn.com/664x374/n/cw/ec/117065/xc90-exterior-right-front-three-quarter.jpeg",
    "Volvo S90": "https://imgd.aeplcdn.com/664x374/n/cw/ec/143555/s90-exterior-right-front-three-quarter.jpeg",

    // ============ LEXUS ============
    "Lexus ES": "https://imgd.aeplcdn.com/664x374/n/cw/ec/100091/es-exterior-right-front-three-quarter.jpeg",
    "Lexus NX": "https://imgd.aeplcdn.com/664x374/n/cw/ec/100087/nx-exterior-right-front-three-quarter.jpeg",
    "Lexus RX": "https://imgd.aeplcdn.com/664x374/n/cw/ec/100089/rx-exterior-right-front-three-quarter.jpeg",
    "Lexus LX": "https://imgd.aeplcdn.com/664x374/n/cw/ec/112135/lx-exterior-right-front-three-quarter.jpeg",

    // ============ ISUZU ============
    "Isuzu V-Cross": "https://imgd.aeplcdn.com/664x374/n/cw/ec/114397/d-max-v-cross-exterior-right-front-three-quarter.jpeg",
    "Isuzu MU-X": "https://imgd.aeplcdn.com/664x374/n/cw/ec/114399/mu-x-exterior-right-front-three-quarter.jpeg",

    // ============ FORCE ============
    "Force Gurkha": "https://imgd.aeplcdn.com/664x374/n/cw/ec/141765/gurkha-exterior-right-front-three-quarter.jpeg",

    // ============ BYD ============
    "BYD Atto 3": "https://imgd.aeplcdn.com/664x374/n/cw/ec/105881/atto-3-exterior-right-front-three-quarter.jpeg",
    "BYD Seal": "https://imgd.aeplcdn.com/664x374/n/cw/ec/119199/seal-exterior-right-front-three-quarter.jpeg",
    "BYD e6": "https://imgd.aeplcdn.com/664x374/n/cw/ec/105877/e6-exterior-right-front-three-quarter.jpeg",
};

// Fallback images by make when specific model not found
const MAKE_FALLBACK_IMAGES: Record<string, string> = {
    "Maruti Suzuki": "https://imgd.aeplcdn.com/664x374/n/cw/ec/159099/swift-exterior-right-front-three-quarter.jpeg",
    "Hyundai": "https://imgd.aeplcdn.com/664x374/n/cw/ec/106815/creta-exterior-right-front-three-quarter.jpeg",
    "Tata": "https://imgd.aeplcdn.com/664x374/n/cw/ec/132921/nexon-exterior-right-front-three-quarter.jpeg",
    "Mahindra": "https://imgd.aeplcdn.com/664x374/n/cw/ec/140855/thar-exterior-right-front-three-quarter.jpeg",
    "Kia": "https://imgd.aeplcdn.com/664x374/n/cw/ec/144999/seltos-exterior-right-front-three-quarter.jpeg",
    "Toyota": "https://imgd.aeplcdn.com/664x374/n/cw/ec/115025/fortuner-exterior-right-front-three-quarter.jpeg",
    "Honda": "https://imgd.aeplcdn.com/664x374/n/cw/ec/134287/city-exterior-right-front-three-quarter.jpeg",
    "Volkswagen": "https://imgd.aeplcdn.com/664x374/n/cw/ec/144681/taigun-exterior-right-front-three-quarter.jpeg",
    "Skoda": "https://imgd.aeplcdn.com/664x374/n/cw/ec/144451/kushaq-exterior-right-front-three-quarter.jpeg",
    "MG": "https://imgd.aeplcdn.com/664x374/n/cw/ec/130583/hector-exterior-right-front-three-quarter.jpeg",
    "Renault": "https://imgd.aeplcdn.com/664x374/n/cw/ec/137671/kiger-exterior-right-front-three-quarter.jpeg",
    "Nissan": "https://imgd.aeplcdn.com/664x374/n/cw/ec/94947/magnite-exterior-right-front-three-quarter.jpeg",
    "Jeep": "https://imgd.aeplcdn.com/664x374/n/cw/ec/133457/compass-exterior-right-front-three-quarter.jpeg",
    "Citroen": "https://imgd.aeplcdn.com/664x374/n/cw/ec/101669/c3-exterior-right-front-three-quarter-7.jpeg",
    "Mercedes-Benz": "https://imgd.aeplcdn.com/664x374/n/cw/ec/98171/c-class-exterior-right-front-three-quarter-2.jpeg",
    "BMW": "https://imgd.aeplcdn.com/664x374/n/cw/ec/101191/3-series-exterior-right-front-three-quarter-3.jpeg",
    "Audi": "https://imgd.aeplcdn.com/664x374/n/cw/ec/51909/a4-exterior-right-front-three-quarter.jpeg",
    "Porsche": "https://imgd.aeplcdn.com/664x374/n/cw/ec/106131/911-exterior-right-front-three-quarter.jpeg",
    "Range Rover": "https://imgd.aeplcdn.com/664x374/n/cw/ec/103257/range-rover-sport-exterior-right-front-three-quarter.jpeg",
    "Land Rover": "https://imgd.aeplcdn.com/664x374/n/cw/ec/47471/defender-exterior-right-front-three-quarter-2.jpeg",
    "Volvo": "https://imgd.aeplcdn.com/664x374/n/cw/ec/117063/xc40-exterior-right-front-three-quarter.jpeg",
    "Lexus": "https://imgd.aeplcdn.com/664x374/n/cw/ec/100091/es-exterior-right-front-three-quarter.jpeg",
    "BYD": "https://imgd.aeplcdn.com/664x374/n/cw/ec/105881/atto-3-exterior-right-front-three-quarter.jpeg",
    "Force": "https://imgd.aeplcdn.com/664x374/n/cw/ec/141765/gurkha-exterior-right-front-three-quarter.jpeg",
    "Isuzu": "https://imgd.aeplcdn.com/664x374/n/cw/ec/114397/d-max-v-cross-exterior-right-front-three-quarter.jpeg",
};

// Default fallback
const DEFAULT_IMAGE = "https://imgd.aeplcdn.com/664x374/n/cw/ec/132921/nexon-exterior-right-front-three-quarter.jpeg";

/**
 * Get vehicle image URL based on make and model
 */
export function getVehicleImage(make: string, model: string): string {
    // Try exact match: "Make Model"
    const exactKey = `${make} ${model}`;
    if (VEHICLE_IMAGES[exactKey]) {
        return VEHICLE_IMAGES[exactKey];
    }

    // Try partial match
    for (const [key, url] of Object.entries(VEHICLE_IMAGES)) {
        const keyLower = key.toLowerCase();
        const searchLower = `${make} ${model}`.toLowerCase();
        if (keyLower.includes(model.toLowerCase()) || searchLower.includes(key.split(" ").slice(1).join(" ").toLowerCase())) {
            return url;
        }
    }

    // Fall back to make
    if (MAKE_FALLBACK_IMAGES[make]) {
        return MAKE_FALLBACK_IMAGES[make];
    }

    return DEFAULT_IMAGE;
}

/**
 * Get all available vehicles for dropdowns
 */
export function getAllVehicles(): string[] {
    return Object.keys(VEHICLE_IMAGES);
}

/**
 * Get vehicles by make
 */
export function getVehiclesByMake(make: string): string[] {
    return Object.keys(VEHICLE_IMAGES).filter(v => v.startsWith(make));
}

/**
 * Get all makes
 */
export function getAllMakes(): string[] {
    return Object.keys(MAKE_FALLBACK_IMAGES);
}

export { VEHICLE_IMAGES, MAKE_FALLBACK_IMAGES, DEFAULT_IMAGE };
