// === METE OS TEUS ===
const SUPABASE_URL = "https://SEU-PROJECT.supabase.co";
const SUPABASE_ANON_KEY = "SEU-ANON-KEY";

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const $ = (s) => document.querySelector(s);

async function requireSession() {
  const { data } = await supabase.auth.getSession();
  const session = data.session;

  if (!session) {
    window.location.href = "index.html";
    return null;
  }

  return session;
}

function esc(s) {
  return String(s ?? "").replace(
    /[&<>"']/g,
    (m) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;",
      })[m],
  );
}

async function loadProfile(userId) {
  const { data, error } = await supabase
    .from("profiles")
    .select("first_name,last_name,company,business_area,phone,email,created_at")
    .eq("id", userId)
    .single();

  if (error) return { error };

  return { data };
}

async function loadProjects(userId) {
  const { data, error } = await supabase
    .from("projects")
    .select("id,title,status,created_at")
    .eq("owner_id", userId)
    .order("created_at", { ascending: false });

  if (error) return { error };

  return { data };
}

async function main() {
  const session = await requireSession();
  if (!session) return;

  const user = session.user;

  // UI
  $("#welcome").textContent = "Bem-vindo 👋";
  $("#sub").textContent =
    "Aqui vais ver o teu perfil e o estado do(s) teu(s) projeto(s).";

  // logout
  $("#logoutBtn").addEventListener("click", async () => {
    await supabase.auth.signOut();
    window.location.href = "index.html";
  });

  // perfil
  const prof = await loadProfile(user.id);
  if (prof.error) {
    $("#profileBox").textContent =
      "Não consegui ler o teu perfil. Provável causa: ainda não existe linha em profiles para este user.";
  } else {
    const p = prof.data;
    $("#profileBox").innerHTML = `
      <div><strong>Nome:</strong> ${esc(p.first_name)} ${esc(p.last_name)}</div>
      <div><strong>Empresa:</strong> ${esc(p.company)}</div>
      <div><strong>Área:</strong> ${esc(p.business_area)}</div>
      <div><strong>Telefone:</strong> ${esc(p.phone)}</div>
      <div><strong>Email:</strong> ${esc(p.email)}</div>
    `;
  }

  // projetos
  const proj = await loadProjects(user.id);
  if (proj.error) {
    $("#projectsBox").textContent =
      "Não consegui ler projetos. Se ainda não criaste projetos, isto é normal. Também verifica RLS do projects.";
  } else if (!proj.data.length) {
    $("#projectsBox").textContent =
      "Ainda não tens projetos aqui (vamos criar o 1º quando fizeres onboarding).";
  } else {
    $("#projectsBox").innerHTML = proj.data
      .map(
        (x) => `
        <div style="padding:.75rem 0; border-top: 1px solid rgba(226,232,240,.9);">
          <div><strong>${esc(x.title)}</strong></div>
          <div style="color: var(--text-muted); font-size:.9rem;">
            Estado: ${esc(x.status)} · Criado: ${new Date(x.created_at).toLocaleString("pt-PT")}
          </div>
        </div>
      `,
      )
      .join("");
  }
}

main();
