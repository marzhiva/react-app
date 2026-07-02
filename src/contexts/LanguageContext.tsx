import { createContext, useContext, useMemo, useState } from 'react';

type Language = 'EN' | 'GE';

type TranslationMap = {
  navHome: string;
  navGallery: string;
  navVisit: string;
  homeTitle: string;
  homeSubtitle: string;
  introHeading: string;
  introBody: string;
  quote: string;
  cta: string;
  galleryTitle: string;
  gallerySubtitle: string;
  searchPlaceholder: string;
  modalFavorite: string;
  modalMedium: string;
  modalDepartment: string;
  visitTitle: string;
  visitIntro: string;
  hoursTitle: string;
  hoursValue: string;
  addressTitle: string;
  addressValue: string;
  formTitle: string;
  formName: string;
  formEmail: string;
  formDate: string;
  formSubmit: string;
  formSuccess: string;
  welcomeBack: string;
  themeLabel: string;
  languageLabel: string;
};

type LanguageContextValue = {
  language: Language;
  setLanguage: (language: Language) => void;
  t: TranslationMap;
};

const translations: Record<Language, TranslationMap> = {
  EN: {
    navHome: 'Home',
    navGallery: 'Gallery',
    navVisit: 'Visit',
    homeTitle: 'The Canvas Room',
    homeSubtitle: 'Current Exhibition: Masterpieces of the 19th Century',
    introHeading: 'A contemporary lens on timeless art',
    introBody: 'Welcome to an intimate digital salon where the language of painting is made accessible, calm, and deeply human.',
    quote: '“Art is a place for growth. A place where the eye learns to see the world anew.”',
    cta: 'Explore Collection',
    galleryTitle: 'The Collection',
    gallerySubtitle: 'Browse works from the Art Institute of Chicago with a curated, modern sensibility.',
    searchPlaceholder: 'Search by title or artist',
    modalFavorite: 'Favorite',
    modalMedium: 'Medium',
    modalDepartment: 'Department',
    visitTitle: 'Plan Your Visit',
    visitIntro: 'Reserve a digital tour and step into a quietly immersive experience.',
    hoursTitle: 'Opening Hours',
    hoursValue: 'Tuesday–Sunday · 10:00 AM – 5:00 PM',
    addressTitle: 'Address',
    addressValue: '10 Rustaveli Avenue, Tbilisi',
    formTitle: 'Book a Digital Tour',
    formName: 'Name',
    formEmail: 'Email',
    formDate: 'Date',
    formSubmit: 'Reserve Ticket',
    formSuccess: 'Reservation confirmed. We will see you soon.',
    welcomeBack: 'Welcome back,',
    themeLabel: 'Theme',
    languageLabel: 'Language',
  },
  GE: {
    navHome: 'მთავარი',
    navGallery: 'გალერეა',
    navVisit: 'ვიზიტი',
    homeTitle: 'კანვასის ოთახი',
    homeSubtitle: 'ახლანდელი გამოფენა: XIX საუკუნის შედევრები',
    introHeading: 'ხელოვნების თანამედროვე ხედვა',
    introBody: 'მოგესალმებით ციფრულ სამყაროში, სადაც ნახატის ენა ხელმისაწვდომი, დამამშვიდებელი და ღრმად ადამიანურია.',
    quote: '“ხელოვნება ზრდის მას, ვინც უყურებს. ადგილი, სადაც თვალი სამყაროს თავიდან ხედავს.”',
    cta: 'გალერეის დათვალიერება',
    galleryTitle: 'კოლექცია',
    gallerySubtitle: 'აღმოაჩინეთ ჩიკაგოს ხელოვნების ინსტიტუტის ნამუშევრები მორთულ, თანამედროვე ფორმატში.',
    searchPlaceholder: 'ძიება სათაურით ან შემსრულებლით',
    modalFavorite: 'რჩეული',
    modalMedium: 'ტექნიკა',
    modalDepartment: 'დეპარტამენტი',
    visitTitle: 'ვიზიტის დაგეგმვა',
    visitIntro: 'დაჯავშნეთ ციფრული ტური და მიიღეთ მშვიდი, ჩაღრმავებული გამოცდილება.',
    hoursTitle: 'გახსნის საათები',
    hoursValue: 'სამშაბათი–კვირა · 10:00 – 17:00',
    addressTitle: 'მისამართი',
    addressValue: 'რუსთაველის გამზირი 10, თბილისი',
    formTitle: 'ციფრული ტურის დაჯავშნა',
    formName: 'სახელი',
    formEmail: 'ელფოსტა',
    formDate: 'თარიღი',
    formSubmit: 'ბილეთის დაჯავშნა',
    formSuccess: 'დაჯავშნა დადასტურდა. მალე გნახავთ.',
    welcomeBack: 'კიდევ გვეწვიეთ,',
    themeLabel: 'თემა',
    languageLabel: 'ენა',
  },
};

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('EN');
  const t = translations[language];

  const value = useMemo(
    () => ({ language, setLanguage, t }),
    [language, t],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
}
