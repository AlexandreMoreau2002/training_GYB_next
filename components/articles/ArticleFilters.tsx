'use client';

import { useRouter, usePathname } from '@/i18n/navigation';
import { useSearchParams } from 'next/navigation';
import { Input, Button } from '@/components/ui';
import { useTranslations } from 'next-intl';
import { useState, useEffect } from 'react';

// Debounce helper
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouncedValue;
}

export function ArticleFilters() {
  const t = useTranslations('articles.filters');
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const debouncedSearch = useDebounce(search, 500);

  // Update URL when search changes
  useEffect(() => {
    const currentSearch = searchParams.get('search') || '';
    if (currentSearch === debouncedSearch) return;

    const params = new URLSearchParams(searchParams.toString());
    if (debouncedSearch) {
      params.set('search', debouncedSearch);
    } else {
      params.delete('search');
    }
    // Reset page on search
    params.delete('page');
    
    router.push(`${pathname}?${params.toString()}`);
  }, [debouncedSearch, pathname, router, searchParams]);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-2 font-medium">{t('searchPlaceholder')}</h3>
        <Input 
          placeholder={t('searchPlaceholder')} 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div>
        <h3 className="mb-2 font-medium">{t('sortBy')}</h3>
        <div className="flex flex-col gap-2">
           <Button variant="ghost" className="justify-start text-left">
             {t('newest')}
           </Button>
           <Button variant="ghost" className="justify-start text-left">
             {t('oldest')}
           </Button>
        </div>
      </div>
    </div>
  );
}
