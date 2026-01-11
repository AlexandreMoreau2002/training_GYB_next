'use client';

import { useTranslations } from 'next-intl';
import { usersService } from '@/lib/api/services/users.service';
import { useRouter } from '@/i18n/navigation';
import { useEffect, useState } from 'react';
import type { User } from '@/types';

export default function AdminUsersPage() {
  const t = useTranslations('admin.users');
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await usersService.getAll();
        setUsers(response.results);
      } catch (error) {
        console.error("Access denied or error fetching users", error);
        router.push('/');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [router]);

  if (isLoading) {
    return (
      <div className="max-w-[var(--max-width-content)] mx-auto px-[var(--spacing-page)] py-10">
        <div className="flex justify-center p-10">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[var(--color-border)] border-t-[var(--color-accent)]"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[var(--max-width-content)] mx-auto px-[var(--spacing-page)] py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{t('title')}</h1>
        <p className="text-[var(--color-secondary)]">{t('description')}</p>
      </div>

      <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[var(--color-background)] border-b border-[var(--color-border)]">
              <tr>
                <th className="px-6 py-4 font-semibold">{t('table.user')}</th>
                <th className="px-6 py-4 font-semibold">{t('table.email')}</th>
                <th className="px-6 py-4 font-semibold">{t('table.role')}</th>
                <th className="px-6 py-4 font-semibold">{t('table.joined')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-[var(--color-background)] transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-stone-200 flex items-center justify-center font-bold text-stone-500 overflow-hidden">
                        {user.profile.avatar_url ? (
                          <img src={user.profile.avatar_url} alt={user.username} className="h-full w-full object-cover" />
                        ) : (
                          user.username.charAt(0).toUpperCase()
                        )}
                      </div>
                      <div className="font-medium text-[var(--color-foreground)]">
                        {user.first_name} {user.last_name}
                        <div className="text-xs text-[var(--color-secondary)] font-normal">@{user.username}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-[var(--color-secondary)]">
                    {user.email}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                      user.is_staff 
                        ? 'bg-orange-50 text-orange-700 ring-orange-600/20' 
                        : 'bg-stone-50 text-stone-600 ring-stone-500/10'
                    }`}>
                      {user.is_staff ? t('roles.admin') : t('roles.user')}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-[var(--color-secondary)]">
                    {new Date(user.date_joined).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
