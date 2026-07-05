import { useCallback, useEffect, useRef, useState } from "react";

import "./fonts/fonts.css";
import "./hero.css";
import CoverageMap from "./CoverageMap";
import Reviews from "./Reviews";
import PrivacyPolicy from "./PrivacyPolicy";
import SeoHead from "./SeoHead";

const services = [
  {
    name: "Sports Massage",
    image: "/service-sports.jpg",
    description: "Targeted therapy to aid recovery, prevent injury and enhance athletic performance.",
    prices: [{ duration: "60 min", price: "£70" }, { duration: "90 min", price: "£100" }],
    info: {
      origin: "Early 20th century, popularised during the 1970s running boom in the United States and Europe.",
      history: "Rooted in Swedish massage techniques, sports massage was refined by coaches and physiotherapists working alongside competitive athletes. It gained mainstream recognition at the 1984 Los Angeles Olympics, where it was offered to athletes for the first time at an official Games.",
      intro: "Sports massage utilises deep tissue and stretching techniques to alleviate muscle tension, enhance flexibility, and accelerate recovery. It improves circulation and aids in breaking down scar tissue. Beyond physical recovery, it offers significant mental health benefits by reducing stress and lowering cortisol levels.",
      benefits: ["Reduces post-exercise muscle soreness", "Helps prevent soft tissue injuries", "Improves flexibility and range of motion", "Speeds recovery between training sessions", "Reduces anxiety and mental fatigue"],
      timing: [
        { label: "Pre-Event", text: "Pre-competition massages are generally lighter, aiming to stimulate blood flow and mentally prepare the athlete." },
        { label: "Post-Event", text: "Post-workout massages focus on flushing out metabolic waste and easing tight, overworked muscles." },
        { label: "During Training", text: "Consistent, regular treatments manage heavy training loads, prevent overtraining, and optimise physical progress." },
      ],
      contraindications: [
        "Systemic infections or fever — massage increases circulation which can worsen illness",
        "Contagious skin conditions (e.g. ringworm, impetigo, shingles)",
        "Deep Vein Thrombosis (DVT) or blood clots — massage can dislodge a clot with potentially fatal consequences",
        "Bleeding disorders or blood-thinning medications",
        "Intoxication or active drug use",
        "Unstable cardiovascular conditions or recent heart issues",
        "Tumours or active cancer — formal medical clearance required",
      ],
    },
  },
  {
    name: "Deep Tissue",
    image: "/service-deep-tissue.jpg",
    description: "Firm pressure reaching deeper muscle layers to release chronic tension and knots.",
    prices: [{ duration: "60 min", price: "£70" }, { duration: "90 min", price: "£100" }],
    info: {
      origin: "Formalised in North America during the 1970s, building on ancient deep-pressure healing traditions found across many cultures.",
      history: "Canadian physiotherapist Therese Pfrimmer is credited with developing one of the first structured deep tissue techniques after using it to recover from her own partial paralysis in the 1940s. The modern form draws on earlier practices from ancient Egypt, Greece and China where deep manual pressure was used to treat pain.",
      benefits: ["Breaks down scar tissue and adhesions", "Relieves chronic muscle tension and pain", "Lowers blood pressure and heart rate", "Reduces stress hormone levels", "Supports rehabilitation after injury"],
      contraindications: ["Blood clotting disorders", "Increased risk of injury, such as bone fractures", "Nerve injury", "Older age", "Any recent surgery or chemotherapy", "Wounds or skin conditions", "Hernia"],
    },
  },
  {
    name: "Swedish Massage",
    image: "/service-swedish.jpg",
    description: "Classic full-body relaxation massage using long, flowing strokes to calm the nervous system.",
    prices: [{ duration: "60 min", price: "£70" }, { duration: "90 min", price: "£100" }],
    info: {
      origin: "Sweden, early 19th century.",
      history: "Developed by Swedish physiologist Pehr Henrik Ling in the 1820s, who synthesised techniques from Chinese, Egyptian, Greek and Roman healing traditions into a unified system. His 'Medical Gymnastics' laid the foundation for what became the most widely practised massage form in the Western world. It was introduced to the United States in the 1850s and has remained the cornerstone of modern massage therapy ever since.",
      intro: "Swedish massage promotes deep physical and mental relaxation by combining long, gliding strokes, kneading, and rhythmic tapping to ease muscle tension and boost circulation.",
      benefits: ["Promotes deep relaxation and stress relief", "Improves blood and lymphatic circulation", "Eases muscle tension and stiffness", "Boosts mood by releasing endorphins", "Supports better sleep quality"],
      extraSections: [
        {
          label: "Complementary Therapy",
          text: "Swedish massage serves as an excellent complementary therapy to help manage pain and discomfort associated with:",
          items: ["Lower back, neck, and shoulder strain", "Osteoarthritis and rheumatoid arthritis", "Fibromyalgia"],
        },
      ],
      contraindications: ["Fever or contagious illness", "Contagious skin conditions", "Blood clotting disorders or DVT", "Uncontrolled high blood pressure", "Recent surgery — please wait until cleared by your doctor"],
    },
  },
  {
    name: "Pregnancy Massage",
    image: "/service-pregnancy.jpg",
    description: "Gentle, nurturing massage tailored to support mothers-to-be through every trimester.",
    prices: [{ duration: "60 min", price: "£70" }],
    info: {
      origin: "Ancient traditions across Egypt, China and India; formalised as a Western practice in the 1980s.",
      history: "Massage during pregnancy has been documented in ancient Egyptian and Chinese texts. In the West, therapist Carole Osborne pioneered dedicated prenatal massage training in the 1980s, establishing the safety protocols and positioning techniques still used today. Research over the past 30 years has confirmed meaningful benefits for both mother and baby.",
      intro: "Pregnancy (prenatal) massage safely alleviates physical aches and reduces stress. It targets common discomforts like lower back pain and joint strain, improves circulation to reduce swelling, balances mood-regulating hormones, and promotes deeper sleep.",
      benefits: [
        "Pain & Tension Relief — eases muscle strain, sciatica, and joint aches that come with shifting posture and weight gain",
        "Reduced Swelling — stimulates the lymphatic system to flush excess fluids, minimising swelling in the hands and ankles",
        "Stress & Anxiety Reduction — decreases stress hormones while boosting serotonin to regulate mood and alleviate low mood",
        "Better Sleep — promotes physical relaxation that helps combat insomnia",
        "Improved Circulation — enhances blood flow, ensuring optimal oxygen and nutrient delivery to both you and your baby",
      ],
      extraSections: [
        { label: "Safety & Timing", text: "Most health providers recommend waiting until the second trimester (after 12 weeks) before beginning prenatal massage." },
      ],
      contraindications: ["High-risk pregnancy or history of miscarriage — please consult your midwife or doctor first", "Pre-eclampsia or high blood pressure", "Placenta praevia", "Severe swelling, sudden headaches or visual disturbances", "Deep vein thrombosis (DVT)"],
    },
  },
  {
    name: "Manual Lymphatic Drainage",
    image: "/service-lymphatic.jpg",
    description: "Light, rhythmic techniques to stimulate lymph flow, reduce swelling and support immunity.",
    prices: [{ duration: "60 min", price: "£70" }],
    info: {
      origin: "France, 1930s.",
      history: "Developed by Danish physiotherapist Emil Vodder and his wife Estrid while working in Cannes. Treating patients with chronic colds, Vodder noticed swollen lymph nodes and began experimenting with gentle, circular hand movements over them — contrary to the medical wisdom of the time. He presented his technique in Paris in 1936 to initial scepticism, but decades of clinical research have since established MLD as a cornerstone treatment in lymphoedema management and post-surgical care.",
      intro: "Manual Lymphatic Drainage (MLD) is a specialised, gentle medical massage technique designed to stimulate the flow of lymphatic fluid, helping reduce swelling and assist the body's natural waste-filtration processes.",
      benefits: ["Reduces oedema and post-surgical swelling", "Supports the immune system", "Aids the body's natural detoxification", "Reduces fatigue and brain fog", "Beneficial after cosmetic surgery or cancer treatment"],
      timing: [
        { label: "Best Time of Day", text: "Morning is generally the best time for MLD — it reduces facial and body puffiness, boosts energy, and moves fluids that have accumulated overnight." },
        { label: "Frequency", text: "For general wellness and detox, one session every 2–4 weeks is standard to support the immune system and maintain fluid balance." },
      ],
      hydration: "For the massage to be most effective, aim to be well-hydrated without feeling uncomfortably full. Drink 1–2 glasses of water 30–60 minutes before your session, and 1–2 litres in the hours after.",
      contraindications: ["Acute infections or fevers", "Uncontrolled congestive heart failure", "Active, untreated blood clots (DVT)", "Severe kidney or liver failure"],
      postSurgery: "MLD after liposuction accelerates healing by reducing swelling, bruising, and pain. It also helps prevent tissue hardening (fibrosis) and fluid pockets (seromas) by moving excess fluid toward the lymph nodes. Always get clearance from your surgeon — sessions typically begin within 24 to 72 hours post-operation.",
    },
  },
  {
    name: "Oncology Massage",
    image: "/service-oncology.jpg",
    description: "Specially adapted, gentle massage designed to safely support those living with or beyond cancer.",
    prices: [{ duration: "60 min", price: "£60" }],
    info: {
      origin: "Emerged as a formal discipline in the late 1990s and early 2000s in the United States and UK.",
      history: "For much of the 20th century, massage was contraindicated for cancer patients over fears of spreading disease — a concern now considered largely unfounded. Researcher and therapist Tracy Walton was instrumental in changing this, publishing studies demonstrating that carefully adapted massage is safe and beneficial. Oncology massage is now offered in leading cancer centres and hospices worldwide, with practitioners trained in specific modifications for those undergoing or recovering from treatment.",
      intro: "Oncology massage is a highly specialised, modified form of therapeutic touch tailored for people living with, recovering from, or moving beyond cancer. It focuses on safety and symptom relief — such as reducing anxiety, pain, and fatigue — by adapting techniques around surgical sites, medical devices, and treatment side effects. Because cancer treatments such as chemotherapy or radiation leave the body vulnerable, traditional or deep-tissue massage can sometimes be unsafe.",
      benefits: ["Reduces anxiety, pain and treatment-related fatigue", "Improves sleep and sense of wellbeing", "Eases nausea associated with chemotherapy", "Provides nurturing human connection during a difficult time", "Can be adapted for any stage of diagnosis or treatment"],
      contraindications: ["Active fever or acute infection", "Unstable medical condition — please check with your oncologist first", "Treatment site skin reactions (e.g. radiotherapy burns) — those areas will be avoided", "Severe thrombocytopaenia (very low platelets)", "Bone metastases — pressure over affected areas will be adapted or avoided"],
      seekingTreatment: "Before beginning any massage, you must consult your primary oncologist or care team for approval and clearance.",
    },
  },
];

type ExtraSection = { label: string; text?: string; items?: string[] };
type ServiceInfo = {
  origin: string; history: string; benefits: string[]; contraindications: string[];
  intro?: string; timing?: { label: string; text: string }[]; hydration?: string;
  postSurgery?: string; seekingTreatment?: string; extraSections?: ExtraSection[];
};

const InfoModal = ({ service, onClose }: { service: { name: string; info: ServiceInfo }; onClose: () => void }) => {
  const headingId = `modal-title-${service.name.replace(/\s+/g, "-").toLowerCase()}`;
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    // Move focus into modal and lock body scroll
    closeRef.current?.focus();
    document.body.style.overflow = "hidden";
    const handler = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", handler);
    return () => {
      document.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, []); // onClose is stable via useCallback in parent

  return (
    <div
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby={headingId}
      style={{ position: "fixed", inset: 0, zIndex: 500, background: "rgba(10,25,5,0.7)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}
    >
      <div onClick={e => e.stopPropagation()} style={{ background: "#fff", maxWidth: "560px", width: "100%", maxHeight: "85vh", overflowY: "auto", borderRadius: "3px", padding: "44px 40px", position: "relative", boxShadow: "0 24px 80px rgba(0,0,0,0.25)" }}>
        <button ref={closeRef} onClick={onClose} style={{ position: "absolute", top: "12px", right: "12px", background: "none", border: "none", cursor: "pointer", color: "#7A6B58", fontSize: "1.4rem", lineHeight: 1, padding: "8px 12px", minWidth: "44px", minHeight: "44px" }} aria-label="Close dialog">×</button>

        <div style={{ width: "24px", height: "1px", background: "#C4A45A", marginBottom: "16px" }} />
        <h3 id={headingId} style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.4rem", color: "#1E3D0E", fontWeight: 500, marginBottom: "24px" }}>{service.name}</h3>

        {service.info.intro && (
          <p style={{ fontSize: "1rem", color: "#5C3D1E", lineHeight: 1.75, fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, marginBottom: "24px" }}>{service.info.intro}</p>
        )}

        <p style={{ fontSize: "0.7rem", letterSpacing: "3px", color: "#8B6914", fontFamily: "'Playfair Display', serif", textTransform: "uppercase", marginBottom: "12px" }}>Benefits</p>
        <ul style={{ paddingLeft: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: "8px", marginBottom: "28px" }}>
          {service.info.benefits.map((b, i) => (
            <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: "10px", fontSize: "1rem", color: "#5C3D1E", lineHeight: 1.7, fontFamily: "'Cormorant Garamond', serif", fontWeight: 300 }}>
              <span style={{ color: "#C4A45A", marginTop: "2px", flexShrink: 0 }}>—</span>{b}
            </li>
          ))}
        </ul>

        {service.info.timing && (
          <div style={{ borderTop: "1px solid rgba(139,105,20,0.15)", paddingTop: "22px", marginBottom: "22px" }}>
            <p style={{ fontSize: "0.7rem", letterSpacing: "3px", color: "#8B6914", fontFamily: "'Playfair Display', serif", textTransform: "uppercase", marginBottom: "16px" }}>When to Book</p>
            {service.info.timing.map((t, i) => (
              <div key={i} style={{ marginBottom: "14px" }}>
                <p style={{ fontSize: "0.75rem", color: "#8B6914", fontFamily: "'Playfair Display', serif", fontWeight: 600, marginBottom: "4px" }}>{t.label}</p>
                <p style={{ fontSize: "1rem", color: "#5C3D1E", lineHeight: 1.75, fontFamily: "'Cormorant Garamond', serif", fontWeight: 300 }}>{t.text}</p>
              </div>
            ))}
          </div>
        )}

        {service.info.hydration && (
          <div style={{ borderTop: "1px solid rgba(139,105,20,0.15)", paddingTop: "22px", marginBottom: "22px" }}>
            <p style={{ fontSize: "0.7rem", letterSpacing: "3px", color: "#8B6914", fontFamily: "'Playfair Display', serif", textTransform: "uppercase", marginBottom: "12px" }}>Hydration</p>
            <p style={{ fontSize: "1rem", color: "#5C3D1E", lineHeight: 1.75, fontFamily: "'Cormorant Garamond', serif", fontWeight: 300 }}>{service.info.hydration}</p>
          </div>
        )}

        {service.info.extraSections?.map((s, i) => (
          <div key={i} style={{ borderTop: "1px solid rgba(139,105,20,0.15)", paddingTop: "22px", marginBottom: "22px" }}>
            <p style={{ fontSize: "0.7rem", letterSpacing: "3px", color: "#8B6914", fontFamily: "'Playfair Display', serif", textTransform: "uppercase", marginBottom: "12px" }}>{s.label}</p>
            {s.text && <p style={{ fontSize: "1rem", color: "#5C3D1E", lineHeight: 1.75, fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, marginBottom: s.items ? "12px" : 0 }}>{s.text}</p>}
            {s.items && (
              <ul style={{ paddingLeft: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: "8px" }}>
                {s.items.map((item, j) => (
                  <li key={j} style={{ display: "flex", alignItems: "flex-start", gap: "10px", fontSize: "1rem", color: "#5C3D1E", lineHeight: 1.7, fontFamily: "'Cormorant Garamond', serif", fontWeight: 300 }}>
                    <span style={{ color: "#C4A45A", marginTop: "2px", flexShrink: 0 }}>—</span>{item}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}

        <div style={{ borderTop: "1px solid rgba(139,105,20,0.15)", paddingTop: "22px" }}>
          <p style={{ fontSize: "0.7rem", letterSpacing: "3px", color: "#8B6914", fontFamily: "'Playfair Display', serif", textTransform: "uppercase", marginBottom: "12px" }}>Please consult your doctor before booking if you have</p>
          <ul style={{ paddingLeft: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: "8px", marginBottom: service.info.postSurgery ? "22px" : 0 }}>
            {service.info.contraindications.map((c, i) => (
              <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: "10px", fontSize: "1rem", color: "#5C3D1E", lineHeight: 1.7, fontFamily: "'Cormorant Garamond', serif", fontWeight: 300 }}>
                <span style={{ color: "#C4A45A", marginTop: "2px", flexShrink: 0 }}>—</span>{c}
              </li>
            ))}
          </ul>
        </div>

        {service.info.postSurgery && (
          <div style={{ borderTop: "1px solid rgba(139,105,20,0.15)", paddingTop: "22px" }}>
            <p style={{ fontSize: "0.7rem", letterSpacing: "3px", color: "#8B6914", fontFamily: "'Playfair Display', serif", textTransform: "uppercase", marginBottom: "12px" }}>After Surgery</p>
            <p style={{ fontSize: "1rem", color: "#5C3D1E", lineHeight: 1.75, fontFamily: "'Cormorant Garamond', serif", fontWeight: 300 }}>{service.info.postSurgery}</p>
          </div>
        )}

        {service.info.seekingTreatment && (
          <div style={{ borderTop: "1px solid rgba(139,105,20,0.15)", paddingTop: "22px" }}>
            <p style={{ fontSize: "0.7rem", letterSpacing: "3px", color: "#8B6914", fontFamily: "'Playfair Display', serif", textTransform: "uppercase", marginBottom: "12px" }}>Seeking Treatment</p>
            <p style={{ fontSize: "1rem", color: "#5C3D1E", lineHeight: 1.75, fontFamily: "'Cormorant Garamond', serif", fontWeight: 300 }}>{service.info.seekingTreatment}</p>
          </div>
        )}
      </div>
    </div>
  );
};

const PhoenixIcon = ({ size = 112 }: { size?: number; color?: string }) => (
  <img src="/phoenix-logo.png" alt="Phoenix" width={size} height={size} loading="lazy" style={{ display: "block", margin: "0 auto", objectFit: "contain" }} />
);

const LeafDecor = ({ style }: { style?: React.CSSProperties }) => (
  <svg viewBox="0 0 80 120" fill="none" xmlns="http://www.w3.org/2000/svg" style={style}>
    <path d="M40 110 C40 110 5 80 8 45 C10 20 25 5 40 10 C55 5 70 20 72 45 C75 80 40 110 40 110Z" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.5"/>
    <line x1="40" y1="110" x2="40" y2="10" stroke="currentColor" strokeWidth="1" opacity="0.3"/>
    <line x1="40" y1="85" x2="15" y2="55" stroke="currentColor" strokeWidth="0.8" opacity="0.25"/>
    <line x1="40" y1="75" x2="65" y2="48" stroke="currentColor" strokeWidth="0.8" opacity="0.25"/>
    <line x1="40" y1="60" x2="18" y2="38" stroke="currentColor" strokeWidth="0.8" opacity="0.2"/>
    <line x1="40" y1="50" x2="62" y2="30" stroke="currentColor" strokeWidth="0.8" opacity="0.2"/>
  </svg>
);

const WaIcon = ({ size = 22 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="white">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

function useScrollAnimation() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("visible");
        });
      },
      { threshold: 0.1 }
    );
    document.querySelectorAll(".fade-up").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

export default function App() {
  useScrollAnimation();
  const [activeInfo, setActiveInfo] = useState<typeof services[0] | null>(null);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const closeModal = useCallback(() => setActiveInfo(null), []);

  useEffect(() => {
    const onScroll = () => {
      const next = window.scrollY > window.innerHeight * 0.6;
      setScrolled(prev => prev === next ? prev : next);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    let currentVersion: string | null = null;
    const check = async () => {
      try {
        const res = await fetch(`/version.json?t=${Date.now()}`);
        const data = await res.json();
        if (currentVersion === null) { currentVersion = data.v; return; }
        if (data.v !== currentVersion) window.location.reload();
      } catch { /* offline or error — ignore */ }
    };
    check();
    const id = setInterval(check, 5 * 60 * 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", backgroundColor: "#F5F0E8", minHeight: "100vh" }}>
      <SeoHead />
      {activeInfo && <InfoModal service={activeInfo} onClose={closeModal} />}
      {showPrivacy && <PrivacyPolicy onClose={() => setShowPrivacy(false)} />}
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }

        .fade-up { opacity: 0; transform: translateY(28px); transition: opacity 0.7s ease, transform 0.7s ease; }
        .fade-up.visible { opacity: 1; transform: translateY(0); }

        .service-card { background: #fff; border: 1px solid rgba(74,103,65,0.15); transition: transform 0.3s ease, box-shadow 0.3s ease; }
        .service-card:hover { transform: translateY(-5px); box-shadow: 0 16px 48px rgba(30,61,14,0.13); }

        .wa-btn { background: #25D366; color: #fff; display: inline-flex; align-items: center; gap: 10px; padding: 16px 36px; border-radius: 50px; font-size: 1.1rem; font-family: 'Playfair Display', serif; font-weight: 500; letter-spacing: 0.5px; text-decoration: none; transition: background 0.2s, transform 0.2s, box-shadow 0.2s; box-shadow: 0 4px 20px rgba(37,211,102,0.35); }
        .wa-btn:hover { background: #1da851; transform: translateY(-2px); box-shadow: 0 8px 28px rgba(37,211,102,0.45); }

        /* Floating right WA button — desktop only, shown when scrolled past hero */
        .wa-float-left { position: fixed; right: 0; top: 50%; transform: translateY(-50%); z-index: 200; display: flex; flex-direction: column; align-items: center; background: #25D366; color: #fff; text-decoration: none; border-radius: 8px 0 0 8px; padding: 14px 8px 14px 10px; gap: 8px; box-shadow: -3px 0 16px rgba(37,211,102,0.3); transition: background 0.2s, padding 0.2s; }
        .wa-float-left:hover { background: #1da851; padding-left: 14px; }
        .wa-float-left span { writing-mode: vertical-rl; transform: rotate(180deg); font-family: 'Playfair Display', serif; font-size: 0.7rem; letter-spacing: 2px; text-transform: uppercase; font-weight: 500; opacity: 0.9; }
        @media (max-width: 768px) { .wa-float-left { display: none; } }

        /* Mobile WA icon in nav top-left */
        .wa-nav-icon { display: none; align-items: center; justify-content: center; background: #25D366; border-radius: 50%; width: 34px; height: 34px; flex-shrink: 0; }
        @media (max-width: 768px) { .wa-nav-icon { display: flex; } }

        nav a { text-decoration: none; font-family: 'Cormorant Garamond', serif; font-size: 1rem; letter-spacing: 0.3px; opacity: 0.85; transition: opacity 0.2s, color 0.4s; }
        nav a:hover { opacity: 1; }
        @media (max-width: 520px) { .nav-hide-sm { display: none; } }
        @media (max-width: 400px) { nav { padding: 14px 16px; } }

        .price-pill { background: #EDE6D4; border: 1px solid rgba(139,105,20,0.2); padding: 6px 14px; border-radius: 50px; font-size: 0.9rem; color: #5C3D1E; font-family: 'Playfair Display', serif; }

        .grid-services { display: grid; grid-template-columns: repeat(auto-fill, minmax(290px, 1fr)); gap: 24px; }

        .info-btn { background: none; border: 1.5px solid #C4A45A; color: #C4A45A; border-radius: 50%; width: 20px; height: 20px; font-size: 0.7rem; font-family: 'Playfair Display', serif; font-style: italic; font-weight: 600; cursor: pointer; display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0; transition: background 0.2s, color 0.2s; vertical-align: middle; padding: 0; line-height: 1; position: relative; }
        .info-btn::before { content: ''; position: absolute; inset: -12px; border-radius: 50%; }
        .info-btn:hover { background: #C4A45A; color: #fff; }

        /* Circular hero badge — desktop size */
        .hero-badge { width: 240px; height: 240px; }

        /* Circular hero badge — mobile size */
        @media (max-width: 600px) {
          .grid-services { grid-template-columns: 1fr; }
          .hero-badge { width: 190px; height: 190px; }
        }
      `}</style>

      {/* Floating WA button — desktop left side, visible when scrolled past hero */}
      {scrolled && (
        <a href="https://wa.me/447735550042" className="wa-float-left" target="_blank" rel="noopener noreferrer" aria-label="Book via WhatsApp">
          <WaIcon size={20} />
          <span>Book</span>
        </a>
      )}

      {/* Navigation */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, background: scrolled ? "rgba(245,240,232,0.96)" : "rgba(20,40,10,0.55)", backdropFilter: "blur(10px)", borderBottom: scrolled ? "1px solid rgba(74,103,65,0.12)" : "1px solid rgba(255,255,255,0.1)", padding: "15px 32px", display: "flex", justifyContent: "space-between", alignItems: "center", transition: "background 0.4s, border-color 0.4s" }}>
        <a href="#" onClick={e => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }} style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontWeight: 500, color: scrolled ? "#1E3D0E" : "#fff", fontSize: "1.1rem", letterSpacing: "0.5px", transition: "color 0.4s", textDecoration: "none", cursor: "pointer" }}>Restore & Relax</a>
        <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
          <a href="#services" className="nav-hide-sm" style={{ color: scrolled ? "#1E3D0E" : "#fff" }}>Services</a>
          <a href="#coverage" className="nav-hide-sm" style={{ color: scrolled ? "#1E3D0E" : "#fff" }}>Area</a>
          <a href="#reviews" className="nav-hide-sm" style={{ color: scrolled ? "#1E3D0E" : "#fff" }}>Reviews</a>
          <a href="#about" className="nav-hide-sm" style={{ color: scrolled ? "#1E3D0E" : "#fff" }}>About</a>
          {/* Desktop: text link. Mobile: WA icon */}
          <a href="#book" className="nav-hide-sm" style={{ color: scrolled ? "#1E3D0E" : "#fff" }}>Book</a>
          <a href="https://wa.me/447735550042" className="wa-nav-icon" target="_blank" rel="noopener noreferrer" aria-label="Book via WhatsApp">
            <WaIcon size={18} />
          </a>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="hero-section" style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden", paddingTop: "80px", paddingBottom: "60px", backgroundSize: "cover", backgroundPosition: "center 30%" }}>
        {/* Dark green overlay */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(160deg, rgba(20,45,10,0.72) 0%, rgba(30,61,14,0.65) 50%, rgba(45,80,20,0.60) 100%)", zIndex: 0 }} />
        <LeafDecor style={{ position: "absolute", top: "60px", left: "12px", width: "80px", color: "#fff", opacity: 0.18, zIndex: 1 }} />
        <LeafDecor style={{ position: "absolute", bottom: "60px", right: "12px", width: "80px", color: "#fff", opacity: 0.18, transform: "scaleX(-1) rotate(15deg)", zIndex: 1 }} />
        <LeafDecor style={{ position: "absolute", top: "25%", right: "6%", width: "52px", color: "#fff", opacity: 0.12, transform: "rotate(25deg)", zIndex: 1 }} />
        <LeafDecor style={{ position: "absolute", bottom: "25%", left: "6%", width: "52px", color: "#fff", opacity: 0.12, transform: "scaleX(-1) rotate(-15deg)", zIndex: 1 }} />

        <div style={{ textAlign: "center", position: "relative", padding: "0 20px", zIndex: 2 }}>

          {/* Visually hidden — page's primary heading, otherwise only present as text baked into the badge image */}
          <h1 style={{ position: "absolute", width: "1px", height: "1px", padding: 0, margin: "-1px", overflow: "hidden", clip: "rect(0,0,0,0)", whiteSpace: "nowrap", border: 0 }}>
            Restore & Relax — Mobile Massage Therapy by Iulia in Woking & Surrey
          </h1>

          {/* ── Circular badge logo ── */}
          <div className="hero-badge" style={{ position: "relative", display: "inline-block" }}>
            <img
              src="/phoenix-badge.png"
              alt="Restore & Relax — Massage Therapy"
              style={{ display: "block", width: "100%", height: "100%", objectFit: "contain", filter: "drop-shadow(0 2px 16px rgba(0,0,0,0.5))" }}
            />
          </div>

          {/* "by IULIA" below the badge */}
          <div style={{ marginTop: "10px" }}>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: "1rem", color: "#EDC74C", letterSpacing: "1px", marginBottom: "2px" }}>by</p>
            <p style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: "1.6rem", color: "#EDC74C", letterSpacing: "8px", textTransform: "uppercase" }}>Iulia</p>
          </div>

          {/* Tagline */}
          <p style={{ marginTop: "24px", fontSize: "1.1rem", color: "rgba(255,255,255,0.82)", fontStyle: "italic", maxWidth: "360px", margin: "24px auto 0", lineHeight: 1.75 }}>
            Professional massage therapy, delivered to your door.
          </p>

          {/* CTA */}
          <div style={{ marginTop: "36px" }}>
            <a href="#book" className="wa-btn" style={{ fontSize: "1.05rem" }}>
              <WaIcon size={22} /> Book via WhatsApp
            </a>
          </div>
        </div>

        {/* Scroll indicator */}
        <div style={{ position: "absolute", bottom: "28px", left: "50%", transform: "translateX(-50%)", textAlign: "center", opacity: 0.55, zIndex: 2 }}>
          <p style={{ fontSize: "0.65rem", letterSpacing: "3px", color: "#fff", fontFamily: "'Playfair Display', serif", marginBottom: "8px" }}>SCROLL</p>
          <svg width="18" height="10" viewBox="0 0 18 10" fill="none" xmlns="http://www.w3.org/2000/svg">
            <polyline points="1,1 9,9 17,1" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
          </svg>
        </div>
      </section>

      {/* ── ABOUT ── */}
      <section id="about" style={{ padding: "88px 24px", background: "#fff", textAlign: "center" }}>
        <div style={{ maxWidth: "660px", margin: "0 auto" }} className="fade-up">
          <p style={{ fontSize: "0.7rem", letterSpacing: "4px", color: "#8B6914", fontFamily: "'Playfair Display', serif", marginBottom: "18px", textTransform: "uppercase" }}>Welcome</p>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontWeight: 300, fontSize: "clamp(1.9rem, 5vw, 2.7rem)", color: "#1E3D0E", lineHeight: 1.3, marginBottom: "24px" }}>
            Healing hands, brought to you
          </h2>
          <div style={{ width: "36px", height: "1px", background: "#C4A45A", margin: "0 auto 28px" }} />
          <p style={{ fontSize: "1.1rem", color: "#5C3D1E", lineHeight: 1.95, fontWeight: 300 }}>
            I'm Iulia, a fully qualified massage therapist with a passion for restoring balance to body and mind. Whether you're recovering from sport, managing chronic tension, or simply craving deep relaxation — I bring a personalised, professional treatment directly to your home.
          </p>
          <p style={{ fontSize: "1.1rem", color: "#5C3D1E", lineHeight: 1.95, fontWeight: 300, marginTop: "18px" }}>
            Every session is tailored to your specific needs, delivered in the comfort and privacy of your own space — no travel, no waiting rooms, just pure restoration.
          </p>
        </div>
      </section>

      {/* ── SERVICES ── */}
      <section id="services" style={{ padding: "88px 24px", background: "#F5F0E8" }}>
        <div style={{ maxWidth: "1080px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "56px" }} className="fade-up">
            <p style={{ fontSize: "0.7rem", letterSpacing: "4px", color: "#8B6914", fontFamily: "'Playfair Display', serif", marginBottom: "16px", textTransform: "uppercase" }}>Treatments</p>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontWeight: 300, fontSize: "clamp(1.9rem, 5vw, 2.7rem)", color: "#1E3D0E" }}>
              Services & Pricing
            </h2>
            <div style={{ width: "36px", height: "1px", background: "#C4A45A", margin: "18px auto 0" }} />
          </div>

          <div className="grid-services">
            {services.map((service, i) => (
              <div
                key={service.name}
                className="service-card fade-up"
                style={{ padding: 0, borderRadius: "3px", transitionDelay: `${i * 70}ms`, overflow: "hidden" }}
              >
                {service.image && (
                  <div style={{ position: "relative", aspectRatio: "16/9", overflow: "hidden" }}>
                    <img
                      src={service.image}
                      alt={service.name}
                      loading="lazy"
                      style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                    />
                    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.45) 0%, transparent 50%)" }} />
                    <img
                      src="/phoenix-logo.png"
                      alt=""
                      aria-hidden="true"
                      style={{ position: "absolute", bottom: "8px", right: "10px", width: "36px", height: "36px", opacity: 0.85, filter: "drop-shadow(0 1px 3px rgba(0,0,0,0.6))" }}
                    />
                  </div>
                )}
                <div style={{ padding: "22px 26px 26px" }}>
                  <div style={{ width: "24px", height: "1px", background: "#C4A45A", marginBottom: "14px" }} />
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
                    <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.15rem", color: "#1E3D0E", fontWeight: 500 }}>
                      {service.name}
                    </h3>
                    <button className="info-btn" onClick={() => setActiveInfo(service)} aria-label={`About ${service.name}`} title="History & benefits">i</button>
                  </div>
                  <p style={{ fontSize: "0.95rem", color: "#7A6B58", lineHeight: 1.75, marginBottom: "18px", fontStyle: "italic", fontWeight: 300 }}>
                    {service.description}
                  </p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                    {service.prices.map((p) => (
                      <span key={p.duration} className="price-pill">
                        {p.duration} — <strong style={{ color: "#1E3D0E", fontWeight: 600 }}>{p.price}</strong>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Deep Tissue advisory */}
          <div className="fade-up" style={{ marginTop: "24px", borderLeft: "3px solid #C4A45A", background: "#FAFAF7", border: "1px solid rgba(139,105,20,0.15)", borderLeftWidth: "3px", borderLeftColor: "#C4A45A", borderRadius: "3px", padding: "32px 36px" }}>
            <p style={{ fontSize: "0.65rem", letterSpacing: "3.5px", color: "#8B6914", fontFamily: "'Playfair Display', serif", textTransform: "uppercase", marginBottom: "14px" }}>Deep Tissue Massage — Please Read</p>
            <p style={{ fontSize: "1.05rem", color: "#5C3D1E", lineHeight: 1.85, fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, marginBottom: "22px" }}>
              Deep tissue massage targets the inner layers of muscles and connective tissues using slow, firm strokes and direct pressure. It is highly effective for relieving chronic pain, breaking up scar tissue, and improving mobility, but it can trigger temporary side effects like localised soreness and mild fatigue. Always communicate your pain tolerance clearly with your therapist — the pressure should feel intense but never sharply painful.
            </p>
            <p style={{ fontSize: "0.9rem", color: "#7A6B58", fontFamily: "'Playfair Display', serif", fontWeight: 500, marginBottom: "14px" }}>
              Please consult your doctor before booking if you have any of the following:
            </p>
            <ul style={{ paddingLeft: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: "8px" }}>
              {["A blood clotting disorder", "Increased risk of injury, such as bone fractures", "Nerve injury", "Older age", "Any recent surgery or chemotherapy", "Wounds or skin conditions", "Hernia"].map((item, i) => (
                <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: "12px", fontSize: "1rem", color: "#5C3D1E", lineHeight: 1.7, fontFamily: "'Cormorant Garamond', serif", fontWeight: 300 }}>
                  <span style={{ color: "#C4A45A", marginTop: "2px", flexShrink: 0 }}>—</span>{item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── COVERAGE AREA ── */}
      <section id="coverage" style={{ padding: "88px 24px", background: "#fff" }}>
        <div style={{ maxWidth: "1080px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "48px" }} className="fade-up">
            <p style={{ fontSize: "0.7rem", letterSpacing: "4px", color: "#8B6914", fontFamily: "'Playfair Display', serif", marginBottom: "16px", textTransform: "uppercase" }}>Where I Work</p>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontWeight: 300, fontSize: "clamp(1.9rem, 5vw, 2.7rem)", color: "#1E3D0E" }}>
              Coverage Area
            </h2>
            <div style={{ width: "36px", height: "1px", background: "#C4A45A", margin: "18px auto 24px" }} />
            <p style={{ fontSize: "1.1rem", color: "#5C3D1E", lineHeight: 1.85, fontWeight: 300, maxWidth: "620px", margin: "0 auto" }}>
              Based in <strong style={{ fontWeight: 500, color: "#1E3D0E" }}>Woking</strong>, I cover a 10 mile radius bringing professional massage therapy directly to your home. Whether you're in Guildford, Camberley, Weybridge, Cobham, Leatherhead, Byfleet or the surrounding villages — I come to you.
            </p>
            <p style={{ fontSize: "1rem", color: "#7A6B58", lineHeight: 1.8, fontWeight: 300, maxWidth: "560px", margin: "16px auto 0", fontStyle: "italic" }}>
              Not sure if you're in range? Just send me a message on WhatsApp and I'll confirm.
            </p>
          </div>

          <div className="fade-up" style={{ borderRadius: "3px", overflow: "hidden", border: "1px solid rgba(74,103,65,0.15)", boxShadow: "0 4px 24px rgba(30,61,14,0.08)" }}>
            <CoverageMap />
          </div>

          {/* Town chips */}
          <div className="fade-up" style={{ marginTop: "32px", display: "flex", flexWrap: "wrap", gap: "10px", justifyContent: "center" }}>
            {["Woking", "Guildford", "Camberley", "Weybridge", "Cobham", "Oxshott", "Chobham", "Leatherhead", "Byfleet", "West Byfleet", "Farnborough", "Aldershot", "Fleet", "Send", "Ripley", "Pyrford"].map(town => (
              <span key={town} style={{ background: "#EDE6D4", border: "1px solid rgba(139,105,20,0.2)", padding: "6px 16px", borderRadius: "50px", fontSize: "0.85rem", color: "#5C3D1E", fontFamily: "'Playfair Display', serif" }}>
                {town}
              </span>
            ))}
          </div>
        </div>
      </section>

      <Reviews onPrivacyClick={() => setShowPrivacy(true)} />

      {/* ── BOOKING CTA ── */}
      <section id="book" style={{ padding: "96px 24px", background: "linear-gradient(140deg, #1E3D0E 0%, #2D5A1A 55%, #3A7022 100%)", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <LeafDecor style={{ position: "absolute", top: "-10px", left: "-8px", width: "110px", color: "#fff", opacity: 0.06, transform: "rotate(-5deg)" }} />
        <LeafDecor style={{ position: "absolute", bottom: "-10px", right: "-8px", width: "110px", color: "#fff", opacity: 0.06, transform: "scaleX(-1) rotate(-5deg)" }} />

        <div className="fade-up" style={{ position: "relative" }}>
          <PhoenixIcon size={80} color="#C4A45A" />
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontWeight: 300, fontSize: "clamp(2rem, 5vw, 3rem)", color: "#fff", marginTop: "8px", marginBottom: "16px" }}>
            Ready to restore & relax?
          </h2>
          <p style={{ fontSize: "1.1rem", color: "rgba(255,255,255,0.72)", maxWidth: "460px", margin: "0 auto 40px", lineHeight: 1.8, fontStyle: "italic" }}>
            Message me on WhatsApp to check availability and arrange your session. I'll come to you.
          </p>
          <a href="https://wa.me/447735550042" className="wa-btn" target="_blank" rel="noopener noreferrer" style={{ fontSize: "1.15rem", padding: "18px 44px" }}>
            <WaIcon size={26} /> Message on WhatsApp
          </a>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background: "#111", padding: "40px 24px", textAlign: "center" }}>
        <PhoenixIcon size={44} color="#C4A45A" />
        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: "1.3rem", color: "#EDE6D4", marginTop: "10px", marginBottom: "6px" }}>
          Restore & Relax
        </p>
        <p style={{ fontSize: "0.7rem", letterSpacing: "3px", color: "#7A6B58", fontFamily: "'Playfair Display', serif", textTransform: "uppercase" }}>
          Massage Therapy by Iulia
        </p>
        <p style={{ marginTop: "16px", fontSize: "0.75rem", color: "#555", fontFamily: "'Playfair Display', serif" }}>
          <button onClick={() => setShowPrivacy(true)} style={{ background: "none", border: "none", color: "#7A9B70", cursor: "pointer", fontFamily: "'Playfair Display', serif", fontSize: "0.75rem", textDecoration: "underline", padding: 0 }}>
            Privacy Policy
          </button>
          <span style={{ margin: "0 8px", color: "#444" }}>·</span>
          <a href="/admin.html" style={{ color: "#7A9B70", fontFamily: "'Playfair Display', serif", fontSize: "0.75rem", textDecoration: "underline" }}>
            Admin
          </a>
        </p>
        <p style={{ marginTop: "12px", fontSize: "0.7rem", color: "#444", fontFamily: "'Playfair Display', serif", letterSpacing: "1px" }}>
          &copy; 2026 Mobile Massage
        </p>
      </footer>
    </div>
  );
}
