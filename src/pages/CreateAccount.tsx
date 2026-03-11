import { supabase } from "@/lib/supabase";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import { useLanguage } from "@/contexts/LanguageContext";
import { useUser } from "@/contexts/UserContext";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";
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

  // ================= SIGN UP =================
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
        .insert([
          {
            full_name: form.full_name.trim(),
            phone_number: form.phone_number.trim(),
            email: form.email || null,
            address: form.address || null,
            language,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      setUser(data);
      navigate("/dashboard");
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // ================= SIGN IN =================
  const handleSignIn = async () => {
    if (!form.phone_number.trim()) {
      toast({ title: t("phone_required"), variant: "destructive" });
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("phone_number", form.phone_number.trim())
        .single();

      if (error || !data) {
        toast({ title: t("user_not_found"), variant: "destructive" });
        return;
      }

      setUser(data);
      navigate("/dashboard");
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold">
              {isSignIn ? t("sign_in") : t("create_account")}
            </CardTitle>
            <CardDescription>
              {isSignIn ? t("sign_in_with_phone") : t("join_community")}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {!isSignIn && (
              <Input
                placeholder={t("full_name")}
                value={form.full_name}
                onChange={(e) =>
                  handleChange("full_name", e.target.value)
                }
              />
            )}

            <Input
              placeholder={t("phone_number")}
              value={form.phone_number}
              onChange={(e) =>
                handleChange("phone_number", e.target.value)
              }
            />

            {!isSignIn && (
              <>
                <Input
                  placeholder={t("email")}
                  value={form.email}
                  onChange={(e) =>
                    handleChange("email", e.target.value)
                  }
                />

                <Input
                  placeholder={t("address")}
                  value={form.address}
                  onChange={(e) =>
                    handleChange("address", e.target.value)
                  }
                />
              </>
            )}

            <Button
              onClick={isSignIn ? handleSignIn : handleSignUp}
              disabled={loading}
              className="w-full"
            >
              {loading
                ? "Loading..."
                : isSignIn
                ? t("sign_in")
                : t("sign_up")}
            </Button>

            <p className="text-center text-sm">
              {isSignIn ? t("new_user") : t("already_have_account")}
              <button
                onClick={() => setIsSignIn(!isSignIn)}
                className="ml-2 underline"
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