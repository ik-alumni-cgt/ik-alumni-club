import { verifyAdmin } from "@/lib/session";
import { getAllContacts } from "@/data/contact";
import { DataTable } from "@/components/ui/data-table";
import {
  contactsColumns,
  type ContactForTable,
} from "@/components/admin/tables/columns/contacts-columns";

export default async function AdminContactsPage() {
  await verifyAdmin();
  const contacts = await getAllContacts();

  const data: ContactForTable[] = contacts.map((contact) => ({
    id: contact.id,
    name: contact.name,
    subject: contact.subject,
    category: contact.category,
    createdAt: contact.createdAt.toISOString(),
  }));

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">お問い合わせ管理</h1>
        <p className="text-muted-foreground">
          お問い合わせの一覧を確認できます
        </p>
      </div>

      <DataTable
        columns={contactsColumns}
        data={data}
        searchKey="name"
        searchPlaceholder="名前で検索..."
        emptyState={{
          title: "お問い合わせはありません",
          description: "お問い合わせが届くとここに表示されます",
        }}
      />
    </div>
  );
}
