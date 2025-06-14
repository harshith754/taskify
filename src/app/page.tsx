"use client";

import { Button } from "@/components/ui/button";
import { SignInButton } from "@clerk/nextjs";
import { CheckCircle, Clock, Bug, LayoutDashboard } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <main className="flex-1 flex flex-col items-center justify-center px-6 text-center">
        <h2 className="text-4xl md:text-5xl font-bold mt-10">
          Track Tasks. Fix Bugs. Stay Productive.
        </h2>
        <p className="mt-4 max-w-xl text-lg text-muted-foreground">
          Taskify helps developers and managers streamline task and bug
          workflows, track progress, and log time—all in one dashboard.
        </p>

        <div className="flex mt-8 gap-4 items-center">
          <SignInButton mode="modal">
            <Button size="lg" className="px-6">
              Get Started
            </Button>
          </SignInButton>
          <a href="#features">
            <Button variant="link" className="text-base p-0 h-auto">
              Learn More →
            </Button>
          </a>
        </div>

        {/* Features Section */}
        <section id="features" className="mt-20 max-w-4xl w-full">
          <h3 className="text-2xl font-semibold mb-8 text-left">
            Key Features
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
            <FeatureCard
              icon={<LayoutDashboard className="text-primary" />}
              title="Role-based Dashboard"
              description="Developers and managers get tailored views with relevant tools."
            />
            <FeatureCard
              icon={<CheckCircle className="text-primary" />}
              title="Task & Bug Management"
              description="Assign, update, and track issues with detailed metadata and approval flows."
            />
            <FeatureCard
              icon={<Clock className="text-primary" />}
              title="Time Tracking"
              description="Log and monitor time spent on each task or bug efficiently."
            />
            <FeatureCard
              icon={<Bug className="text-primary" />}
              title="Bug Impact & Priority"
              description="Set criticality, steps to reproduce, and environment info with each bug."
            />
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-20 py-4 text-sm text-muted-foreground text-center border-t">
        © 2025 Taskify. Built with ❤️ using Next.js & ShadCN UI.
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start space-x-4 bg-muted p-4 rounded-xl shadow-sm">
      <div className="p-2 bg-muted-foreground/10 rounded-full">{icon}</div>
      <div>
        <h4 className="font-semibold text-lg">{title}</h4>
        <p className="text-muted-foreground mt-1">{description}</p>
      </div>
    </div>
  );
}
