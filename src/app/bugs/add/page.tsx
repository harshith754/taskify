"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store";
import { addBug } from "@/slices/bugSlice";
import { EntityStatus, Priority } from "@/types";
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
import { toast } from "sonner";
import {
  Bug as BugIcon,
  AlignLeft,
  ListChecks,
  Flame,
  UserRound,
  Plus,
} from "lucide-react";
import { nanoid } from "@reduxjs/toolkit";

const AddBugPage = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const users = useSelector((state: RootState) => state.user);
  const currentUser = users.find((u) => u.isCurrentUser);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<Priority>("low");
  const [status, setStatus] = useState<EntityStatus>("open");

  const handleAddBug = () => {
    if (!title.trim()) {
      toast("Bug title is required");
      return;
    }

    const newBug = {
      id: `b-${nanoid(4)}`,
      title,
      description,
      status,
      priority,
      createdAt: new Date().toISOString(),
      assigneeId: currentUser?.id || "",
      updates: [],
    };

    dispatch(addBug(newBug));
    toast("Bug added successfully");
    router.push("/bugs");
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Add New Bug</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="space-y-1">
            <p className="text-xs font-medium flex items-center gap-1 text-muted-foreground">
              <BugIcon className="w-3 h-3" />
              Title
            </p>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter bug title"
            />
          </div>

          <div className="space-y-1">
            <p className="text-xs font-medium flex items-center gap-1 text-muted-foreground">
              <AlignLeft className="w-3 h-3" />
              Description
            </p>
            <Textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter bug description"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-xs font-medium flex items-center gap-1 text-muted-foreground">
                <ListChecks className="w-3 h-3" />
                Status
              </p>
              <Select
                value={status}
                onValueChange={(value) => setStatus(value as EntityStatus)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <p className="text-xs font-medium flex items-center gap-1 text-muted-foreground">
                <Flame className="w-3 h-3" />
                Priority
              </p>
              <Select
                value={priority}
                onValueChange={(value) => setPriority(value as Priority)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <p className="text-xs font-medium flex items-center gap-1 text-muted-foreground">
              <UserRound className="w-3 h-3" />
              Assigned To
            </p>
            <p className="text-sm">{currentUser?.name ?? "Unassigned"}</p>
          </div>

          <div className="pt-2">
            <Button onClick={handleAddBug} className="w-full sm:w-auto">
              <Plus className="w-4 h-4 mr-2" />
              Add Bug
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddBugPage;
