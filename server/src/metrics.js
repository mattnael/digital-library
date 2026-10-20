import client from 'prom-client';

client.collectDefaultMetrics({ prefix: 'digital_library_' });

const httpDuration = new client.Histogram({
  name: 'digital_library_http_request_duration_seconds',
  help: 'Durasi permintaan HTTP dalam detik',
  labelNames: ['method', 'route', 'status'],
  buckets: [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10],
});

export function httpMetrics() {
  return (req, res, next) => {
    const end = httpDuration.startTimer();
    res.on('finish', () => {
      // Route template instead of raw URL so status pages and ids
      // do not explode Prometheus label cardinality.
      const route = req.route?.path ? `${req.baseUrl}${req.route.path}` : 'unmatched';
      end({ method: req.method, route, status: res.statusCode });
    });
    next();
  };
}

export async function metricsHandler(_req, res) {
  res.set('Content-Type', client.register.contentType);
  res.end(await client.register.metrics());
}
