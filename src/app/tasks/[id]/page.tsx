// Same imports as before
"use client";

import { useParams } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { updateTask } from "@/slices/taskSlice";
import { toast } from "sonner";
import { EntityStatus } from "@/types";
import {
  Edit3,
  Save,
  PlusCircle,
  Hash,
  AlignLeft,
  ListChecks,
  Flame,
  UserRound,
} from "lucide-react";

const TaskDetailsPage = () => {
  const { id: taskId } = useParams();
  const dispatch = useDispatch();
  const task = useSelector((state: RootState) =>
    state.tasks.find((t) => t.id === taskId)
  );
  const user = useSelector((state: RootState) =>
    state.user.find((u) => u.id === task?.assigneeId)
  );

  const [title, setTitle] = useState(task?.title ?? "");
  const [description, setDescription] = useState(task?.description ?? "");
  const [status, setStatus] = useState<EntityStatus>(task?.status ?? "open");
  const [priority, setPriority] = useState<"low" | "medium" | "high">(
    task?.priority ?? "low"
  );
  const [updateText, setUpdateText] = useState("");
  const [saving, setSaving] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  if (!task) return <div className="p-4">Task not found.</div>;

  const handleSave = () => {
    if (!title.trim()) {
      toast("Title cannot be empty.");
      return;
    }

    setSaving(true);
    dispatch(
      updateTask({
        ...task,
        title,
        description,
        status,
        priority,
      })
    );

    setTimeout(() => {
      setSaving(false);
      setIsEditing(false);
      toast("Task updated successfully!");
    }, 500);
  };

  const handleUpdateSubmit = () => {
    if (!updateText.trim()) {
      toast("Update text cannot be empty.");
      return;
    }

    setUpdating(true);
    dispatch(
      updateTask({
        ...task,
        updates: [...task.updates, updateText.trim()],
      })
    );

    setUpdateText("");

    setTimeout(() => {
      setUpdating(false);
      toast("Update added to task!");
    }, 500);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 max-w-6xl mx-auto px-4 py-6">
      {/* Task Details */}
      <div className="flex-1">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-0">
            <CardTitle className="text-base sm:text-lg">Task Details</CardTitle>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing((prev) => !prev)}
            >
              <Edit3 className="w-4 h-4 mr-2" />
              {isEditing ? "Cancel" : "Edit Task"}
            </Button>
          </CardHeader>

          <CardContent className="space-y-4 border-t pt-4">
            {/* Task ID */}
            <div>
              <p className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                <Hash className="w-3 h-3" />
                Task ID
              </p>
              <p className="text-sm bg-muted rounded-md px-3 py-2 capitalize">
                {task.id}
              </p>
            </div>

            {/* Title */}
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                <Edit3 className="w-3 h-3" />
                Title
              </p>
              {isEditing ? (
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              ) : (
                <p className="text-sm bg-muted rounded-md px-3 py-2 capitalize">
                  {title}
                </p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                <AlignLeft className="w-3 h-3" />
                Description
              </p>
              {isEditing ? (
                <Textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              ) : (
                <p className="text-sm bg-muted rounded-md px-3 py-2 capitalize">
                  {description}
                </p>
              )}
            </div>

            {/* Status */}
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                <ListChecks className="w-3 h-3" />
                Status
              </p>
              {isEditing ? (
                <Select
                  value={status}
                  onValueChange={(value) => setStatus(value as EntityStatus)}
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
              ) : (
                <p className="text-sm bg-muted rounded-md px-3 py-2 capitalize">
                  {status.replace("_", " ")}
                </p>
              )}
            </div>

            {/* Priority */}
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                <Flame className="w-3 h-3" />
                Priority
              </p>
              {isEditing ? (
                <Select
                  value={priority}
                  onValueChange={(value) =>
                    setPriority(value as "low" | "medium" | "high")
                  }
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
              ) : (
                <p className="text-sm bg-muted rounded-md px-3 py-2 capitalize">{priority}</p>
              )}
            </div>

            {/* Assigned User */}
            {user && (
              <div>
                <p className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                  <UserRound className="w-3 h-3" />
                  Assigned To
                </p>
                <p className="text-sm bg-muted rounded-md px-3 py-2 capitalize">
                  {user.name}
                </p>
              </div>
            )}

            {/* Save Button */}
            {isEditing && (
              <div className="pt-2">
                <Button
                  onClick={handleSave}
                  disabled={saving}
                  className="w-full sm:w-auto"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Updates Section */}
      <div className="w-full lg:max-w-md">
        <Card>
          <CardHeader className="pb-0">
            <CardTitle className="text-base sm:text-lg pb-0">
              Task Updates
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4 border-t pt-4">
            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {task.updates?.length > 0 ? (
                task.updates.map((update, idx) => (
                  <div
                    key={idx}
                    className="text-sm p-2 border rounded-md bg-muted"
                  >
                    {update}
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No updates yet.</p>
              )}
            </div>

            {/* Add Update */}
            <div className="space-y-1 pt-2">
              <p className="text-xs text-muted-foreground font-medium">
                New Update
              </p>
              <Textarea
                rows={3}
                value={updateText}
                onChange={(e) => setUpdateText(e.target.value)}
                placeholder="Write an update..."
              />
              <Button
                onClick={handleUpdateSubmit}
                className="mt-2"
                disabled={updating}
              >
                <PlusCircle className="w-4 h-4 mr-2" />
                {updating ? "Adding..." : "Add Update"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TaskDetailsPage;
