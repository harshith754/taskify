// components/UserPriorityChart.tsx
"use client";

import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Task, User } from "@/types";

interface Props {
  user: User;
  tasks: Task[];
}

const getChartData = (tasks: Task[]) => {
  const priorities = ["low", "medium", "high"];

  return priorities.map((priority) => ({
    priority,
    tasks: tasks.filter((task) => task.priority === priority).length,
  }));
};

const UserPriorityChart: React.FC<Props> = ({ user, tasks }) => {
  const data = getChartData(tasks);

  return (
    <div className="w-full">
      <Card className="h-full">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">
            {user.name.split(" ")[0]}&apos;s Task Priority
          </CardTitle>
        </CardHeader>
        <CardContent className="h-[180px] sm:h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <XAxis
                dataKey="priority"
                fontSize={11}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                fontSize={11}
                tickLine={false}
                axisLine={false}
                allowDecimals={false}
              />
              <Tooltip
                contentStyle={{ fontSize: "0.75rem" }}
                labelStyle={{ fontSize: "0.75rem" }}
              />
              <Bar
                dataKey="tasks"
                fill="var(--chart-2)"
                radius={[4, 4, 0, 0]}
                barSize={24}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserPriorityChart;