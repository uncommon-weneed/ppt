export async function onRequestPost(context) {
  try {
    const { username, password } = await context.request.json();

    const msgBuffer = new TextEncoder().encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashedPassword = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    const user = await context.env.DB.prepare(
      "SELECT * FROM users WHERE username = ? AND password = ?"
    ).bind(username, hashedPassword).first();

    if (!user) {
      return new Response(JSON.stringify({ error: "아이디 또는 비밀번호가 일치하지 않습니다." }), { status: 401 });
    }

    return new Response(JSON.stringify({ success: true, username: user.username }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: "로그인 처리 중 오류가 발생했습니다." }), { status: 500 });
  }
}