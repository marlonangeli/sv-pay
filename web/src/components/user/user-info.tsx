import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Info } from 'lucide-react';
import { User } from '@/http/generated';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

export interface UserInfoModalProps {
  user: User;
}

export function UserInfoModal({ user }: UserInfoModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const initials = user.fullName?.split(" ").map((n) => n[0]).join("") || "";

  const formatDate = (date?: Date) => {
    return date ? new Date(date).toLocaleDateString() : 'Not provided';
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="w-full justify-start">
          <Info className="mr-2 size-4" />
          Info
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>User Information</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
            </Avatar>
            <div>
              <div className="text-lg font-semibold">{user.fullName}</div>
              <div className="text-sm text-muted-foreground">{user.email}</div>
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="text-sm font-medium">First Name</span>
            <span className="col-span-3">{user.firstName || 'Not provided'}</span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="text-sm font-medium">Last Name</span>
            <span className="col-span-3">{user.lastName || 'Not provided'}</span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="text-sm font-medium">Email</span>
            <span className="col-span-3">{user.email || 'Not provided'}</span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="text-sm font-medium">CPF</span>
            <span className="col-span-3">{user.cpf?.formattedValue || 'Not provided'}</span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="text-sm font-medium">Birth Date</span>
            <span className="col-span-3">{formatDate(user.birthDate)}</span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="text-sm font-medium">Created At</span>
            <span className="col-span-3">{formatDate(user.createdAt)}</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}