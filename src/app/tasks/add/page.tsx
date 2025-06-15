"use client";

import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store";
import { toast } from "sonner";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Bug,
  AlignLeft,
  ListChecks,
  Flame,
  UserRound,
  Plus,
} from "lucide-react";
import { EntityStatus, Priority } from "@/types";
import { addTask } from "@/slices/taskSlice";

const AddTaskForm = () => {
  const dispatch = useDispatch();
  const users = useSelector((state: RootState) => state.user);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<EntityStatus>("open");
  const [priority, setPriority] = useState<Priority>("medium");
  const [assigneeId, setAssigneeId] = useState<string>(users[0]?.id ?? "");
  const [creating, setCreating] = useState(false);

  const handleCreate = async () => {
    if (!title.trim()) {
      toast("Title is required");
      return;
    }

    setCreating(true);

    const newTask = {
      title,
      description,
      status,
      priority,
      assigneeId,
      createdAt: new Date().toISOString(),
      itemType: "task",
    };

    try {
      await dispatch(addTask(newTask));
      toast("Task created successfully");
      setTitle("");
      setDescription("");
      setStatus("open");
      setPriority("medium");
      setAssigneeId(users[0]?.id ?? "");
    } catch {
      toast("Failed to create task");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Create New Task</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4 border-t pt-4">
          {/* Title */}
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground font-medium flex items-center gap-1">
              <Bug className="w-3 h-3" />
              Title
            </p>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter task title"
            />
          </div>

          {/* Description */}
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground font-medium flex items-center gap-1">
              <AlignLeft className="w-3 h-3" />
              Description
            </p>
            <Textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Task details..."
            />
          </div>

          {/* Status & Priority */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                <ListChecks className="w-3 h-3" />
                Status
              </p>
              <Select
                value={status}
                onValueChange={(val) => setStatus(val as EntityStatus)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <p className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                <Flame className="w-3 h-3" />
                Priority
              </p>
              <Select
                value={priority}
                onValueChange={(val) => setPriority(val as Priority)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Assignee */}
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground font-medium flex items-center gap-1">
              <UserRound className="w-3 h-3" />
              Assign to
            </p>
            <Select
              value={assigneeId}
              onValueChange={(val) => setAssigneeId(val)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Assignee" />
              </SelectTrigger>
              <SelectContent>
                {users.map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <Button
              onClick={handleCreate}
              disabled={creating}
              className="w-full sm:w-auto"
            >
              <Plus className="w-4 h-4 mr-2" />
              {creating ? "Creating..." : "Create Task"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddTaskForm;
