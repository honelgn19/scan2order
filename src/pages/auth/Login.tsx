/* =============================================
   PAGE NAME: Login
   FILE PATH: src/pages/auth/Login.tsx
   CONNECTED WITH FIREBASE AUTH
   ============================================= */

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Checkbox } from "../../components/ui/checkbox";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { BedDouble, UtensilsCrossed } from "lucide-react";

import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../lib/firebase";
import { doc, getDoc } from "firebase/firestore";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true);
    setError("");

    try {
      // Firebase login
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential.user;

      // Get role from Firestore
      const userDoc = await getDoc(
        doc(db, "users", user.uid)
      );

      if (!userDoc.exists()) {
        throw new Error("User profile not found");
      }

      const userData = userDoc.data();

      // Always convert role to lowercase
      const role = userData.role?.toLowerCase();

      console.log("Logged in user:", user.email);
      console.log("User role:", role);

      alert(`Login successful as ${role}`);

      // Role based navigation
      switch (role) {
        case "admin":
          navigate("/admin");
          break;

        case "kitchen":
          navigate("/staff/kitchen");
          break;

        case "waiter":
          navigate("/staff/waiter");
          break;

        case "cashier":
          navigate("/staff/cashier");
          break;

        default:
          setError("Invalid user role");
          navigate("/login");
      }

    } catch (err: any) {
      console.error("Login error:", err);

      if (err.code === "auth/invalid-credential") {
        setError("Invalid email or password");
      } else {
        setError(
          err.message || "Login failed. Please try again."
        );
      }

    } finally {
      setIsLoading(false);
    }
  };


  return (
    <Card className="w-full border-0 shadow-2xl bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl">

      <CardHeader className="space-y-6 text-center pb-8">

        <div className="mx-auto flex items-center justify-center gap-3">

          <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600">

            <div className="flex">
              <BedDouble className="h-9 w-9 text-white" />
              <UtensilsCrossed className="h-9 w-9 text-white -ml-1" />
            </div>

          </div>

          <div>
            <h1 className="text-4xl font-bold">
              Bright Day
            </h1>

            <p className="text-amber-600 dark:text-amber-500 text-sm">
              GRAND HOTEL & RESTAURANT
            </p>
          </div>

        </div>


        <CardTitle className="text-2xl">
          Welcome Back
        </CardTitle>

        <p className="text-zinc-500">
          Sign in to access your dashboard
        </p>

      </CardHeader>


      <CardContent>

        <form
          onSubmit={handleLogin}
          className="space-y-5"
        >

          {error && (
            <div className="bg-red-500/10 text-red-500 text-sm p-3 rounded-lg border border-red-500/30">
              {error}
            </div>
          )}


          <div>
            <Label>Email Address</Label>

            <Input
              type="email"
              placeholder="admin@lumina.com"
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
              required
              className="h-12 mt-2"
            />

          </div>


          <div>

            <Label>Password</Label>

            <Input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
              required
              className="h-12 mt-2"
            />

          </div>


          <div className="flex items-center space-x-2">

            <Checkbox
              checked={rememberMe}
              onCheckedChange={(checked)=>
                setRememberMe(!!checked)
              }
            />

            <Label>
              Remember me
            </Label>

          </div>


          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-12 bg-gradient-to-r from-amber-600 to-orange-600"
          >

            {
              isLoading
              ? "Signing in..."
              : "Sign In"
            }

          </Button>


        </form>

      </CardContent>

    </Card>
  );
}