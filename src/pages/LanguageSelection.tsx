import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { useUser } from "@/contexts/UserContext";
import type { Language } from "@/i18n/translations";
import ghatHero from "@/assets/ghat-hero.jpg";

const languages: { code: Language; label: string }[] = [
  { code: "te", label: "తెలుగు" },
  { code: "hi", label: "हिन्दी" },
  { code: "en", label: "English" },
];

const LanguageSelection = () => {
  const navigate = useNavigate();
  const { setLanguage } = useLanguage();
  const { user } = useUser();

  const handleSelect = (lang: Language) => {
    setLanguage(lang);
    if (user) {
      navigate("/dashboard");
    } else {
      navigate("/signup");
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${ghatHero})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70" />

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 flex flex-col items-center gap-8 px-6 text-center"
      >
        {/* Decorative top line */}
        <div className="h-1 w-24 rounded-full bg-gradient-to-r from-saffron to-gold" />

        <h1 className="font-display text-5xl font-bold tracking-tight text-cream drop-shadow-lg md:text-7xl">
          🙏 PushkarAssist
        </h1>

        <p className="max-w-md font-body text-lg text-cream/80 md:text-xl">
          Your companion for the sacred Pushkaralu festival
        </p>

        <p className="font-body text-base text-cream/70">
          Select Your Language / మీ భాషను ఎంచుకోండి / अपनी भाषा चुनें
        </p>

        <div className="flex flex-col gap-4 sm:flex-row">
          {languages.map((lang, i) => (
            <motion.button
              key={lang.code}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.15, duration: 0.5 }}
              onClick={() => handleSelect(lang.code)}
              className="min-w-[180px] rounded-lg border-2 border-saffron/40 bg-gradient-to-br from-saffron/20 to-gold/10 px-8 py-4 font-body text-xl font-semibold text-cream backdrop-blur-sm transition-all hover:scale-105 hover:border-gold hover:from-saffron/40 hover:to-gold/20 hover:shadow-[0_0_30px_hsl(27_100%_50%_/_0.3)]"
            >
              {lang.label}
            </motion.button>
          ))}
        </div>

        {/* Decorative bottom line */}
        <div className="h-1 w-24 rounded-full bg-gradient-to-r from-gold to-saffron" />
      </motion.div>
    </div>
  );
};

export default LanguageSelection;
