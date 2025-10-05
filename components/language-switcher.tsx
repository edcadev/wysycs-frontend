"use client";

import { useLocale } from 'next-intl';
import { usePathname as useNextPathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Globe } from 'lucide-react';
import { useTransition } from 'react';

const languages = [
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
] as const;

export function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = useNextPathname();
  const [isPending, startTransition] = useTransition();

  const currentLanguage = languages.find((lang) => lang.code === locale);

  function onSelectChange(nextLocale: string) {
    if (nextLocale === locale) return;

    startTransition(() => {
      // Remove current locale from pathname
      const pathnameWithoutLocale = pathname.replace(`/${locale}`, '');
      // Redirect to new locale
      window.location.href = `/${nextLocale}${pathnameWithoutLocale || ''}`;
    });
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" disabled={isPending}>
          <Globe className="h-4 w-4 mr-2" />
          {currentLanguage?.flag} {currentLanguage?.code.toUpperCase()}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" sideOffset={8}>
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => onSelectChange(language.code)}
            className={locale === language.code ? 'bg-accent' : ''}
          >
            <span className="mr-2">{language.flag}</span>
            {language.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
