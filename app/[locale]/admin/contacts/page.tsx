import { verifyAdmin } from "@/lib/session";
import { getAllContacts } from "@/data/contact";
import {
  CONTACT_CATEGORY_LABELS,
  type ContactCategory,
} from "@/components/contact/constants";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default async function AdminContactsPage() {
  await verifyAdmin();
  const contacts = await getAllContacts();

  return (
    <div className="container py-10">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">お問い合わせ管理</h1>
        <p className="text-muted-foreground">
          お問い合わせの一覧を確認できます
        </p>
      </div>

      {contacts.length === 0 ? (
        <div className="flex h-[400px] items-center justify-center rounded-lg border border-dashed">
          <div className="text-center">
            <h3 className="text-lg font-semibold">
              お問い合わせはありません
            </h3>
            <p className="text-sm text-muted-foreground">
              お問い合わせが届くとここに表示されます
            </p>
          </div>
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[160px]">受付日時</TableHead>
                <TableHead className="w-[160px]">カテゴリ</TableHead>
                <TableHead className="w-[140px]">名前</TableHead>
                <TableHead>件名</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contacts.map((contact) => (
                <TableRow key={contact.id}>
                  <TableCell className="text-sm text-muted-foreground">
                    {contact.createdAt.toLocaleDateString("ja-JP", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </TableCell>
                  <TableCell>
                    {CONTACT_CATEGORY_LABELS[
                      contact.category as ContactCategory
                    ] ?? contact.category}
                  </TableCell>
                  <TableCell>{contact.name}</TableCell>
                  <TableCell>
                    <Link
                      href={`/admin/contacts/${contact.id}`}
                      className="text-primary hover:underline"
                    >
                      {contact.subject}
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
