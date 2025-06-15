"use client";

import type React from "react";
import {
  Card,
  CardContent,
  CardFooter,
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
import { TrendingUp, TrendingDown, CheckSquare } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Task {
  id: string;
  title: string;
  status: string;
  priority: "low" | "medium" | "high" | "urgent";
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
  tasks: Task[];
}

const getChartData = (tasks: Task[]) => {
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

  const countTasks = (filterFn: (task: Task) => boolean) =>
    tasks.filter(filterFn).length;

  const todayCount = countTasks((task) => {
    if (!task.endDate) return false;
    const date = new Date(task.endDate);
    return !isNaN(date.getTime()) && date.toISOString().split("T")[0] === today;
  });

  const thisWeekCount = countTasks((task) => {
    if (!task.endDate) return false;
    const date = new Date(task.endDate);
    return !isNaN(date.getTime()) && date >= thisWeekStart;
  });

  const thisMonthCount = countTasks((task) => {
    if (!task.endDate) return false;
    const date = new Date(task.endDate);
    return !isNaN(date.getTime()) && date >= thisMonthStart;
  });

  const lastMonthCount = countTasks((task) => {
    if (!task.endDate) return false;
    const date = new Date(task.endDate);
    return (
      !isNaN(date.getTime()) && date >= lastMonthStart && date <= lastMonthEnd
    );
  });

  return {
    chartData: [
      { period: "Today", tasks: todayCount, fill: "var(--color-today)" },
      { period: "This Week", tasks: thisWeekCount, fill: "var(--color-week)" },
      {
        period: "This Month",
        tasks: thisMonthCount,
        fill: "var(--color-month)",
      },
    ],
    comparison: {
      thisMonth: thisMonthCount,
      lastMonth: lastMonthCount,
    },
  };
};

const getPriorityStats = (tasks: Task[]) => {
  const completedTasks = tasks.filter((task) => task.endDate);
  const priorityCount = {
    urgent: completedTasks.filter((task) => task.priority === "urgent").length,
    high: completedTasks.filter((task) => task.priority === "high").length,
    medium: completedTasks.filter((task) => task.priority === "medium").length,
    low: completedTasks.filter((task) => task.priority === "low").length,
  };
  return priorityCount;
};

const chartConfig = {
  tasks: {
    label: "Tasks Completed",
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

const UserTaskChart: React.FC<Props> = ({ user, tasks }) => {
  const { chartData, comparison } = getChartData(tasks);
  const priorityStats = getPriorityStats(tasks);

  const totalCompleted = tasks.filter((task) => task.endDate).length;

  const firstName = user.name.split(" ")[0];

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm sm:text-md font-semibold flex items-center gap-2">
            <CheckSquare className="h-5 w-5 text-muted-foreground" />
            {firstName}'s Tasks
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
              dataKey="tasks"
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
            {priorityStats.urgent > 0 && (
              <Badge variant="destructive" className="text-xs">
                Urgent: {priorityStats.urgent}
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

export default UserTaskChart;
