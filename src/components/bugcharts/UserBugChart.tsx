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
import { Bug, User } from "@/types";

interface Props {
  user: User;
  bugs: Bug[];
}

const getChartData = (bugs: Bug[]) => {
  const now = new Date();
  const today = now.toISOString().split("T")[0];

  const thisWeekStart = new Date(now);
  thisWeekStart.setDate(now.getDate() - now.getDay());

  const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const count = (filterFn: (d: Date) => boolean) =>
    bugs.filter((bug) => {
      const date = bug.endDate ? new Date(bug.endDate) : null;
      return date && filterFn(date);
    }).length;

  return [
    {
      period: "Today",
      bugs: count((d) => d.toISOString().split("T")[0] === today),
    },
    {
      period: "This Week",
      bugs: count((d) => d >= thisWeekStart),
    },
    {
      period: "This Month",
      bugs: count((d) => d >= thisMonthStart),
    },
  ];
};

const UserBugChart: React.FC<Props> = ({ user, bugs }) => {
  const data = getChartData(bugs);

  return (
    <div className="w-full">
      <Card className="h-full">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">
            {user.name.split(" ")[0]}'s Bug Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="h-[180px] sm:h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <XAxis
                dataKey="period"
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
                dataKey="bugs"
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

export default UserBugChart;
