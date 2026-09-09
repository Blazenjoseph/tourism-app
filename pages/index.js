import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

const translations = {
  en: {
    label: "EN",
    eyebrow: "✨ AI-Powered Travel, Made for India",
    heading: "Discover local stays, guides & experiences",
    subheading: "Enter your destination PIN code to explore what's nearby",
    placeholder: "Enter PIN code, e.g. 570001",
    explore: "Explore",
    planTrip: "🗓️ Plan a trip with AI",
    heritage: "📸 Explore a heritage site",
    tripPlanner: "AI Trip Planner",
    heritageExplorer: "Heritage Explorer",
    wishlist: "Wishlist",
    packingList: "Packing List",
    budgetTracker: "Budget Tracker",
    translator: "Translator",
    feature1Title: "Any PIN code in India",
    feature1Desc: "Real, live attraction data for every district",
    feature2Title: "AI-personalized itineraries",
    feature2Desc: "Day-by-day plans built around your budget",
    feature3Title: "Instant heritage insights",
    feature3Desc: "Snap a photo, learn the story behind it",
  },
  hi: {
    label: "हिं",
    eyebrow: "✨ भारत के लिए एआई-संचालित यात्रा",
    heading: "स्थानीय ठहरने, गाइड और अनुभव खोजें",
    subheading: "आस-पास क्या है यह जानने के लिए अपना पिन कोड डालें",
    placeholder: "पिन कोड डालें, जैसे 570001",
    explore: "खोजें",
    planTrip: "🗓️ एआई से यात्रा योजना बनाएं",
    heritage: "📸 धरोहर स्थल देखें",
    tripPlanner: "एआई यात्रा योजना",
    heritageExplorer: "धरोहर एक्सप्लोरर",
    wishlist: "पसंदीदा",
    packingList: "पैकिंग सूची",
    budgetTracker: "बजट ट्रैकर",
    translator: "अनुवादक",
    feature1Title: "भारत का कोई भी पिन कोड",
    feature1Desc: "हर जिले के लिए वास्तविक, लाइव आकर्षण डेटा",
    feature2Title: "एआई-व्यक्तिगत यात्रा योजना",
    feature2Desc: "आपके बजट के अनुसार दिन-प्रतिदिन की योजना",
    feature3Title: "तुरंत धरोहर जानकारी",
    feature3Desc: "एक फोटो लें, उसके पीछे की कहानी जानें",
  },
  kn: {
    label: "ಕನ್",
    eyebrow: "✨ ಭಾರತಕ್ಕಾಗಿ ಎಐ-ಚಾಲಿತ ಪ್ರವಾಸ",
    heading: "ಸ್ಥಳೀಯ ವಸತಿ, ಮಾರ್ಗದರ್ಶಿಗಳು ಮತ್ತು ಅನುಭವಗಳನ್ನು ಅನ್ವೇಷಿಸಿ",
    subheading: "ಹತ್ತಿರದಲ್ಲಿ ಏನಿದೆ ಎಂದು ತಿಳಿಯಲು ನಿಮ್ಮ ಪಿನ್ ಕೋಡ್ ನಮೂದಿಸಿ",
    placeholder: "ಪಿನ್ ಕೋಡ್ ನಮೂದಿಸಿ, ಉದಾ. 570001",
    explore: "ಅನ್ವೇಷಿಸಿ",
    planTrip: "🗓️ ಎಐ ಜೊತೆ ಪ್ರವಾಸ ಯೋಜಿಸಿ",
    heritage: "📸 ಪರಂಪರೆ ತಾಣ ಅನ್ವೇಷಿಸಿ",
    tripPlanner: "ಎಐ ಪ್ರವಾಸ ಯೋಜಕ",
    heritageExplorer: "ಪರಂಪರೆ ಎಕ್ಸ್ಪ್ಲೋರರ್",
    wishlist: "ಇಷ್ಟಪಟ್ಟವು",
    packingList: "ಪ್ಯಾಕಿಂಗ್ ಪಟ್ಟಿ",
    budgetTracker: "ಬಜೆಟ್ ಟ್ರ್ಯಾಕರ್",
    translator: "ಅನುವಾದಕ",
    feature1Title: "ಭಾರತದ ಯಾವುದೇ ಪಿನ್ ಕೋಡ್",
    feature1Desc: "ಪ್ರತಿ ಜಿಲ್ಲೆಗೆ ನೈಜ, ಲೈವ್ ಆಕರ್ಷಣೆ ಡೇಟಾ",
    feature2Title: "ಎಐ-ವೈಯಕ್ತಿಕಗೊಳಿಸಿದ ಪ್ರವಾಸ ಯೋಜನೆ",
    feature2Desc: "ನಿಮ್ಮ ಬಜೆಟ್ಗೆ ಅನುಗುಣವಾಗಿ ದಿನದಿಂದ ದಿನದ ಯೋಜನೆ",
    feature3Title: "ತಕ್ಷಣದ ಪರಂಪರೆ ಮಾಹಿತಿ",
    feature3Desc: "ಫೋಟೋ ತೆಗೆಯಿರಿ, ಅದರ ಹಿಂದಿನ ಕಥೆ ತಿಳಿಯಿರಿ",
  },
  ml: {
    label: "മല",
    eyebrow: "✨ ഇന്ത്യക്കായി എഐ-പവർഡ് യാത്ര",
    heading: "പ്രാദേശിക താമസസൗകര്യങ്ങൾ, ഗൈഡുകൾ, അനുഭവങ്ങൾ കണ്ടെത്തുക",
    subheading: "സമീപത്ത് എന്തുണ്ടെന്ന് അറിയാൻ നിങ്ങളുടെ പിൻ കോഡ് നൽകുക",
    placeholder: "പിൻ കോഡ് നൽകുക, ഉദാ. 570001",
    explore: "പര്യവേക്ഷണം ചെയ്യുക",
    planTrip: "🗓️ എഐ ഉപയോഗിച്ച് യാത്ര ആസൂത്രണം ചെയ്യുക",
    heritage: "📸 പൈതൃക സ്ഥലം പര്യവേക്ഷണം ചെയ്യുക",
    tripPlanner: "എഐ യാത്രാ പ്ലാനർ",
    heritageExplorer: "പൈതൃക എക്സ്പ്ലോറർ",
    wishlist: "ഇഷ്ടപ്പെട്ടവ",
    packingList: "പാക്കിംഗ് ലിസ്റ്റ്",
    budgetTracker: "ബജറ്റ് ട്രാക്കർ",
    translator: "വിവർത്തകൻ",
    feature1Title: "ഇന്ത്യയിലെ ഏത് പിൻ കോഡും",
    feature1Desc: "ഓരോ ജില്ലയ്ക്കും യഥാർത്ഥ, തത്സമയ ആകർഷണ ഡാറ്റ",
    feature2Title: "എഐ-വ്യക്തിഗതമാക്കിയ യാത്രാ പദ്ധതികൾ",
    feature2Desc: "നിങ്ങളുടെ ബജറ്റിനനുസരിച്ച് ദിവസംതോറുമുള്ള പദ്ധതികൾ",
    feature3Title: "തൽക്ഷണ പൈതൃക അറിവുകൾ",
    feature3Desc: "ഒരു ഫോട്ടോ എടുക്കുക, അതിന് പിന്നിലെ കഥ അറിയുക",
  },
  ta: {
    label: "தமி",
    eyebrow: "✨ இந்தியாவிற்கான AI-இயங்கும் பயணம்",
    heading: "உள்ளூர் தங்குமிடங்கள், வழிகாட்டிகள் மற்றும் அனுபவங்களைக் கண்டறியுங்கள்",
    subheading: "அருகில் என்ன இருக்கிறது என்பதை அறிய உங்கள் பின் கோடை உள்ளிடவும்",
    placeholder: "பின் கோடை உள்ளிடவும், எ.கா. 570001",
    explore: "ஆராயுங்கள்",
    planTrip: "🗓️ AI உடன் பயணத்தை திட்டமிடுங்கள்",
    heritage: "📸 பாரம்பரிய தளத்தை ஆராயுங்கள்",
    tripPlanner: "AI பயண திட்டமிடுபவர்",
    heritageExplorer: "பாரம்பரிய எக்ஸ்புளோரர்",
    wishlist: "விருப்பப்பட்டியல்",
    packingList: "பேக்கிங் பட்டியல்",
    budgetTracker: "பட்ஜெட் டிராக்கர்",
    translator: "மொழிபெயர்ப்பாளர்",
    feature1Title: "இந்தியாவின் எந்த பின் கோடும்",
    feature1Desc: "ஒவ்வொரு மாவட்டத்திற்கும் உண்மையான, நேரடி ஈர்ப்பு தரவு",
    feature2Title: "AI-தனிப்பயனாக்கப்பட்ட பயணத் திட்டங்கள்",
    feature2Desc: "உங்கள் பட்ஜெட்டின் அடிப்படையில் நாள் வாரியான திட்டங்கள்",
    feature3Title: "உடனடி பாரம்பரிய நுண்ணறிவுகள்",
    feature3Desc: "ஒரு புகைப்படம் எடுங்கள், அதன் பின்னணி கதையை அறியுங்கள்",
  },
};

export default function Home() {
  const [pincode, setPincode] = useState("");
  const [lang, setLang] = useState("en");
  const router = useRouter();

  useEffect(() => {
    const saved = localStorage.getItem("lang");
    if (saved && translations[saved]) setLang(saved);
  }, []);

  function switchLang(newLang) {
    setLang(newLang);
    localStorage.setItem("lang", newLang);
  }

  function handleSearch(e) {
    e.preventDefault();
    if (!pincode.trim()) return;
    router.push(`/search?pincode=${pincode.trim()}`);
  }

  const t = translations[lang];
  const langCodes = ["en", "hi", "kn", "ml", "ta"];

  return (
    <div>
      <nav className="navbar">
        <div className="container">
          <Link href="/" className="logo">TravelMitra</Link>
          <div className="nav-links">
            <Link href="/trip-planner">{t.tripPlanner}</Link>
            <Link href="/heritage-explorer">{t.heritageExplorer}</Link>
            <Link href="/wishlist">{t.wishlist}</Link>
            <Link href="/packing-list">{t.packingList}</Link>
            <Link href="/budget-tracker">{t.budgetTracker || "Budget Tracker"}</Link>
            <Link href="/translator">{t.translator || "Translator"}</Link>
            <Link href="/voice-assistant">Negotiator</Link>
            <div style={{ display: "flex", gap: 4 }}>
              {langCodes.map((code) => (
                <button
                  key={code}
                  onClick={() => switchLang(code)}
                  style={{
                    padding: "4px 9px",
                    borderRadius: 14,
                    border: "1px solid #ddd",
                    background: lang === code ? "#d9622b" : "white",
                    color: lang === code ? "white" : "#333",
                    fontSize: 11.5,
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  {translations[code].label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      <section className="hero">
        <div className="container">
          <span className="eyebrow">{t.eyebrow}</span>
          <h1>{t.heading}</h1>
          <p>{t.subheading}</p>
          <form className="search-box" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder={t.placeholder}
              value={pincode}
              onChange={(e) => setPincode(e.target.value)}
            />
            <button type="submit" className="btn">{t.explore}</button>
          </form>

          <div className="hero-actions">
            <Link href="/trip-planner" className="btn-secondary">
              {t.planTrip}
            </Link>
            <Link href="/heritage-explorer" className="btn-secondary">
              {t.heritage}
            </Link>
          </div>
        </div>
      </section>

      <section className="feature-strip">
        <div className="container">
          <div className="feature-item">
            <span className="icon">🗺️</span>
            <h4>{t.feature1Title}</h4>
            <p>{t.feature1Desc}</p>
          </div>
          <div className="feature-item">
            <span className="icon">🤖</span>
            <h4>{t.feature2Title}</h4>
            <p>{t.feature2Desc}</p>
          </div>
          <div className="feature-item">
            <span className="icon">🏛️</span>
            <h4>{t.feature3Title}</h4>
            <p>{t.feature3Desc}</p>
          </div>
        </div>
      </section>
    </div>
  );
}
