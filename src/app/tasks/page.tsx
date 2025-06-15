"use client";

import React, { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { Badge } from "@/components/ui/badge";
import UserTaskChart from "@/components/taskcharts/UserTaskChart";
import UserPriorityChart from "@/components/taskcharts/UserPriorityChart";
import TaskFiltersAndTable from "@/components/TaskFiltersAndTable";
import {
  ClipboardList,
  Clock,
  CheckCircle,
} from "lucide-react";

const TasksPage = () => {
  const users = useSelector((state: RootState) => state.user);
  const currentUser = users.find((u) => u.isCurrentUser);
  const allTasks = useSelector((state: RootState) => state.tasks);

  const tasks =
    currentUser?.role === "manager"
      ? allTasks
      : allTasks.filter((task) => task.assigneeId === currentUser?.id);

  const isManager = currentUser?.role === "manager";

  const pendingTasks = tasks.filter((task) => task.status !== "closed");
  const completedTasks = tasks.filter((task) => task.status === "closed");

  return (
    <div className="px-4 sm:px-6 md:px-8 py-6 max-w-7xl mx-auto space-y-6">
      <h1 className="text-xl sm:text-2xl font-bold text-primary tracking-tight">
        Task Dashboard
      </h1>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-border border rounded-md overflow-hidden text-sm text-muted-foreground">
        <div className="flex items-center gap-3 px-4 py-3">
          <ClipboardList className="w-4 h-4 text-primary" />
          <span className="text-muted-foreground">
            Total Tasks: <span className="font-medium text-foreground">{tasks.length}</span>
          </span>
        </div>
        <div className="flex items-center gap-3 px-4 py-3">
          <Clock className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
          <span>
            Pending: <span className="font-medium text-foreground">{pendingTasks.length}</span>
          </span>
        </div>
        <div className="flex items-center gap-3 px-4 py-3">
          <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
          <span>
            Completed: <span className="font-medium text-foreground">{completedTasks.length}</span>
          </span>
        </div>
      </div>

      {/* Charts */}
      <div className="flex flex-wrap -mx-2">
        {isManager ? (
          users.map((user) => (
            <div key={user.id} className="px-2 w-full sm:w-1/2 xl:w-1/3 mb-4">
              <UserTaskChart
                user={user}
                tasks={allTasks.filter((t) => t.assigneeId === user.id)}
              />
            </div>
          ))
        ) : (
          <>
            <div className="px-2 w-full sm:w-1/2 xl:w-1/3 mb-4">
              <UserTaskChart tasks={tasks} user={currentUser!} />
            </div>
            <div className="px-2 w-full sm:w-1/2 xl:w-1/3 mb-4">
              <UserPriorityChart tasks={tasks} user={currentUser!} />
            </div>
          </>
        )}
      </div>

      {/* Table & Filters */}
      <TaskFiltersAndTable />
    </div>
  );
};

export default TasksPage;
