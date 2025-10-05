import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: ['es', 'en'],

  // Used when no locale matches
  defaultLocale: 'es',

  // The `pathnames` object maps pathnames to localized versions
  // If you want to use the same pathnames for all locales, you can omit this
  pathnames: {
    '/': '/',
    '/dashboard': '/dashboard',
    '/dashboard/fires': '/dashboard/fires',
    '/dashboard/guardian': '/dashboard/guardian',
    '/dashboard/forests/[id]': '/dashboard/forests/[id]',
  }
});

// Lightweight wrappers around Next.js' navigation APIs
// that will consider the routing configuration
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
