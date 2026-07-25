import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Reveal } from '@/components/motion';
import { Section } from '@/components/layout/Section';
import { Button } from '@/components/ui/Button';
import { FieldWrap, TextArea, TextInput } from '@/components/ui/Field';
import { site } from '@/content/site';
import { submitContact } from '@/lib/api';

const contactFormSchema = z.object({
  name: z.string().min(1, 'Please add your name.').max(120),
  email: z.string().email('That email doesn’t look right.'),
  subject: z.string().max(160).optional(),
  body: z.string().min(10, 'Tell me a little more — at least a sentence.').max(4000),
  website: z.string().max(0).optional(), // honeypot: must stay empty
});
type ContactForm = z.infer<typeof contactFormSchema>;

export function ContactSection() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactForm>({ resolver: zodResolver(contactFormSchema) });

  const mutation = useMutation({
    mutationFn: submitContact,
    onSuccess: () => reset(),
  });

  return (
    <Section id="contact" entry="06 · open channel" title="Let’s talk">
      <div className="grid gap-10 md:grid-cols-[2fr_3fr]">
        <Reveal className="space-y-5 text-[1.02rem] leading-relaxed text-ink-soft">
          <p>
            Hiring for a co-op or internship? Building something for your organization?
            I read everything that comes through here.
          </p>
          <p>
            Prefer email? Reach me directly at{' '}
            <a className="font-semibold text-accent underline-offset-4 hover:underline" href={`mailto:${site.email}`}>
              {site.email}
            </a>
            .
          </p>
          <p className="ledger">responses within 24h, usually faster</p>
        </Reveal>

        <Reveal>
          {mutation.isSuccess ? (
            <div
              className="rounded-card border border-moss/30 bg-moss-tint p-8 text-center"
              role="status"
            >
              <p className="font-display text-title font-semibold text-moss">Message sent</p>
              <p className="mt-2 text-ink-soft">
                Thanks — it’s in my inbox. I’ll get back to you within a day.
              </p>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit((values) => mutation.mutate(values))}
              className="space-y-5 rounded-card border border-line bg-surface p-6 shadow-card sm:p-8"
              noValidate
            >
              <div className="grid gap-5 sm:grid-cols-2">
                <FieldWrap label="Name" htmlFor="name" error={errors.name?.message}>
                  <TextInput
                    id="name"
                    autoComplete="name"
                    aria-invalid={!!errors.name}
                    {...register('name')}
                  />
                </FieldWrap>
                <FieldWrap label="Email" htmlFor="email" error={errors.email?.message}>
                  <TextInput
                    id="email"
                    type="email"
                    autoComplete="email"
                    aria-invalid={!!errors.email}
                    {...register('email')}
                  />
                </FieldWrap>
              </div>
              <FieldWrap label="Subject" htmlFor="subject" hint="Optional" error={errors.subject?.message}>
                <TextInput id="subject" aria-invalid={!!errors.subject} {...register('subject')} />
              </FieldWrap>
              <FieldWrap label="Message" htmlFor="body" error={errors.body?.message}>
                <TextArea id="body" aria-invalid={!!errors.body} {...register('body')} />
              </FieldWrap>

              {/* Honeypot — hidden from real users, tempting to bots */}
              <div aria-hidden="true" className="absolute -left-[9999px] top-auto">
                <label htmlFor="website">Website</label>
                <input id="website" type="text" tabIndex={-1} autoComplete="off" {...register('website')} />
              </div>

              {mutation.isError && (
                <p className="rounded-field bg-danger-tint px-4 py-3 text-sm font-medium text-danger" role="alert">
                  {mutation.error instanceof Error
                    ? mutation.error.message
                    : 'Could not send your message.'}{' '}
                  You can always email me directly instead.
                </p>
              )}

              <Button type="submit" disabled={mutation.isPending} className="w-full sm:w-auto">
                {mutation.isPending ? 'Sending…' : 'Send message'}
              </Button>
            </form>
          )}
        </Reveal>
      </div>
    </Section>
  );
}
