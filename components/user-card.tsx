import { User } from "@/types/user";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function UserCard({ user }: { user: User }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>マイページ</CardTitle>
        <CardDescription>アカウント情報</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-4">
        <Avatar className="w-16 h-16">
          <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
          <AvatarFallback>{user.name}</AvatarFallback>
        </Avatar>
        <div className="text-center">
          <h2 className="text-lg font-bold">{user.name}</h2>
          <p className="text-sm break-all text-muted-foreground">{user.email}</p>
        </div>
      </CardContent>
    </Card>
  );
}