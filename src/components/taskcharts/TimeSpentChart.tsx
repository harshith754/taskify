"use client";

import { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartLegend,
} from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { Clock, Users, BarChart3 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type UserTaskTime = {
  userName: string;
  userId: string;
  totalTime: number;
  [taskTitle: string]: number | string;
};

const formatTime = (minutes: number): string => {
  if (minutes < 60) return `${minutes}m`;
  if (minutes < 1440) return `${Math.floor(minutes / 60)}h ${minutes % 60}m`;
  return `${Math.floor(minutes / 1440)}d ${Math.floor((minutes % 1440) / 60)}h`;
};

const generateColors = (count: number): string[] => {
  const colors = [
    "var(--chart-1)",
    "var(--chart-2)",
    "var(--chart-3)",
    "var(--chart-4)",
    "var(--chart-5)",
  ];

  if (count <= colors.length) return colors.slice(0, count);

  // Generate additional colors for more tasks
  const additionalColors = [];
  for (let i = colors.length; i < count; i++) {
    const colorIndex = (i % colors.length) + 1;
    additionalColors.push(`var(--chart-${colorIndex})`);
  }

  return [...colors, ...additionalColors];
};

const TimeSpentChart = () => {
  const tasks = useSelector((state: RootState) => state.tasks);
  const users = useSelector((state: RootState) => state.user);

  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "totalTime">("totalTime");
  const [maxTasks, setMaxTasks] = useState<number>(10);

  const processedData = useMemo(() => {
    const userTaskMap: Record<string, UserTaskTime> = {};

    // Process tasks and group by user
    tasks.forEach((task) => {
      const user = users.find((u) => u.id === task.assigneeId);
      if (!user) return;

      const name = user.name;
      const timeSpent = task.timeSpent || 0;

      if (!userTaskMap[name]) {
        userTaskMap[name] = {
          userName: name,
          userId: user.id,
          totalTime: 0,
        };
      }

      userTaskMap[name][task.title] = timeSpent;
      userTaskMap[name].totalTime += timeSpent;
    });

    // Convert to array and filter by search term
    const chartData = Object.values(userTaskMap).filter((user) =>
      user.userName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Sort data
    chartData.sort((a, b) => {
      if (sortBy === "name") {
        return a.userName.localeCompare(b.userName);
      }
      return b.totalTime - a.totalTime;
    });

    return chartData;
  }, [tasks, users, searchTerm, sortBy]);

  const taskTitles = useMemo(() => {
    const allTasks = Array.from(new Set(tasks.map((task) => task.title)));

    // Get top tasks by total time spent
    const taskTotals = allTasks.map((title) => ({
      title,
      totalTime: tasks
        .filter((task) => task.title === title)
        .reduce((sum, task) => sum + (task.timeSpent || 0), 0),
    }));

    return taskTotals
      .sort((a, b) => b.totalTime - a.totalTime)
      .slice(0, maxTasks)
      .map((task) => task.title);
  }, [tasks, maxTasks]);

  const colors = generateColors(taskTitles.length);

  const chartConfig = taskTitles.reduce((config, title, index) => {
    config[title] = {
      label: title,
      color: colors[index],
    };
    return config;
  }, {} as ChartConfig);

  const totalUsers = processedData.length;
  const totalTasks = taskTitles.length;
  const totalTimeSpent = processedData.reduce(
    (sum, user) => sum + user.totalTime,
    0
  );
  const groupedChartData = useMemo(() => {
    return processedData.filter((user) =>
      taskTitles.some((title) => {
        const value = user[title];
        return typeof value === "number" && value > 0;
      })
    );
  }, [processedData, taskTitles]);
  const visibleGroupedTasks = useMemo(() => {
    return taskTitles.filter((title) =>
      groupedChartData.some((user) => {
        const value = user[title];
        return typeof value === "number" && value > 0;
      })
    );
  }, [groupedChartData, taskTitles]);

  if (tasks.length === 0 || users.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Time Spent Analysis
          </CardTitle>
          <CardDescription>
            Track time spent by users across different tasks
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[400px]">
          <div className="text-center text-muted-foreground">
            <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No data available</p>
            <p className="text-sm">
              Tasks and users will appear here once data is loaded
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Time Spent Analysis
            </CardTitle>
            <CardDescription>
              Track time spent by users across different tasks
            </CardDescription>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Badge variant="secondary" className="gap-1">
              <Users className="h-3 w-3" />
              {totalUsers} users
            </Badge>
            <Badge variant="secondary">{totalTasks} tasks</Badge>
            <Badge variant="outline">{formatTime(totalTimeSpent)} total</Badge>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col gap-3 pt-4">
          <div className="flex flex-col sm:flex-row gap-2">
            <Input
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Stacked View */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-center">Stacked View</h3>
            <div className="h-[100px] md:h-[300px]">
              <ChartContainer config={chartConfig}>
                <BarChart
                  accessibilityLayer
                  data={groupedChartData}
                  margin={{
                    top: 10,
                    right: 10,
                    bottom: 40,
                    left: 10,
                  }}
                >
                  <CartesianGrid
                    vertical={false}
                    strokeDasharray="3 3"
                    opacity={0.4}
                  />
                  <XAxis
                    dataKey="userName"
                    tickLine={false}
                    tickMargin={8}
                    axisLine={false}
                    angle={-35}
                    textAnchor="end"
                    height={60}
                    interval={0}
                    fontSize={10}
                    className="text-xs"
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tickMargin={6}
                    tickFormatter={(value) => formatTime(value)}
                    fontSize={10}
                    className="text-xs"
                  />
                  <ChartTooltip
                    cursor={{ fill: "rgba(0, 0, 0, 0.05)" }}
                    content={({ active, payload, label }) => {
                      if (!active || !payload?.length) return null;

                      const totalTime = payload.reduce(
                        (sum, entry) => sum + ((entry.value as number) || 0),
                        0
                      );

                      return (
                        <div className="rounded-lg border bg-background p-3 shadow-md">
                          <div className="font-medium mb-2">{label}</div>
                          <div className="space-y-1">
                            {payload
                              .filter((entry) => (entry.value as number) > 0)
                              .sort(
                                (a, b) =>
                                  (b.value as number) - (a.value as number)
                              )
                              .map((entry, index) => (
                                <div
                                  key={index}
                                  className="flex items-center justify-between gap-4 text-sm"
                                >
                                  <div className="flex items-center gap-2">
                                    <div
                                      className="w-3 h-3 rounded-sm"
                                      style={{ backgroundColor: entry.color }}
                                    />
                                    <span className="truncate max-w-[150px]">
                                      {entry.dataKey}
                                    </span>
                                  </div>
                                  <span className="font-medium">
                                    {formatTime(entry.value as number)}
                                  </span>
                                </div>
                              ))}
                            <div className="border-t pt-1 mt-2 font-medium">
                              Total: {formatTime(totalTime)}
                            </div>
                          </div>
                        </div>
                      );
                    }}
                  />
                  {taskTitles.map((title, index) => (
                    <Bar
                      key={title}
                      dataKey={title}
                      stackId="timeSpent"
                      fill={colors[index]}
                      radius={[4, 4, 4, 4]}
                    />
                  ))}
                </BarChart>
              </ChartContainer>
            </div>
            <ChartLegend
              content={({ payload }) => (
                <div className="flex flex-wrap gap-1 justify-center">
                  {payload?.slice(0, 4).map((entry, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-1 text-xs px-2 py-1 bg-muted rounded"
                    >
                      <div
                        className="w-2 h-2 rounded-sm"
                        style={{ backgroundColor: entry.color }}
                      />
                      <span className="truncate max-w-[80px] sm:max-w-[120px]">
                        {entry.value}
                      </span>
                    </div>
                  ))}
                  {payload && payload.length > 4 && (
                    <span className="text-xs text-muted-foreground px-2">
                      +{payload.length - 4} more
                    </span>
                  )}
                </div>
              )}
            />
          </div>

          {/* Grouped View */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-center">Grouped View</h3>
            <div className="h-[100px]  md:h-[300px]">
              <ChartContainer config={chartConfig}>
                <BarChart
                  accessibilityLayer
                  data={groupedChartData}
                  margin={{
                    top: 10,
                    right: 10,
                    bottom: 40,
                    left: 10,
                  }}
                >
                  <CartesianGrid
                    vertical={false}
                    strokeDasharray="3 3"
                    opacity={0.4}
                  />
                  <XAxis
                    dataKey="userName"
                    tickLine={false}
                    tickMargin={8}
                    axisLine={false}
                    angle={-35}
                    textAnchor="end"
                    height={60}
                    interval={0}
                    fontSize={10}
                    className="text-xs"
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tickMargin={6}
                    tickFormatter={(value) => formatTime(value)}
                    fontSize={10}
                    className="text-xs"
                  />
                  <ChartTooltip
                    cursor={{ fill: "rgba(0, 0, 0, 0.05)" }}
                    content={({ active, payload, label }) => {
                      if (!active || !payload?.length) return null;

                      const entry = payload[0];
                      if (!entry || (entry.value as number) === 0) return null;

                      return (
                        <div className="rounded-lg border bg-background p-3 shadow-md">
                          <div className="font-medium mb-1">{label}</div>
                          <div className="flex items-center gap-2 text-sm">
                            <div
                              className="w-3 h-3 rounded-sm"
                              style={{ backgroundColor: entry.color }}
                            />
                            <span className="truncate">{entry.dataKey}</span>
                            <span className="font-medium ml-auto">
                              {formatTime(entry.value as number)}
                            </span>
                          </div>
                        </div>
                      );
                    }}
                  />
                  {visibleGroupedTasks.map((title, index) => (
                    <Bar
                      key={title}
                      dataKey={title}
                      fill={colors[index]}
                      radius={[2, 2, 0, 0]}
                    />
                  ))}
                </BarChart>
              </ChartContainer>
            </div>
            <ChartLegend
              content={({ payload }) => (
                <div className="flex flex-wrap gap-1 justify-center">
                  {payload?.slice(0, 4).map((entry, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-1 text-xs px-2 py-1 bg-muted rounded"
                    >
                      <div
                        className="w-2 h-2 rounded-sm"
                        style={{ backgroundColor: entry.color }}
                      />
                      <span className="truncate max-w-[80px] sm:max-w-[120px]">
                        {entry.value}
                      </span>
                    </div>
                  ))}
                  {payload && payload.length > 4 && (
                    <span className="text-xs text-muted-foreground px-2">
                      +{payload.length - 4} more
                    </span>
                  )}
                </div>
              )}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TimeSpentChart;
