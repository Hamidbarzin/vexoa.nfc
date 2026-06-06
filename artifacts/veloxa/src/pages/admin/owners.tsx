import { useState } from "react";
import { useAdminGetOwners, useAdminCreateOwner, getAdminGetOwnersQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Loader2, Plus, Copy, CheckCircle2 } from "lucide-react";
import { useForm } from "react-form";
import { useToast } from "@/hooks/use-toast";

export default function AdminOwners() {
  const { data: owners, isLoading } = useAdminGetOwners();
  const createOwner = useAdminCreateOwner();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    title: "",
    company: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createOwner.mutate(
      { data: formData },
      {
        onSuccess: (newOwner) => {
          queryClient.setQueryData(getAdminGetOwnersQueryKey(), (old: any) => {
            if (!old) return [newOwner];
            return [...old, newOwner];
          });
          setOpen(false);
          setFormData({ name: "", username: "", email: "", title: "", company: "" });
          toast({
            title: "Owner created",
            description: "NFC token generated successfully."
          });
        }
      }
    );
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedToken(text);
    setTimeout(() => setCopiedToken(null), 2000);
  };

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-light tracking-tight">Owners</h1>
          <p className="text-muted-foreground mt-2">Manage platform users and NFC cards.</p>
        </div>
        
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="shrink-0 gap-2">
              <Plus className="h-4 w-4" />
              Add Owner
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create New Owner</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="username">Username (URL slug)</Label>
                <Input
                  id="username"
                  required
                  value={formData.username}
                  onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company">Company</Label>
                <Input
                  id="company"
                  value={formData.company}
                  onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                />
              </div>
              <Button type="submit" className="w-full" disabled={createOwner.isPending}>
                {createOwner.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create & Generate NFC Token"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <div className="col-span-full py-12 flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : owners && owners.length > 0 ? (
          owners.map((owner) => (
            <div key={owner.id} className="border border-border bg-card rounded-xl overflow-hidden hover:border-primary/50 transition-colors">
              <div className="p-6">
                <h3 className="text-xl font-medium text-foreground">{owner.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {owner.title} {owner.company && `at ${owner.company}`}
                </p>
                
                <div className="mt-6 space-y-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground uppercase tracking-wider">NFC Token</Label>
                    <div className="flex items-center justify-between bg-muted/30 px-3 py-2 rounded-md font-mono text-sm">
                      <span className="truncate mr-2">{owner.nfcToken}</span>
                      <button
                        onClick={() => copyToClipboard(owner.nfcToken)}
                        className="text-muted-foreground hover:text-foreground shrink-0"
                      >
                        {copiedToken === owner.nfcToken ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground uppercase tracking-wider">Profile URL</Label>
                    <div className="flex items-center justify-between bg-muted/30 px-3 py-2 rounded-md font-mono text-sm">
                      <span className="truncate mr-2 text-primary">{owner.profileUrl}</span>
                      <button
                        onClick={() => copyToClipboard(`https://veloxa.app${owner.profileUrl}`)}
                        className="text-muted-foreground hover:text-foreground shrink-0"
                      >
                        {copiedToken === `https://veloxa.app${owner.profileUrl}` ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-12 text-center text-muted-foreground border border-dashed border-border rounded-xl">
            No owners created yet.
          </div>
        )}
      </div>
    </div>
  );
}
