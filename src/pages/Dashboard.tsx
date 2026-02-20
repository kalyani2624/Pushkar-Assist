import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { useUser } from "@/contexts/UserContext";
import { Camera, Search, Calendar, MapPin, Users, Phone, Car, Bed, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import ghatHero from "@/assets/ghat-hero.jpg";
import { useEffect } from "react";

const featureCards = [
  { key: "posts", icon: Camera, route: "/posts" },
  { key: "missing_items", icon: Search, route: "/missing-items" },
  { key: "events", icon: Calendar, route: "/events" },
  { key: "visit_places", icon: MapPin, route: "/visit-places" },
  { key: "crowd_detection", icon: Users, route: "/crowd-detection" },
  { key: "rooms", icon: Bed, route: "/rooms" },
  { key: "helpline", icon: Phone, route: "/helpline" },
  { key: "transport", icon: Car, route: "/transport" },
];

const Dashboard = () => {
  const { t } = useLanguage();
  const { user, logout } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) navigate("/");
  }, [user, navigate]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Banner */}
      <div className="relative h-48 overflow-hidden md:h-64">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${ghatHero})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/40" />
        <div className="relative z-10 flex h-full flex-col items-center justify-center gap-2 px-4 text-center">
          <h1 className="font-display text-3xl font-bold text-cream drop-shadow-lg md:text-4xl">
            🙏 PushkarAssist
          </h1>
          <p className="font-body text-lg text-cream/90 md:text-xl">
            {t("welcome_user", { name: user.full_name })}
          </p>
        </div>
        {/* Logout */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            logout();
            navigate("/");
          }}
          className="absolute right-4 top-4 z-10 font-body text-cream/80 hover:bg-cream/10 hover:text-cream"
        >
          <LogOut className="mr-1.5 h-4 w-4" />
          {t("logout")}
        </Button>
      </div>

      {/* Decorative divider */}
      <div className="h-1.5 bg-gradient-to-r from-saffron via-gold to-saffron" />

      {/* Feature Grid */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {featureCards.map((card, i) => (
            <motion.button
              key={card.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
              onClick={() => navigate(card.route)}
              className="group flex flex-col items-center gap-3 rounded-xl border-2 border-border bg-card p-6 shadow-sm transition-all hover:scale-[1.03] hover:border-primary hover:shadow-[var(--shadow-warm)]"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-md transition-transform group-hover:scale-110">
                <card.icon className="h-7 w-7" />
              </div>
              <h3 className="font-display text-base font-semibold text-card-foreground md:text-lg">
                {t(card.key)}
              </h3>
              <p className="font-body text-xs text-muted-foreground md:text-sm">
                {t(`${card.key}_desc`)}
              </p>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
