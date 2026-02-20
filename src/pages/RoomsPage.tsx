import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { useUser } from "@/contexts/UserContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Bed, Users, Phone, MapPin, Star, Wifi, Car, Coffee } from "lucide-react";
import { useEffect } from "react";

interface Room {
  id: number;
  name: string;
  type: string;
  sharing: number;
  pricePerNight: number;
  location: string;
  rating: number;
  amenities: string[];
  phone: string;
  available: boolean;
  image: string;
}

const rooms: Room[] = [
  {
    id: 1,
    name: "Pushkar Heritage Dharamshala",
    type: "dharamshala",
    sharing: 4,
    pricePerNight: 200,
    location: "Near Brahma Temple",
    rating: 4.2,
    amenities: ["wifi", "parking"],
    phone: "+91 98765 43210",
    available: true,
    image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&q=80",
  },
  {
    id: 2,
    name: "Ghat View Guest House",
    type: "guest_house",
    sharing: 2,
    pricePerNight: 800,
    location: "Pushkar Lake Ghat",
    rating: 4.5,
    amenities: ["wifi", "breakfast", "parking"],
    phone: "+91 98765 43211",
    available: true,
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&q=80",
  },
  {
    id: 3,
    name: "Sri Venkateswara Lodge",
    type: "lodge",
    sharing: 3,
    pricePerNight: 500,
    location: "Main Bazaar Road",
    rating: 3.8,
    amenities: ["wifi"],
    phone: "+91 98765 43212",
    available: true,
    image: "https://images.unsplash.com/photo-1590490360182-c33d955c0fd2?w=400&q=80",
  },
  {
    id: 4,
    name: "Pushkar Palace Hotel",
    type: "hotel",
    sharing: 2,
    pricePerNight: 1500,
    location: "Near Pushkar Lake",
    rating: 4.7,
    amenities: ["wifi", "breakfast", "parking"],
    phone: "+91 98765 43213",
    available: true,
    image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=400&q=80",
  },
  {
    id: 5,
    name: "Mela Ground Tent Stay",
    type: "tent",
    sharing: 4,
    pricePerNight: 300,
    location: "Pushkar Mela Ground",
    rating: 4.0,
    amenities: ["parking"],
    phone: "+91 98765 43214",
    available: true,
    image: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=400&q=80",
  },
  {
    id: 6,
    name: "Rajasthani Haveli Stay",
    type: "haveli",
    sharing: 2,
    pricePerNight: 1200,
    location: "Old City, Pushkar",
    rating: 4.6,
    amenities: ["wifi", "breakfast"],
    phone: "+91 98765 43215",
    available: false,
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&q=80",
  },
  {
    id: 7,
    name: "Budget Dormitory",
    type: "dormitory",
    sharing: 6,
    pricePerNight: 150,
    location: "Bus Stand Area",
    rating: 3.5,
    amenities: ["wifi"],
    phone: "+91 98765 43216",
    available: true,
    image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400&q=80",
  },
  {
    id: 8,
    name: "Lakeside Cottage",
    type: "cottage",
    sharing: 2,
    pricePerNight: 2000,
    location: "Pushkar Lake View",
    rating: 4.8,
    amenities: ["wifi", "breakfast", "parking"],
    phone: "+91 98765 43217",
    available: true,
    image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&q=80",
  },
];

const amenityIcons: Record<string, typeof Wifi> = {
  wifi: Wifi,
  parking: Car,
  breakfast: Coffee,
};

const RoomsPage = () => {
  const { t } = useLanguage();
  const { user } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) navigate("/");
  }, [user, navigate]);

  if (!user) return null;

  const getSharingLabel = (sharing: number) => {
    if (sharing === 1) return t("single_room");
    return `${sharing} ${t("sharing")}`;
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      dharamshala: "bg-green-100 text-green-800",
      guest_house: "bg-blue-100 text-blue-800",
      lodge: "bg-yellow-100 text-yellow-800",
      hotel: "bg-purple-100 text-purple-800",
      tent: "bg-orange-100 text-orange-800",
      haveli: "bg-pink-100 text-pink-800",
      dormitory: "bg-gray-100 text-gray-800",
      cottage: "bg-teal-100 text-teal-800",
    };
    return colors[type] || "bg-muted text-muted-foreground";
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-20 flex items-center gap-3 bg-card/95 px-4 py-3 shadow-sm backdrop-blur">
        <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <Bed className="h-5 w-5 text-primary" />
        <h1 className="font-display text-xl font-bold text-secondary">{t("rooms")}</h1>
      </div>
      <div className="h-1 bg-gradient-to-r from-saffron via-gold to-saffron" />

      {/* Info Banner */}
      <div className="container mx-auto max-w-2xl px-4 pt-4">
        <div className="rounded-xl bg-primary/10 p-3 text-center">
          <p className="font-body text-sm font-medium text-primary">
            🏨 {t("rooms_info")}
          </p>
        </div>
      </div>

      {/* Room Cards */}
      <div className="container mx-auto max-w-2xl px-4 py-4">
        <div className="space-y-4">
          {rooms.map((room, i) => (
            <motion.div
              key={room.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06, duration: 0.4 }}
            >
              <Card className="overflow-hidden border-border transition-shadow hover:shadow-[var(--shadow-warm)]">
                <div className="flex flex-col sm:flex-row">
                  {/* Image */}
                  <div className="relative h-48 w-full sm:h-auto sm:w-40 shrink-0">
                    <img
                      src={room.image}
                      alt={room.name}
                      className="h-full w-full object-cover"
                    />
                    {!room.available && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                        <span className="rounded-full bg-destructive px-3 py-1 font-body text-xs font-bold text-destructive-foreground">
                          {t("sold_out")}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <CardContent className="flex flex-1 flex-col justify-between p-4">
                    <div>
                      <div className="mb-2 flex flex-wrap items-center gap-2">
                        <h3 className="font-display text-base font-bold text-card-foreground">
                          {room.name}
                        </h3>
                        <Badge variant="outline" className={`text-[10px] ${getTypeColor(room.type)}`}>
                          {t(`room_${room.type}`)}
                        </Badge>
                      </div>

                      <div className="mb-2 flex items-center gap-1 text-muted-foreground">
                        <MapPin className="h-3.5 w-3.5" />
                        <span className="font-body text-xs">{room.location}</span>
                      </div>

                      <div className="mb-3 flex flex-wrap items-center gap-3">
                        <div className="flex items-center gap-1">
                          <Users className="h-3.5 w-3.5 text-primary" />
                          <span className="font-body text-xs font-semibold text-primary">
                            {getSharingLabel(room.sharing)}
                          </span>
                        </div>
                        <div className="flex items-center gap-0.5">
                          <Star className="h-3.5 w-3.5 fill-accent text-accent" />
                          <span className="font-body text-xs font-medium">{room.rating}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          {room.amenities.map((a) => {
                            const Icon = amenityIcons[a];
                            return Icon ? (
                              <Icon key={a} className="h-3.5 w-3.5 text-muted-foreground" />
                            ) : null;
                          })}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-display text-lg font-bold text-primary">
                          ₹{room.pricePerNight}
                        </span>
                        <span className="font-body text-xs text-muted-foreground">/{t("night")}</span>
                      </div>
                      <Button
                        size="sm"
                        disabled={!room.available}
                        onClick={() => window.open(`tel:${room.phone}`, "_self")}
                        className="gap-1.5"
                      >
                        <Phone className="h-3.5 w-3.5" />
                        {t("call_now")}
                      </Button>
                    </div>
                  </CardContent>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RoomsPage;
