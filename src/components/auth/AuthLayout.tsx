import type { ReactNode } from 'react';

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  asideTitle: ReactNode;
  asideDescription: string;
  stats: Array<{
    value: string;
    label: string;
  }>;
  children: ReactNode;
}

const AuthLayout = ({
  title,
  subtitle,
  asideTitle,
  asideDescription,
  stats,
  children,
}: AuthLayoutProps) => {
  return (
    <div className="auth-breakout">
      <aside className="auth-aside">
        <div className="aside-ring-tl" />
        <div className="aside-ring-bl" />

        <div className="aside-wordmark">MovieManager</div>

        <div className="aside-body">
          <p className="aside-quote">{asideTitle}</p>
          <p className="aside-sub">{asideDescription}</p>
        </div>

        <div className="aside-stats">
          {stats.map((stat) => (
            <div className="stat-item" key={stat.label}>
              <span className="stat-num">{stat.value}</span>
              <span className="stat-lbl">{stat.label}</span>
            </div>
          ))}
        </div>
      </aside>

      <main className="auth-main">
        <section className="auth-card">
          <div className="auth-head">
            <h1 className="auth-title">{title}</h1>
            <p className="auth-subtitle">{subtitle}</p>
          </div>

          {children}
        </section>
      </main>
    </div>
  );
};

export default AuthLayout;
