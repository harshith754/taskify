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

const BugFiltersAndTable = () => {
  const users = useSelector((state: RootState) => state.user);
  const currentUser = users.find((u) => u.isCurrentUser);
  const allBugs = useSelector((state: RootState) => state.bugs);

  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [severityFilter, setSeverityFilter] = useState("all");
  const [assigneeFilter, setAssigneeFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  const isManager = currentUser?.role === "manager";
  const bugs = isManager
    ? allBugs
    : allBugs.filter((bug) => bug.assigneeId === currentUser?.id);

  const filteredBugs = bugs.filter((bug) => {
    return (
      (statusFilter === "all" || bug.status === statusFilter) &&
      (priorityFilter === "all" || bug.priority === priorityFilter) &&
      (severityFilter === "all" || bug.severity === severityFilter) &&
      (isManager
        ? assigneeFilter === "all" || bug.assigneeId === assigneeFilter
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
          Bug List
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
            <div className="space-y-1">
              <p className="text-sm font-medium">Severity</p>
              <Select
                value={severityFilter}
                onValueChange={setSeverityFilter}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Severity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
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
              <TableHead>Severity</TableHead>
              {isManager && <TableHead>Assignee</TableHead>}
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Time Spent</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredBugs.map((bug) => (
              <TableRow
                key={bug.id}
                onClick={() => router.push(`/bugs/${bug.id}`)}
                className="cursor-pointer hover:bg-muted transition-colors"
              >
                <TableCell className="text-xs text-muted-foreground">
                  {bug.id}
                </TableCell>
                <TableCell className="font-medium">{bug.title}</TableCell>
                <TableCell>
                  <Badge className="capitalize text-xs inline-flex items-center gap-1">
                    {getStatusIcon(bug.status)}
                    {bug.status.replace("_", " ")}
                  </Badge>
                </TableCell>
                <TableCell className="capitalize">{bug.priority}</TableCell>
                <TableCell className="capitalize">{bug.severity}</TableCell>
                {isManager && (
                  <TableCell>
                    {users.find((u) => u.id === bug.assigneeId)?.name ||
                      "Unknown"}
                  </TableCell>
                )}
                <TableCell>
                  {new Date(bug.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right">
                  {bug.timeSpent} hrs
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default BugFiltersAndTable;
