import { useTranslations } from 'next-intl';
import { LoginForm } from '@/components/auth/LoginForm'; // We will create this
import { Link } from '@/i18n/navigation';

export default function LoginPage() {
  const t = useTranslations('auth.login');

  return (
    <div className="max-w-[var(--max-width-content)] mx-auto px-[var(--spacing-page)] flex flex-col items-center justify-center py-20">
      <div className="mb-8 text-center">
        <h1 className="mb-2 text-3xl font-bold">{t('title')}</h1>
        <p className="text-muted-foreground">{t('subtitle')}</p>
      </div>
      
      <div className="w-full max-w-sm rounded-lg border p-6 shadow-sm">
         <LoginForm />
      </div>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        {t('noAccount')}{' '}
        <Link href="/auth/register" className="font-medium underline underline-offset-4 hover:text-primary">
          {t('register')}
        </Link>
      </p>
    </div>
  );
}
