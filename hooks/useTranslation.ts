import { useLanguage } from '@/context/LanguageContext';
import mnTranslations from '@/dictionaries/mn.json';
import enTranslations from '@/dictionaries/en.json';

type TranslationKey = keyof typeof mnTranslations;
type NestedKey<T> = T extends object ? keyof T : never;

export function useTranslation() {
  const { language } = useLanguage();
  
  const translations = language === 'MN' ? mnTranslations : enTranslations;
  
  function t<K extends TranslationKey>(
    section: K,
    key: NestedKey<typeof translations[K]>
  ): string {
    const sectionData = translations[section] as any;
    if (!sectionData) return key as string;
    return sectionData[key] || key as string;
  }
  
  return { t, language };
}
