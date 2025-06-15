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
import { updateBug } from "@/slices/bugSlice";
import { toast } from "sonner";
import { EntityStatus, Priority } from "@/types";
import {
  Edit3,
  Save,
  PlusCircle,
  Hash,
  AlignLeft,
  ListChecks,
  Flame,
  UserRound,
  Bug as BugIcon,
} from "lucide-react";

const BugDetailsPage = () => {
  const { id: bugId } = useParams();
  const dispatch = useDispatch();
  const bug = useSelector((state: RootState) =>
    state.bugs.find((b) => b.id === bugId)
  );
  const user = useSelector((state: RootState) =>
    state.user.find((u) => u.id === bug?.assigneeId)
  );

  const [title, setTitle] = useState(bug?.title ?? "");
  const [description, setDescription] = useState(bug?.description ?? "");
  const [status, setStatus] = useState<EntityStatus>(bug?.status ?? "open");
  const [priority, setPriority] = useState<Priority>(bug?.priority ?? "low");
  const [updateText, setUpdateText] = useState("");
  const [saving, setSaving] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  if (!bug) return <div className="p-4">Bug not found.</div>;

  const handleSave = () => {
    if (!title.trim()) {
      toast("Title cannot be empty.");
      return;
    }

    setSaving(true);
    dispatch(
      updateBug({
        ...bug,
        title,
        description,
        status,
        priority,
      })
    );

    setTimeout(() => {
      setSaving(false);
      setIsEditing(false);
      toast("Bug updated successfully!");
    }, 500);
  };

  const handleUpdateSubmit = () => {
    if (!updateText.trim()) {
      toast("Update text cannot be empty.");
      return;
    }

    setUpdating(true);
    dispatch(
      updateBug({
        ...bug,
        updates: [...bug.updates, updateText.trim()],
      })
    );

    setUpdateText("");

    setTimeout(() => {
      setUpdating(false);
      toast("Update added to bug!");
    }, 500);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 max-w-6xl mx-auto px-4 py-6">
      {/* Bug Details */}
      <div className="flex-1">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-0">
            <CardTitle className="text-base sm:text-lg">Bug Details</CardTitle>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing((prev) => !prev)}
            >
              <Edit3 className="w-4 h-4 mr-2" />
              {isEditing ? "Cancel" : "Edit Bug"}
            </Button>
          </CardHeader>

          <CardContent className="space-y-4 border-t pt-4">
            <div>
              <p className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                <Hash className="w-3 h-3" />
                Bug ID
              </p>
              <p className="text-sm">{bug.id}</p>
            </div>

            {/* Title */}
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                <BugIcon className="w-3 h-3" />
                Title
              </p>
              {isEditing ? (
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              ) : (
                <p className="text-sm bg-muted rounded-md px-3 py-2">{title}</p>
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
                <p className="text-sm bg-muted rounded-md px-3 py-2 whitespace-pre-wrap">
                  {description}
                </p>
              )}
            </div>

            {/* Status & Priority */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

              <div className="space-y-1">
                <p className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                  <Flame className="w-3 h-3" />
                  Priority
                </p>
                {isEditing ? (
                  <Select
                    value={priority}
                    onValueChange={(value) => setPriority(value as Priority)}
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
                  <p className="text-sm bg-muted rounded-md px-3 py-2 capitalize">
                    {priority}
                  </p> 
                )}
              </div>
            </div>

            {/* Assigned User */}
            {user && (
              <div>
                <p className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                  <UserRound className="w-3 h-3" />
                  Assigned To
                </p>
                <p className="text-sm">{user.name}</p>
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
              Bug Updates
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4 border-t pt-4">
            {/* Existing Updates */}
            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {bug.updates?.length > 0 ? (
                bug.updates.map((update, idx) => (
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

export default BugDetailsPage;
