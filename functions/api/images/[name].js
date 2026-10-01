export async function onRequestGet(context) {
  const imageName = context.params.name;
  const object = await context.env.BUCKET.get(imageName);

  if (!object) {
    return new Response("Image not found", { status: 404 });
  }

  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set("etag", object.httpEtag);

  return new Response(object.body, { headers });
}