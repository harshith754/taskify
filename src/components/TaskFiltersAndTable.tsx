"use client";

import React, { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Clock, Loader2, CheckCircle, Filter } from "lucide-react";
import { useRouter } from "next/navigation";

const TaskFiltersAndTable = () => {
  const users = useSelector((state: RootState) => state.user);
  const currentUser = users.find((u) => u.isCurrentUser);
  const allTasks = useSelector((state: RootState) => state.tasks);

  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [assigneeFilter, setAssigneeFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  const isManager = currentUser?.role === "manager";
  const tasks = isManager
    ? allTasks
    : allTasks.filter((task) => task.assigneeId === currentUser?.id);

  const filteredTasks = tasks.filter((task) => {
    return (
      (statusFilter === "all" || task.status === statusFilter) &&
      (priorityFilter === "all" || task.priority === priorityFilter) &&
      (isManager
        ? assigneeFilter === "all" || task.assigneeId === assigneeFilter
        : true)
    );
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="w-3.5 h-3.5 mr-1" />;
      case "in_progress":
        return <Loader2 className="w-3.5 h-3.5 mr-1 animate-spin" />;
      case "closed":
        return <CheckCircle className="w-3.5 h-3.5 mr-1" />;
      default:
        return null;
    }
  };

  const router = useRouter();

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2
          className="text-base font-semibold cursor-pointer"
          onClick={() => setShowFilters(!showFilters)}
        >
          Task List
        </h2>
        <Popover open={showFilters} onOpenChange={setShowFilters}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" /> Filters
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[300px] space-y-4">
            <div className="space-y-1">
              <p className="text-sm font-medium">Status</p>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">Priority</p>
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {isManager && (
              <div className="space-y-1">
                <p className="text-sm font-medium">Assignee</p>
                <Select
                  value={assigneeFilter}
                  onValueChange={setAssigneeFilter}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Assignee" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    {users.map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </PopoverContent>
        </Popover>
      </div>

      <div className="overflow-x-auto border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">ID</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Priority</TableHead>
              {isManager && <TableHead>Assignee</TableHead>}
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Time Spent</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTasks.map((task) => (
              <TableRow
                key={task.id}
                onClick={() => router.push(`/tasks/${task.id}`)}
                className="cursor-pointer hover:bg-muted transition-colors"
              >
                <TableCell className="text-xs text-muted-foreground">
                  {task.id}
                </TableCell>
                <TableCell className="font-medium">{task.title}</TableCell>
                <TableCell>
                  <Badge className="capitalize text-xs inline-flex items-center gap-1">
                    {getStatusIcon(task.status)}
                    {task.status.replace("_", " ")}
                  </Badge>
                </TableCell>
                <TableCell className="capitalize">{task.priority}</TableCell>
                {isManager && (
                  <TableCell>
                    {users.find((u) => u.id === task.assigneeId)?.name ||
                      "Unknown"}
                  </TableCell>
                )}
                <TableCell>
                  {new Date(task.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right">
                  {task.timeSpent} hrs
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default TaskFiltersAndTable;
