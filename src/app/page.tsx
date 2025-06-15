"use client";
import { Button } from "@/components/ui/button";
import { SignInButton, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { CheckCircle, Clock, Bug, LayoutDashboard } from "lucide-react";

export default function LandingPage() {
  const { isSignedIn } = useUser();
  const router = useRouter();

  const handleGetStarted = () => {
    if (isSignedIn) {
      router.push("/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col gap-0">
      <main className="flex-1 flex flex-col items-center justify-center px-2 sm:px-6 lg:px-8 py-10 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl lg:mt-5 font-bold tracking-tight text-primary mb-6">
            Track Tasks. Fix Bugs. Stay Productive.
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg sm:text-base text-muted-foreground leading-relaxed">
            Taskify helps developers and managers streamline task and bug
            workflows, track progress, and log time—all in one dashboard.
          </p>

          <div className="flex flex-col sm:flex-row mt-8 gap-4 items-center justify-center">
            {isSignedIn ? (
              <Button
                size="lg"
                className="px-6 py-2 text-sm w-full sm:w-auto"
                onClick={handleGetStarted}
              >
                Get Started
              </Button>
            ) : (
              <SignInButton mode="modal">
                <Button
                  size="lg"
                  className="px-6 py-2 text-sm w-full sm:w-auto"
                >
                  Get Started
                </Button>
              </SignInButton>
            )}
            <a href="#features" className="w-full sm:w-auto">
              <Button
                variant="link"
                className="text-sm p-0 h-auto w-full sm:w-auto"
              >
                Learn More →
              </Button>
            </a>
          </div>
        </div>

        {/* Features Section */}
        <section
          id="features"
          className="mt-16 max-w-6xl w-full"
        >
          <h3 className="text-lg sm:text-xl font-semibold mb-6 sm:mb-8 text-center lg:text-left">
            Key Features
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            <FeatureCard
              icon={<LayoutDashboard className="text-primary w-5 h-5" />}
              title="Role-based Dashboard"
              description="Developers and managers get tailored views with relevant tools and insights."
            />
            <FeatureCard
              icon={<CheckCircle className="text-primary w-5 h-5" />}
              title="Task & Bug Management"
              description="Assign, update, and track issues with detailed metadata and approval flows."
            />
            <FeatureCard
              icon={<Clock className="text-primary w-5 h-5" />}
              title="Time Tracking"
              description="Log and monitor time spent on each task or bug efficiently and accurately."
            />
            <FeatureCard
              icon={<Bug className="text-primary w-5 h-5" />}
              title="Bug Impact & Priority"
              description="Set criticality, steps to reproduce, and environment info with each bug report."
            />
          </div>
        </section>
       
      </main>
       <footer className="mt-16 sm:mt-20 py-6 sm:py-8 text-xs sm:text-sm text-muted-foreground text-center border-t px-4">
          <p>© 2025 Taskify. Built with ❤️ using Next.js & ShadCN UI.</p>
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
    <div className="flex items-start space-x-4 bg-muted/50 p-6 rounded-xl shadow-sm border border-border/50 hover:bg-muted/70 transition-colors">
      <div className="p-3 bg-primary/10 rounded-lg flex-shrink-0 mt-1">
        {icon}
      </div>
      <div className="flex-1 text-left">
        <h4 className="font-semibold text-base mb-2 text-foreground">
          {title}
        </h4>
        <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}
