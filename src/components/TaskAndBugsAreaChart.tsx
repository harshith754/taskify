"use client";

import { useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { format, parseISO } from "date-fns";
import type { 
  EntityStatus, 
  Priority, 
  Task, 
  Bug, 
  Update, 
  User,
  UnifiedItem,
  ItemType
} from "@/types";

type FilterType = "type" | "status" | "priority";

interface ChartDataPoint {
  date: string;
  [key: string]: string | number;
}

const TYPES: ItemType[] = ["task", "bug"];
const STATUSES: EntityStatus[] = [
  "open",
  "in_progress",
  "closed",
  "pending_approval",
];
const PRIORITIES: Priority[] = ["low", "medium", "high"];

const TaskAndBugAreaCharts = () => {
  const updates = useSelector((state: RootState) => state.updates) as Update[];
  const tasks = useSelector((state: RootState) => state.tasks) as Task[];
  const bugs = useSelector((state: RootState) => state.bugs) as Bug[];
  const users = useSelector((state: RootState) => state.user) as User[];
  const currentUser = users.find((u) => u.isCurrentUser);

  const [selectedFilter, setSelectedFilter] = useState<FilterType>("type");

  const allItems: UnifiedItem[] = [
    ...tasks.map((task): UnifiedItem => ({ 
      id: task.id,
      status: task.status,
      priority: task.priority,
      assigneeId: task.assigneeId,
      endDate: task.endDate,
      itemType: "task"
    })),
    ...bugs.map((bug): UnifiedItem => ({ 
      id: bug.id,
      status: bug.status,
      priority: bug.priority,
      assigneeId: bug.assigneeId,
      endDate: bug.endDate,
      itemType: "bug"
    })),
  ];

  const initializeGroup = (date: string, filter: FilterType): ChartDataPoint => {
    const base: ChartDataPoint = { date };

    if (filter === "type") {
      TYPES.forEach((type) => (base[type] = 0));
    } else if (filter === "status") {
      STATUSES.forEach((status) => (base[status] = 0));
    } else if (filter === "priority") {
      PRIORITIES.forEach((priority) => (base[priority] = 0));
    }

    return base;
  };

  const groupDataByDate = (
    items: Update[] | UnifiedItem[],
    getDate: (item: Update | UnifiedItem) => string | null,
    getKey: (item: Update | UnifiedItem) => string,
    filter: FilterType,
    userOnly = false
  ): ChartDataPoint[] => {
    const dateGroups: Record<string, ChartDataPoint> = {};

    items.forEach((item) => {
      if (userOnly && 'assigneeId' in item && item.assigneeId !== currentUser?.id) return;
      const rawDate = getDate(item);
      if (!rawDate) return;

      const date = format(parseISO(rawDate), "yyyy-MM-dd");
      if (!dateGroups[date]) {
        dateGroups[date] = initializeGroup(date, filter);
      }

      const key = getKey(item);
      if (key && key in dateGroups[date]) {
        const currentValue = dateGroups[date][key];
        dateGroups[date][key] = typeof currentValue === 'number' ? currentValue + 1 : 1;
      }
    });

    return Object.values(dateGroups).sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  };

  const getChartData = (): ChartDataPoint[] => {
    return groupDataByDate(
      updates,
      (u) => (u as Update).createdAt,
      (u) => {
        const update = u as Update;
        const parent = allItems.find((i) => i.id === update.parentId);
        if (!parent) return "";
        if (selectedFilter === "type") return parent.itemType;
        if (selectedFilter === "status") return parent.status;
        if (selectedFilter === "priority") return parent.priority;
        return "";
      },
      selectedFilter
    );
  };

  const getClosedData = (): ChartDataPoint[] => {
    const closedItems = allItems.filter((i) => i.status === "closed" && i.endDate);
    return groupDataByDate(
      closedItems,
      (i) => (i as UnifiedItem).endDate || null,
      (i) => {
        const item = i as UnifiedItem;
        if (selectedFilter === "type") return item.itemType;
        if (selectedFilter === "status") return item.status;
        if (selectedFilter === "priority") return item.priority;
        return "";
      },
      selectedFilter,
      true
    );
  };

  const getChartConfig = (): ChartConfig => {
    if (selectedFilter === "type") {
      return {
        task: { label: "Tasks", color: "var(--chart-1)" },
        bug: { label: "Bugs", color: "var(--chart-2)" },
      };
    }
    if (selectedFilter === "status") {
      return {
        open: { label: "Open", color: "var(--chart-1)" },
        in_progress: { label: "In Progress", color: "var(--chart-2)" },
        closed: { label: "Closed", color: "var(--chart-3)" },
        pending_approval: {
          label: "Pending Approval",
          color: "var(--chart-4)",
        },
      };
    }
    if (selectedFilter === "priority") {
      return {
        low: { label: "Low", color: "var(--chart-1)" },
        medium: { label: "Medium", color: "var(--chart-2)" },
        high: { label: "High", color: "var(--chart-3)" },
      };
    }
    return {};
  };

  const chartData = getChartData();
  const closedData = getClosedData();
  const chartConfig = getChartConfig();

  const renderAreas = () =>
    Object.keys(chartConfig).map((key) => (
      <Area
        key={key}
        dataKey={key}
        type="natural"
        fill={chartConfig[key]?.color}
        fillOpacity={0.4}
        stroke={chartConfig[key]?.color}
        stackId="1"
      />
    ));

  const getChartTitle = (): string => {
    switch (selectedFilter) {
      case "type":
        return "Updates by Item Type";
      case "status":
        return "Updates by Status";
      case "priority":
        return "Updates by Priority";
      default:
        return "Updates Timeline";
    }
  };

  const getChartDescription = (): string => {
    switch (selectedFilter) {
      case "type":
        return "Daily updates split between tasks and bugs";
      case "status":
        return "Daily updates grouped by item status";
      case "priority":
        return "Daily updates grouped by priority level";
      default:
        return "Daily updates over time";
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6 sm:p-0">
      {/* Filter Buttons */}
      <div className="space-y-3 sm:space-y-4">
        <h2 className="text-lg sm:text-xl font-semibold">
          Track your progress
        </h2>

        <div className="flex flex-wrap gap-2">
          {(["type", "status", "priority"] as const).map((f) => (
            <Button
              key={f}
              variant={selectedFilter === f ? "default" : "outline"}
              onClick={() => setSelectedFilter(f)}
              size="sm"
              className="text-xs sm:text-sm"
            >
              By {f.charAt(0).toUpperCase() + f.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {[
          {
            title: getChartTitle(),
            desc: getChartDescription(),
            data: chartData,
          },
          {
            title: `Completed Items by ${
              selectedFilter.charAt(0).toUpperCase() + selectedFilter.slice(1)
            }`,
            desc: `Tasks and bugs you've completed grouped by ${selectedFilter}`,
            data: closedData,
          },
        ].map(({ title, desc, data }, i) => (
          <Card key={i} className="w-full">
            <CardHeader className="pb-3 sm:pb-6">
              <CardTitle className="text-sm sm:text-base">{title}</CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                {desc}
              </CardDescription>
            </CardHeader>
            <CardContent className="px-2 sm:px-6">
              <ChartContainer
                config={chartConfig}
                className="h-[150px] sm:h-[200px] w-full"
              >
                <AreaChart
                  accessibilityLayer
                  data={data}
                  className="h-full w-full"
                >
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value: string) =>
                      new Date(value).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })
                    }
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tick={{ fontSize: 12 }}
                    allowDecimals={false}
                  />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent indicator="dot" />}
                    labelFormatter={(value: string) =>
                      new Date(value).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    }
                  />
                  {renderAreas()}
                </AreaChart>
              </ChartContainer>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TaskAndBugAreaCharts;