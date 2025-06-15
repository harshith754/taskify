"use client";

import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import TaskAndBugAreaCharts from "@/components/TaskAndBugsAreaChart";
import { useRouter } from "next/navigation";

const DashboardPage = () => {
  const users = useSelector((state: RootState) => state.user);
  const currentUser = users.find((u) => u.isCurrentUser);

  const tasks = useSelector((state: RootState) =>
    currentUser?.role === "manager"
      ? state.tasks
      : state.tasks.filter((task) => task.assigneeId === currentUser?.id)
  );

  const bugs = useSelector((state: RootState) =>
    currentUser?.role === "manager"
      ? state.bugs
      : state.bugs.filter((bug) => bug.assigneeId === currentUser?.id)
  );

  const router = useRouter();
  return (
    <div className="px-4 sm:px-6 md:px-8 py-6 max-w-7xl mx-auto space-y-5">
      <div className="space-y-1">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-primary">
          Welcome {currentUser?.name}!
        </h1>
      </div>
      {/* Task + Bug Charts */}
      <TaskAndBugAreaCharts />
      {/* Tasks Section */}
      <section>
        <div className="flex flex-row items-center justify-between mb-3 gap-2">
          <h2 className="text-lg sm:text-xl font-semibold">Your Tasks</h2>
          <Link href="/tasks">
            <Button variant="outline" className="w-auto text-xs sm:text-sm">
              View All Tasks
            </Button>
          </Link>
        </div>

        {tasks.length === 0 ? (
          <p className="text-muted-foreground text-sm">No tasks assigned.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {tasks.slice(0, 3).map((task) => (
              <Card
                key={task.id}
                className="hover:shadow-md transition-shadow duration-200 cursor-pointer"
                onClick={() => {
                  router.push(`/tasks/${task.id}`);
                }}
              >
                <CardContent className="py-0 space-y-1">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium text-sm sm:text-base">
                      {task.title}
                    </h3>
                    <Badge variant="outline" className="text-xs capitalize">
                      {task.status}
                    </Badge>
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">
                    {task.description || "No description provided."}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* Bugs Section */}
      <section>
        <div className="flex flex-row items-center justify-between mb-3 gap-2">
          <h2 className="text-lg sm:text-xl font-semibold">Your Bugs</h2>
          <Link href="/bugs">
            <Button variant="outline" className="w-auto text-xs sm:text-sm">
              View All Bugs
            </Button>
          </Link>
        </div>

        {bugs.length === 0 ? (
          <p className="text-muted-foreground text-sm">No bugs assigned.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {bugs.slice(0, 3).map((bug) => (
              <Card
                key={bug.id}
                className="hover:shadow-md transition-shadow duration-200 cursor-pointer"
                onClick={() => {
                  router.push(`/bugs/${bug.id}`);
                }}
              >
                <CardContent className="py-0 space-y-1">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium text-sm sm:text-base">
                      {bug.title}
                    </h3>
                    <Badge
                      variant={
                        bug.severity === "critical"
                          ? "destructive"
                          : bug.severity === "high"
                          ? "default"
                          : "outline"
                      }
                      className="text-xs capitalize"
                    >
                      {bug.severity}
                    </Badge>
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">
                    {bug.description || "No description provided."}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default DashboardPage;
