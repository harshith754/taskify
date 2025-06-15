"use client";

import type React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { BugIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Bug {
  id: string;
  title: string;
  status: string;
  priority: "low" | "medium" | "high" | "critical";
  endDate?: string;
  createdAt: string;
}

interface User {
  id: string;
  name: string;
  email: string;
}

interface Props {
  user: User;
  bugs: Bug[];
}

const getChartData = (bugs: Bug[]) => {
  const now = new Date();
  const today = now.toISOString().split("T")[0];

  // Get start of current week (Sunday)
  const thisWeekStart = new Date(now);
  thisWeekStart.setDate(now.getDate() - now.getDay());
  thisWeekStart.setHours(0, 0, 0, 0);

  // Get start of current month
  const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  // Get start of last month for comparison
  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

  const countBugs = (filterFn: (bug: Bug) => boolean) =>
    bugs.filter(filterFn).length;

  const todayCount = countBugs((bug) => {
    if (!bug.endDate) return false;
    const date = new Date(bug.endDate);
    if (isNaN(date.getTime())) return false;
    return date.toISOString().split("T")[0] === today;
  });

  const thisWeekCount = countBugs((bug) => {
    if (!bug.endDate) return false;
    const date = new Date(bug.endDate);
    return !isNaN(date.getTime()) && date >= thisWeekStart;
  });

  const thisMonthCount = countBugs((bug) => {
    if (!bug.endDate) return false;
    const date = new Date(bug.endDate);
    return !isNaN(date.getTime()) && date >= thisMonthStart;
  });

  const lastMonthCount = countBugs((bug) => {
    if (!bug.endDate) return false;
    const date = new Date(bug.endDate);
    return (
      !isNaN(date.getTime()) && date >= lastMonthStart && date <= lastMonthEnd
    );
  });

  return {
    chartData: [
      { period: "Today", bugs: todayCount, fill: "var(--color-today)" },
      { period: "This Week", bugs: thisWeekCount, fill: "var(--color-week)" },
      {
        period: "This Month",
        bugs: thisMonthCount,
        fill: "var(--color-month)",
      },
    ],
    comparison: {
      thisMonth: thisMonthCount,
      lastMonth: lastMonthCount,
    },
  };
};

const getPriorityStats = (bugs: Bug[]) => {
  const resolvedBugs = bugs.filter((bug) => bug.endDate);
  const priorityCount = {
    critical: resolvedBugs.filter((bug) => bug.priority === "critical").length,
    high: resolvedBugs.filter((bug) => bug.priority === "high").length,
    medium: resolvedBugs.filter((bug) => bug.priority === "medium").length,
    low: resolvedBugs.filter((bug) => bug.priority === "low").length,
  };
  return priorityCount;
};

const chartConfig = {
  bugs: {
    label: "Bugs Resolved",
  },
  today: {
    label: "Today",
    color: "var(--chart-1)",
  },
  week: {
    label: "This Week",
    color: "var(--chart-2)",
  },
  month: {
    label: "This Month",
    color: "var(--chart-3)",
  },
} satisfies ChartConfig;

const UserBugChart: React.FC<Props> = ({ user, bugs }) => {
  const { chartData } = getChartData(bugs);
  const priorityStats = getPriorityStats(bugs);

  const firstName = user.name.split(" ")[0];

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm sm:text-md font-semibold flex items-center gap-2">
            <BugIcon className="h-5 w-5 text-muted-foreground" />
            {firstName}&apos;s Bug Resolution
          </CardTitle>
        </div>
      </CardHeader>

      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{
              top: 20,
              right: 20,
              bottom: 20,
              left: 20,
            }}
          >
            <CartesianGrid
              vertical={false}
              strokeDasharray="3 3"
              opacity={0.4}
            />
            <XAxis
              dataKey="period"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              className="text-xs"
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              allowDecimals={false}
              className="text-xs"
            />
            <ChartTooltip
              cursor={{ fill: "rgba(0, 0, 0, 0.05)" }}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar
              dataKey="bugs"
              strokeWidth={2}
              radius={[6, 6, 0, 0]}
              fill="var(--color-month)"
            />
          </BarChart>
        </ChartContainer>

        {/* Priority Breakdown */}
        <div className="mt-6 pt-4 border-t">
          <h4 className="text-sm font-medium mb-3">Priority Breakdown</h4>
          <div className="flex flex-wrap gap-2">
            {priorityStats.critical > 0 && (
              <Badge variant="destructive" className="text-xs">
                Critical: {priorityStats.critical}
              </Badge>
            )}
            {priorityStats.high > 0 && (
              <Badge
                variant="secondary"
                className="text-xs bg-orange-100 text-orange-800 hover:bg-orange-200"
              >
                High: {priorityStats.high}
              </Badge>
            )}
            {priorityStats.medium > 0 && (
              <Badge
                variant="secondary"
                className="text-xs bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
              >
                Medium: {priorityStats.medium}
              </Badge>
            )}
            {priorityStats.low > 0 && (
              <Badge
                variant="secondary"
                className="text-xs bg-green-100 text-green-800 hover:bg-green-200"
              >
                Low: {priorityStats.low}
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserBugChart;
