import { FC } from "react";
import { IntlProvider } from "react-intl";
import en from "../../translations/en.json";

type Translations = Record<string, string>;

type Locale = "en";

const translationsLookup: Record<Locale, Translations> = {
  en,
};

interface TranslationProviderProps {
  locale: Locale;
}

export const TranslationProvider: FC<TranslationProviderProps> = ({
  locale,
  children,
}) => (
  <IntlProvider locale={locale} messages={translationsLookup[locale]}>
    {children}
  </IntlProvider>
);
