-- Enable pg_cron extension
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Schedule archive job (every day at midnight)
SELECT cron.schedule(
    'archive_job',
    '0 0 * * *',
    $$CALL archive_old_measurements(NOW() - INTERVAL '6 months');$$
);

