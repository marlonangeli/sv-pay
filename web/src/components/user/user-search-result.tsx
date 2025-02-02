import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ArrowRight } from "lucide-react";
import { useState } from "react";

export const UserResult = ({ user, error, onClick }: {
  user?: { name: string; email: string; cpf: string, initials: string },
  error?: string,
  onClick?: () => void
}) => {
  const [hovered, setHovered] = useState(false);

  if (error) {
    return (
      <div className="rounded-lg bg-muted/50 p-3 text-sm text-muted-foreground">
        {error}
      </div>
    );
  }

  if (!user) return null;

  return (
    <div
      className="flex items-center gap-2 rounded-lg bg-muted/50 p-3 cursor-pointer hover:bg-muted/70 transition-all"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => {
        if (onClick) onClick();
      }}
    >
      <Avatar className="h-10 w-10 rounded-lg">
        <AvatarFallback className="rounded-lg bg-primary text-primary-foreground">
          {user.initials}
        </AvatarFallback>
      </Avatar>
      <div className="grid flex-1 text-left text-sm leading-tight">
        <span className="truncate font-semibold">{user.name}</span>
        <span className="truncate text-xs text-muted-foreground">{user.email}</span>
        <span className="truncate text-xs text-muted-foreground">{user.cpf}</span>
      </div>
      <ArrowRight className={`transition-transform duration-200 ${hovered ? "translate-x-1" : ""}`} />
    </div>
  );
};
