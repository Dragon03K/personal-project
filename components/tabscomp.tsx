"use client";

import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoginForm } from "./login-form";
import { GalleryVerticalEnd } from "lucide-react";
import { RegisterForm } from "./register-form";

export function TabsDemo() {
  return (
    <Tabs defaultValue="login" className="w-[400px]">
      <TabsList>
        <TabsTrigger value="login">Login</TabsTrigger>
        <TabsTrigger value="register">Register</TabsTrigger>
      </TabsList>
      <TabsContent value="login">
        <Card>
          <div className="flex items-center gap-2 self-center font-medium">
            <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
              <GalleryVerticalEnd className="size-4" />
            </div>
            Personal Project
          </div>
          <LoginForm />
        </Card>
      </TabsContent>
      <TabsContent value="register">
        <Card>
          <div className="flex items-center gap-2 self-center font-medium">
            <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
              <GalleryVerticalEnd className="size-4" />
            </div>
            Personal Project
          </div>
          <RegisterForm />
        </Card>
      </TabsContent>
    </Tabs>
  );
}
