import { useEffect, useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

type FormState = {
  name: string;
  email: string;
  date: string;
};

function VisitPage() {
  const { t } = useLanguage();
  const [form, setForm] = useState<FormState>({ name: '', email: '', date: '' });
  const [errors, setErrors] = useState<Partial<FormState>>({});
  const [submittedName, setSubmittedName] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const savedName = window.sessionStorage.getItem('canvas-room-guest');
    if (savedName) {
      setSubmittedName(savedName);
    }
  }, []);

  const handleChange = (field: keyof FormState, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const validate = () => {
    const nextErrors: Partial<FormState> = {};
    if (!form.name.trim()) nextErrors.name = 'Name is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) nextErrors.email = 'Valid email is required';
    if (!form.date) nextErrors.date = 'Date is required';
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!validate()) return;

    window.sessionStorage.setItem('canvas-room-guest', form.name.trim());
    setSubmittedName(form.name.trim());
    setSuccess(true);
    setForm({ name: '', email: '', date: '' });
  };

  return (
    <section className="page visit-page">
      <div className="visit-grid">
        <div className="visit-info">
          <h1>{t.visitTitle}</h1>
          <p>{t.visitIntro}</p>
          <div className="info-block">
            <h2>{t.hoursTitle}</h2>
            <p>{t.hoursValue}</p>
          </div>
          <div className="info-block">
            <h2>{t.addressTitle}</h2>
            <p>{t.addressValue}</p>
          </div>
          {submittedName && (
            <div className="welcome-banner">
              {t.welcomeBack} {submittedName}
            </div>
          )}
        </div>

        <form className="visit-form" onSubmit={handleSubmit} noValidate>
          <h2>{t.formTitle}</h2>
          <label>
            <span>{t.formName}</span>
            <input value={form.name} onChange={(e) => handleChange('name', e.target.value)} />
            {errors.name && <small>{errors.name}</small>}
          </label>
          <label>
            <span>{t.formEmail}</span>
            <input type="email" value={form.email} onChange={(e) => handleChange('email', e.target.value)} />
            {errors.email && <small>{errors.email}</small>}
          </label>
          <label>
            <span>{t.formDate}</span>
            <input type="date" value={form.date} onChange={(e) => handleChange('date', e.target.value)} />
            {errors.date && <small>{errors.date}</small>}
          </label>
          <button type="submit">{t.formSubmit}</button>
          {success && <p className="success-alert">{t.formSuccess}</p>}
        </form>
      </div>
    </section>
  );
}

export default VisitPage;
