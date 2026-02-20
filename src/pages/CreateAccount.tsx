import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { useUser } from "@/contexts/UserContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const CreateAccount = () => {
  const { t, language } = useLanguage();
  const { setUser } = useUser();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSignIn, setIsSignIn] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    full_name: "",
    phone_number: "",
    email: "",
    address: "",
  });

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSignUp = async () => {
    if (!form.full_name.trim()) {
      toast({ title: t("name_required"), variant: "destructive" });
      return;
    }
    if (!form.phone_number.trim()) {
      toast({ title: t("phone_required"), variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("users")
        .insert({
          full_name: form.full_name.trim(),
          phone_number: form.phone_number.trim(),
          email: form.email.trim() || null,
          address: form.address.trim() || null,
          language,
        })
        .select()
        .single();

      if (error) throw error;

      setUser(data);
      navigate("/dashboard");
    } catch (err: any) {
      toast({
        title: t("error"),
        description: err.message || "Failed to create account",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async () => {
    if (!form.phone_number.trim()) {
      toast({ title: t("phone_required"), variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("users")
        .select()
        .eq("phone_number", form.phone_number.trim())
        .single();

      if (error || !data) {
        toast({ title: t("user_not_found"), variant: "destructive" });
        return;
      }

      setUser(data);
      navigate("/dashboard");
    } catch (err: any) {
      toast({ title: t("error"), variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      {/* Decorative top border */}
      <div className="fixed left-0 right-0 top-0 h-1.5 bg-gradient-to-r from-saffron via-gold to-saffron" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <Card className="border-2 border-border shadow-lg">
          <CardHeader className="text-center">
            <div className="mx-auto mb-2 h-1 w-16 rounded-full bg-gradient-to-r from-saffron to-gold" />
            <CardTitle className="font-display text-3xl font-bold text-secondary">
              {isSignIn ? t("sign_in") : t("create_account")}
            </CardTitle>
            <CardDescription className="font-body text-muted-foreground">
              {isSignIn ? t("sign_in_with_phone") : t("join_community")}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!isSignIn && (
              <div className="space-y-2">
                <Label htmlFor="name" className="font-body font-medium">
                  {t("full_name")} *
                </Label>
                <Input
                  id="name"
                  value={form.full_name}
                  onChange={(e) => handleChange("full_name", e.target.value)}
                  placeholder={t("full_name")}
                  className="border-border focus:ring-primary"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="phone" className="font-body font-medium">
                {t("phone_number")} *
              </Label>
              <Input
                id="phone"
                type="tel"
                value={form.phone_number}
                onChange={(e) => handleChange("phone_number", e.target.value)}
                placeholder={t("phone_number")}
                className="border-border focus:ring-primary"
              />
            </div>

            {!isSignIn && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="email" className="font-body font-medium">
                    {t("email")}
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    placeholder={t("email")}
                    className="border-border focus:ring-primary"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address" className="font-body font-medium">
                    {t("address")}
                  </Label>
                  <Input
                    id="address"
                    value={form.address}
                    onChange={(e) => handleChange("address", e.target.value)}
                    placeholder={t("address")}
                    className="border-border focus:ring-primary"
                  />
                </div>
              </>
            )}

            <Button
              onClick={isSignIn ? handleSignIn : handleSignUp}
              disabled={loading}
              className="w-full bg-primary py-6 font-body text-lg font-semibold text-primary-foreground hover:bg-primary/90"
            >
              {loading ? t("loading") : isSignIn ? t("sign_in") : t("sign_up")}
            </Button>

            <p className="text-center font-body text-sm text-muted-foreground">
              {isSignIn ? t("new_user") : t("already_have_account")}{" "}
              <button
                onClick={() => setIsSignIn(!isSignIn)}
                className="font-semibold text-primary underline-offset-2 hover:underline"
              >
                {isSignIn ? t("create_one") : t("sign_in")}
              </button>
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default CreateAccount;
