"use client";

import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import {
  Bug,
} from "@/types";
import {
  BugIcon,
  AlertTriangle,
  CheckCircle2,
  Plus,
} from "lucide-react";
import BugFiltersAndTable from "@/components/BugFiltersAndTable";
import UserBugChart from "@/components/bugcharts/UserBugChart";
import Link from "next/link";
import { Button } from "@/components/ui/button";



const UserSeverityChart = ({ user, bugs }: { user: any; bugs: Bug[] }) => (
  <div className="bg-muted rounded-md h-60 flex items-center justify-center text-sm text-muted-foreground">
    Severity Chart for {user.name}
  </div>
);

const BugsPage = () => {
  const users = useSelector((state: RootState) => state.user);
  const currentUser = users.find((u) => u.isCurrentUser);
  const allBugs = useSelector((state: RootState) => state.bugs as Bug[]);

  const bugs =
    currentUser?.role === "manager"
      ? allBugs
      : allBugs.filter((bug) => bug.assigneeId === currentUser?.id);

  const isManager = currentUser?.role === "manager";

  const openBugs = bugs.filter((bug) => bug.status !== "closed");
  const resolvedBugs = bugs.filter((bug) => bug.status === "closed");

  return (
    <div className="px-4 sm:px-6 md:px-8 py-6 max-w-7xl mx-auto space-y-6">
      <h1 className="text-xl sm:text-2xl font-bold text-primary tracking-tight">
        Bug Dashboard
      </h1>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-border border rounded-md overflow-hidden text-sm text-muted-foreground">
        <div className="flex items-center gap-3 px-4 py-3">
          <BugIcon className="w-4 h-4 text-primary" />
          <span>
            Total Bugs: <span className="font-medium text-foreground">{bugs.length}</span>
          </span>
        </div>
        <div className="flex items-center gap-3 px-4 py-3">
          <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400" />
          <span>
            Open: <span className="font-medium text-foreground">{openBugs.length}</span>
          </span>
        </div>
        <div className="flex items-center gap-3 px-4 py-3">
          <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
          <span>
            Resolved: <span className="font-medium text-foreground">{resolvedBugs.length}</span>
          </span>
        </div>
      </div>

      {/* Charts */}
      <div className="flex flex-wrap -mx-2">
        {isManager ? (
          users.map((user) => (
            <div key={user.id} className="px-2 w-full sm:w-1/2 xl:w-1/3 mb-4">
              <UserBugChart
                user={user}
                bugs={allBugs.filter((b) => b.assigneeId === user.id)}
              />
            </div>
          ))
        ) : (
          <>
            <div className="px-2 w-full sm:w-1/2 xl:w-1/3 mb-4">
              <UserBugChart bugs={bugs} user={currentUser!} />
            </div>
            <div className="px-2 w-full sm:w-1/2 xl:w-1/3 mb-4">
              <UserSeverityChart bugs={bugs} user={currentUser!} />
            </div>
          </>
        )}
      </div>

      {/* Table & Filters */}
      <BugFiltersAndTable />
      
      <Link href="/bugs/add" className="fixed bottom-6 right-6">
        <Button className="rounded-full h-12 w-12 p-0 shadow-lg" size="icon">
          <Plus className="w-8 h-8" />
        </Button>
      </Link>
    </div>
  );
};

export default BugsPage;
