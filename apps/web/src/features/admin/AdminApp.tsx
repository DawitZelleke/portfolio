import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { NavLink, Navigate, Route, Routes } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/Button';
import { FieldWrap, TextInput } from '@/components/ui/Field';
import { adminSession, login, logout, tryRefresh } from './adminApi';
import { ProjectsAdminPage } from './ProjectsAdminPage';
import { MessagesPage } from './MessagesPage';
import { AuditPage } from './AuditPage';

function LoginPage({ onAuthed }: { onAuthed: () => void }) {
  const { register, handleSubmit } = useForm<{ email: string; password: string }>();
  const mutation = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      login(email, password),
    onSuccess: onAuthed,
  });

  return (
    <div className="mx-auto max-w-sm px-5 pb-24 pt-40">
      <p className="ledger ledger-rule mb-4">restricted · admin</p>
      <h1 className="font-display text-display font-semibold text-ink">Sign in</h1>
      <form
        className="mt-8 space-y-5"
        onSubmit={handleSubmit((v) => mutation.mutate(v))}
        noValidate
      >
        <FieldWrap label="Email" htmlFor="admin-email">
          <TextInput id="admin-email" type="email" autoComplete="username" {...register('email')} />
        </FieldWrap>
        <FieldWrap label="Password" htmlFor="admin-password">
          <TextInput
            id="admin-password"
            type="password"
            autoComplete="current-password"
            {...register('password')}
          />
        </FieldWrap>
        {mutation.isError && (
          <p className="rounded-field bg-danger-tint px-4 py-3 text-sm font-medium text-danger" role="alert">
            {mutation.error instanceof Error ? mutation.error.message : 'Sign-in failed.'}
          </p>
        )}
        <Button type="submit" disabled={mutation.isPending} className="w-full">
          {mutation.isPending ? 'Signing in…' : 'Sign in'}
        </Button>
      </form>
    </div>
  );
}

function AdminLayout({ onSignOut, children }: { onSignOut: () => void; children: React.ReactNode }) {
  const items = [
    { to: '/admin/projects', label: 'Projects' },
    { to: '/admin/messages', label: 'Messages' },
    { to: '/admin/audit', label: 'Audit log' },
  ];
  return (
    <div className="mx-auto w-full max-w-6xl px-5 pb-24 pt-28 sm:px-8">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-line pb-4">
        <div className="flex items-center gap-1">
          {items.map((i) => (
            <NavLink
              key={i.to}
              to={i.to}
              className={({ isActive }) =>
                `rounded-button px-3 py-2 text-sm font-semibold transition-colors ${
                  isActive ? 'bg-accent-tint text-accent-deep' : 'text-ink-soft hover:text-ink'
                }`
              }
            >
              {i.label}
            </NavLink>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs text-ink-faint">{adminSession.user?.email}</span>
          <Button variant="secondary" onClick={onSignOut} className="!min-h-9 !px-3 !py-1.5 text-sm">
            Sign out
          </Button>
        </div>
      </div>
      {children}
    </div>
  );
}

export function AdminApp() {
  const [state, setState] = useState<'checking' | 'anon' | 'authed'>('checking');
  const queryClient = useQueryClient();

  useEffect(() => {
    if (adminSession.isAuthed) {
      setState('authed');
      return;
    }
    tryRefresh().then((user) => setState(user ? 'authed' : 'anon'));
  }, []);

  const signOut = async () => {
    await logout();
    queryClient.clear();
    setState('anon');
  };

  if (state === 'checking') {
    return <div className="px-5 pt-40 text-center text-ink-soft">Checking session…</div>;
  }
  if (state === 'anon') {
    return <LoginPage onAuthed={() => setState('authed')} />;
  }
  return (
    <AdminLayout onSignOut={signOut}>
      <Routes>
        <Route index element={<Navigate to="projects" replace />} />
        <Route path="projects" element={<ProjectsAdminPage onSessionExpired={signOut} />} />
        <Route path="messages" element={<MessagesPage onSessionExpired={signOut} />} />
        <Route path="audit" element={<AuditPage onSessionExpired={signOut} />} />
        <Route path="*" element={<Navigate to="projects" replace />} />
      </Routes>
    </AdminLayout>
  );
}
