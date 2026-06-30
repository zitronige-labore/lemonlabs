/*
  Handles HEAD requests for this route.

  Returns a 200 OK response without a response body.
  This can be used by clients or hosting platforms
  to verify that the endpoint is reachable.
*/
export async function HEAD() {
  return new Response(null, { status: 200 });
}