"use client";
import { useState } from "react";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const [error, setError] = useState("");

  const handleAuth = async (isLogin: boolean) => {
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      router.push("/chat");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-black text-white">
      <Card className="w-[400px] border-zinc-800 bg-zinc-950 text-white">
        <CardHeader>
          <CardTitle>Welcome Back</CardTitle>
          <CardDescription>Login or create an account to continue.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-zinc-900">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Signup</TabsTrigger>
            </TabsList>
            
            <div className="space-y-4 mt-4">
              <Input 
                placeholder="Email" 
                className="bg-zinc-900 border-zinc-700"
                onChange={(e) => setEmail(e.target.value)} 
              />
              <Input 
                type="password" 
                placeholder="Password" 
                className="bg-zinc-900 border-zinc-700"
                onChange={(e) => setPassword(e.target.value)}
              />
              {error && <p className="text-red-500 text-sm">{error}</p>}
            </div>

            <TabsContent value="login">
              <Button className="w-full mt-4 bg-blue-600 hover:bg-blue-700" onClick={() => handleAuth(true)}>
                Login
              </Button>
            </TabsContent>
            <TabsContent value="register">
              <Button className="w-full mt-4 bg-green-600 hover:bg-green-700" onClick={() => handleAuth(false)}>
                Create Account
              </Button>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}