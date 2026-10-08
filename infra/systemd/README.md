# systemd user units (rootless Podman hosts)

| Unit | Purpose |
|---|---|
| `portfolio.service` | Starts the compose stack at boot |
| `portfolio-backup.service` | One Postgres dump via `infra/backup.sh` |
| `portfolio-backup.timer` | Runs the backup nightly (~03:00, catches up after downtime) |

Assumes the repo lives at `~/apps/portfolio`.

## Install

```bash
sudo loginctl enable-linger "$USER"          # user services start at boot, no login needed
for u in ~/apps/portfolio/infra/systemd/*.{service,timer}; do
  systemctl --user link "$u"                 # symlink: the repo stays the source of truth
done
systemctl --user daemon-reload
systemctl --user enable --now portfolio.service portfolio-backup.timer
```

## Check

```bash
systemctl --user list-timers                 # next/last backup run
journalctl --user -u portfolio-backup -n 20  # backup logs
ls -lh ~/backups/portfolio/
```

After editing a unit in the repo: `git pull && systemctl --user daemon-reload`.
