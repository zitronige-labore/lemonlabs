export async function register() {
  // execute only in nodejs environment, not in edge runtime
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { deleteOldCases } = await import('./app/actions');

    // execute deleteOldCases immediately on startup
    await deleteOldCases();
    console.log('[Cleanup] deleteOldCases beim Start ausgeführt.');

    // repeat every 24 hours

    // variable to track if the function is currently running
    let running = false;

    setInterval(async () => {
      if (running) {
        return; // Skip if the previous execution is still running
      }
      running = true;
      try {
        await deleteOldCases();
        console.log('[Cleanup] deleteOldCases ausgeführt (24h-Intervall).');
      } finally {
        running = false;
      }
    }, 24 * 60 * 60 * 1000);
  }


  console.log("instrumentation.ts register() called");
}
