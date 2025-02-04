import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export const SearchUserResult = ({ user, error, onClick }: {
  user?: { name: string; email: string; cpf: string, initials: string },
  error?: string,
  onClick?: () => void
}) => {

  if (error) {
    return (
      <div className="mt-4 rounded-lg bg-muted/50 p-3 text-sm text-muted-foreground">
        {error}
      </div>
    );
  }

  if (!user) return null;

  return (
    <div
      className="mt-4 flex items-center gap-2 rounded-lg bg-muted/50 p-3 cursor-pointer hover:bg-muted/80"
      onClick={() => {
        if (onClick) onClick();
      }}
    >
      <Avatar className="h-10 w-10 rounded-lg mr-2">
        <AvatarFallback className="rounded-lg bg-primary text-primary-foreground">
          {user.initials}
        </AvatarFallback>
      </Avatar>
      <div className="grid flex-auto text-left text-sm leading-tight">
        <span className="truncate font-semibold">{user.name}</span>
        <span className="truncate text-xs text-muted-foreground">{user.email}</span>
        <span className="truncate text-xs text-muted-foreground">{user.cpf}</span>
      </div>
    </div>
  );
};
