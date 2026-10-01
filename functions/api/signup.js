export async function onRequestPost(context) {
  try {
    const { username, password } = await context.request.json();
    if (!username || !password) {
      return new Response(JSON.stringify({ error: "아이디와 비밀번호를 입력해주세요." }), { status: 400 });
    }

    // 간단한 비밀번호 해시 처리 (SHA-256)
    const msgBuffer = new TextEncoder().encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashedPassword = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    await context.env.DB.prepare(
      "INSERT INTO users (username, password) VALUES (?, ?)"
    ).bind(username, hashedPassword).run();

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: "이미 존재하는 아이디이거나 오류가 발생했습니다." }), { status: 400 });
  }
}