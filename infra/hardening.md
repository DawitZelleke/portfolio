# VPS hardening checklist

Target: Ubuntu 24.04 LTS, any $5–6/mo provider (Hetzner CX22, DigitalOcean
basic droplet). Do these in order, on day one, before deploying anything.

## 1. Access

```bash
# On your laptop — generate a key if you don't have one
ssh-keygen -t ed25519 -C "dawit-portfolio"

# First login as root, then:
adduser dawit
usermod -aG sudo dawit
rsync --archive --chown=dawit:dawit ~/.ssh /home/dawit
```

Edit `/etc/ssh/sshd_config`:

```
PermitRootLogin no
PasswordAuthentication no
```

`sudo systemctl restart ssh`. Confirm you can log in as `dawit` with the
key **before closing the root session**.

## 2. Firewall

```bash
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow OpenSSH
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

Ports 3001 and 5432 are **not** opened — Caddy is the only public entry;
Postgres never leaves the Docker network.

## 3. Fail2ban + automatic updates

```bash
sudo apt update && sudo apt install -y fail2ban unattended-upgrades
sudo dpkg-reconfigure -plow unattended-upgrades
sudo systemctl enable --now fail2ban
```

## 4. Docker

```bash
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker dawit   # log out/in after
```

## 5. Deploy

```bash
sudo mkdir -p /opt/portfolio && sudo chown dawit:dawit /opt/portfolio
git clone https://github.com/DawitZelleke/<repo>.git /opt/portfolio
cd /opt/portfolio/infra
cp .env.example .env    # fill in secrets: openssl rand -hex 32, etc.
docker compose up -d --build
```

Run migrations + seed the admin (first deploy only):

```bash
docker compose exec api node -e "console.log('use drizzle-kit migrate from CI or run bootstrap')"
# From your laptop with DATABASE_URL tunnelled, or a one-off container:
ADMIN_EMAIL=you@domain.com ADMIN_PASSWORD='a long random passphrase' pnpm --filter @portfolio/api seed:admin
```

## 6. Append-only audit log (defense in depth)

The API connects as `portfolio`, which owns the schema. For true
append-only auditing, create a restricted runtime role once the schema
exists:

```sql
CREATE ROLE portfolio_app LOGIN PASSWORD '...';
GRANT CONNECT ON DATABASE portfolio TO portfolio_app;
GRANT USAGE ON SCHEMA public TO portfolio_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO portfolio_app;
REVOKE UPDATE, DELETE ON audit_logs FROM portfolio_app;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO portfolio_app;
```

Point `DATABASE_URL` at `portfolio_app`. Now even a fully compromised API
process cannot rewrite history.

## 7. Backups

```bash
crontab -e
# 0 3 * * * /opt/portfolio/infra/backup.sh >> /var/log/portfolio-backup.log 2>&1
```

Quarterly: actually restore one backup into a scratch database. A backup
that has never been restored is a hope, not a backup.
