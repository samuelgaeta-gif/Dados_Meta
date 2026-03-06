import { useState, useEffect } from "react";
import {
  Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, AreaChart, Area
} from "recharts";

const MOCK_PAGE = {
  name: "Minha Pagina",
  category: "Negocios & Servicos",
  followers: 48320,
  likes: 47105,
  reach_week: 124800,
  avg_engagement_rate: 4.7,
};

const MOCK_POSTS = [
  { date: "26/fev", reach: 12400, likes: 580, comments: 94, shares: 43 },
  { date: "27/fev", reach: 9800,  likes: 430, comments: 61, shares: 29 },
  { date: "28/fev", reach: 15200, likes: 720, comments: 118, shares: 67 },
  { date: "01/mar", reach: 18600, likes: 890, comments: 142, shares: 88 },
  { date: "02/mar", reach: 11300, likes: 510, comments: 75,  shares: 34 },
  { date: "03/mar", reach: 22100, likes: 1140,comments: 203, shares: 115 },
  { date: "04/mar", reach: 16700, likes: 800, comments: 130, shares: 72 },
  { date: "05/mar", reach: 19400, likes: 960, comments: 178, shares: 97 },
];

const MOCK_CONTENT_TYPES = [
  { type: "Video",     engagement: 6.8, posts: 12 },
  { type: "Carrossel", engagement: 5.4, posts: 18 },
  { type: "Imagem",    engagement: 3.9, posts: 24 },
  { type: "Link",      engagement: 2.1, posts: 9  },
  { type: "Reels",     engagement: 8.2, posts: 7  },
];

const MOCK_AUDIENCE = [
  { name: "18-24", value: 18 },
  { name: "25-34", value: 34 },
  { name: "35-44", value: 27 },
  { name: "45-54", value: 13 },
  { name: "55+",   value: 8  },
];

const MOCK_TOP_POSTS = [
  { title: "Lancamento do novo produto X",            date: "03/mar", reach: 22100, engagement: 8.8, type: "Video"     },
  { title: "Dica rapida: como usar nossa ferramenta", date: "01/mar", reach: 18600, engagement: 7.1, type: "Reels"     },
  { title: "Resultados do mes de fevereiro",          date: "05/mar", reach: 19400, engagement: 6.4, type: "Carrossel" },
  { title: "Sorteio exclusivo para seguidores",       date: "28/fev", reach: 15200, engagement: 5.9, type: "Imagem"   },
];

const MOCK_BEST_TIMES = [
  { hora: "08h", sex: 3.5, sab: 4.2, qui: 2.8 },
  { hora: "12h", sex: 4.6, sab: 5.8, qui: 5.4 },
  { hora: "18h", sex: 8.1, sab: 6.9, qui: 7.4 },
  { hora: "21h", sex: 7.2, sab: 5.8, qui: 5.7 },
];

const C = {
  blue:   "#1877F2",
  teal:   "#00C9A7",
  amber:  "#FFB300",
  rose:   "#FF4F6B",
  violet: "#9B5DE5",
  slate:  "#94A3B8",
};
const PIE_COLORS = [C.blue, C.teal, C.amber, C.rose, C.violet];

const fmt = (n) => n >= 1000 ? (n / 1000).toFixed(1) + "k" : String(n);
const engColor = (v) => v >= 7 ? C.teal : v >= 5 ? C.blue : v >= 3 ? C.amber : C.rose;

const card = {
  background: "rgba(255,255,255,0.03)",
  border: "1px solid rgba(255,255,255,0.07)",
  borderRadius: 16,
  padding: 22,
};

function KpiCard({ label, value, sub, accent }) {
  return (
    <div style={{ ...card, display: "flex", flexDirection: "column", gap: 6, position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: accent, borderRadius: "16px 16px 0 0" }} />
      <span style={{ fontSize: 11, color: "#7C8FA8", letterSpacing: 1, textTransform: "uppercase" }}>{label}</span>
      <span style={{ fontSize: 30, fontWeight: 800, color: "#F0F4FF", lineHeight: 1 }}>{value}</span>
      {sub && <span style={{ fontSize: 12, color: "#7C8FA8" }}>{sub}</span>}
    </div>
  );
}

function SectionTitle({ children }) {
  return <h2 style={{ fontSize: 16, fontWeight: 700, color: "#E2E8F0", margin: "0 0 16px" }}>{children}</h2>;
}

function Badge({ label, color }) {
  return (
    <span style={{ background: color + "22", color, fontSize: 11, fontWeight: 700, padding: "3px 9px", borderRadius: 99 }}>
      {label}
    </span>
  );
}

function ChartTip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div style={{ background: "#131B2E", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 10, padding: "11px 15px", fontSize: 13, color: "#CBD5E1" }}>
      <div style={{ fontWeight: 700, marginBottom: 5, color: "#E2E8F0" }}>{label}</div>
      {payload.map((p) => (
        <div key={p.name} style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 2 }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: p.color, display: "inline-block" }} />
          <span>{p.name}: <strong style={{ color: "#F0F4FF" }}>{fmt(p.value)}</strong></span>
        </div>
      ))}
    </div>
  );
}

export default function App() {
  const [tab, setTab] = useState("geral");
  const [loading, setLoading] = useState(true);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 700);
    return () => clearTimeout(t);
  }, []);

  const tabs = [
    { id: "geral",    label: "Visao Geral" },
    { id: "content",  label: "Conteudo"    },
    { id: "audience", label: "Audiencia"   },
    { id: "top",      label: "Top Posts"   },
    { id: "api",      label: "API Config"  },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg,#0B1120,#0F1A2E 60%,#111827)", fontFamily: "system-ui,sans-serif", color: "#E2E8F0" }}>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-thumb { background: #1E293B; border-radius: 3px; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      {/* HEADER */}
      <header style={{ borderBottom: "1px solid rgba(255,255,255,0.07)", padding: "14px 26px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, background: "rgba(11,17,32,0.95)", backdropFilter: "blur(16px)", zIndex: 100 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 36, height: 36, borderRadius: 9, background: "linear-gradient(135deg,#1877F2,#0A4FB4)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 900, color: "#fff" }}>f</div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 15, color: "#F0F4FF" }}>{MOCK_PAGE.name}</div>
            <div style={{ fontSize: 11, color: "#7C8FA8" }}>{MOCK_PAGE.category}</div>
          </div>
        </div>
        <span style={{ padding: "5px 13px", borderRadius: 99, fontSize: 12, fontWeight: 600, background: connected ? C.teal + "22" : "#FFB30022", color: connected ? C.teal : C.amber, border: "1px solid " + (connected ? C.teal + "44" : C.amber + "44") }}>
          {connected ? "Conectado a API" : "Dados simulados"}
        </span>
      </header>

      {/* TABS */}
      <nav style={{ display: "flex", gap: 2, padding: "12px 26px 0", borderBottom: "1px solid rgba(255,255,255,0.06)", overflowX: "auto" }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{ background: tab === t.id ? "rgba(24,119,242,0.15)" : "transparent", border: "none", borderBottom: "2px solid " + (tab === t.id ? C.blue : "transparent"), color: tab === t.id ? "#60A5FA" : "#7C8FA8", padding: "8px 15px", cursor: "pointer", fontSize: 13, fontWeight: 600, fontFamily: "inherit", transition: "all 0.15s", borderRadius: "7px 7px 0 0", whiteSpace: "nowrap" }}>
            {t.label}
          </button>
        ))}
      </nav>

      <main style={{ padding: "24px 26px", maxWidth: 1240, margin: "0 auto" }}>
        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: 280, gap: 12 }}>
            <div style={{ width: 24, height: 24, borderRadius: "50%", border: "3px solid " + C.blue, borderTopColor: "transparent", animation: "spin 0.8s linear infinite" }} />
            <span style={{ color: "#7C8FA8" }}>Carregando dados...</span>
          </div>
        ) : (
          <>
            {/* VISAO GERAL */}
            {tab === "geral" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(190px,1fr))", gap: 14 }}>
                  <KpiCard label="Seguidores"         value={fmt(MOCK_PAGE.followers)}            sub="+1.2% esta semana"       accent={C.blue}   />
                  <KpiCard label="Curtidas na pagina" value={fmt(MOCK_PAGE.likes)}                sub="Crescimento organico"    accent={C.teal}   />
                  <KpiCard label="Alcance 7 dias"     value={fmt(MOCK_PAGE.reach_week)}           sub="Pessoas unicas"          accent={C.amber}  />
                  <KpiCard label="Taxa engajamento"   value={MOCK_PAGE.avg_engagement_rate + "%"} sub="Media dos ultimos posts" accent={C.rose}   />
                </div>

                <div style={card}>
                  <SectionTitle>Alcance e Interacoes - ultimos 8 dias</SectionTitle>
                  <ResponsiveContainer width="100%" height={240}>
                    <AreaChart data={MOCK_POSTS}>
                      <defs>
                        <linearGradient id="gR" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%"  stopColor={C.blue} stopOpacity={0.3} />
                          <stop offset="95%" stopColor={C.blue} stopOpacity={0}   />
                        </linearGradient>
                        <linearGradient id="gL" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%"  stopColor={C.teal} stopOpacity={0.3} />
                          <stop offset="95%" stopColor={C.teal} stopOpacity={0}   />
                        </linearGradient>
                      </defs>
                      <CartesianGrid stroke="rgba(255,255,255,0.05)" />
                      <XAxis dataKey="date" tick={{ fill: "#7C8FA8", fontSize: 12 }} axisLine={false} />
                      <YAxis tick={{ fill: "#7C8FA8", fontSize: 12 }} axisLine={false} tickLine={false} />
                      <Tooltip content={<ChartTip />} />
                      <Legend wrapperStyle={{ color: "#94A3B8", fontSize: 13 }} />
                      <Area type="monotone" dataKey="reach"    name="Alcance"     stroke={C.blue}  fill="url(#gR)" strokeWidth={2.5} />
                      <Area type="monotone" dataKey="likes"    name="Curtidas"    stroke={C.teal}  fill="url(#gL)" strokeWidth={2.5} />
                      <Line type="monotone" dataKey="comments" name="Comentarios" stroke={C.amber} strokeWidth={2} dot={false} />
                      <Line type="monotone" dataKey="shares"   name="Shares"      stroke={C.rose}  strokeWidth={2} dot={false} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                <div style={card}>
                  <SectionTitle>Melhores horarios para postar (engajamento %)</SectionTitle>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={MOCK_BEST_TIMES} barSize={18}>
                      <CartesianGrid stroke="rgba(255,255,255,0.05)" />
                      <XAxis dataKey="hora" tick={{ fill: "#7C8FA8", fontSize: 12 }} axisLine={false} />
                      <YAxis tick={{ fill: "#7C8FA8", fontSize: 12 }} axisLine={false} tickLine={false} />
                      <Tooltip content={<ChartTip />} />
                      <Legend wrapperStyle={{ color: "#94A3B8", fontSize: 13 }} />
                      <Bar dataKey="sex" name="Sexta"  fill={C.blue}   radius={[4,4,0,0]} />
                      <Bar dataKey="sab" name="Sabado" fill={C.teal}   radius={[4,4,0,0]} />
                      <Bar dataKey="qui" name="Quinta" fill={C.violet} radius={[4,4,0,0]} />
                    </BarChart>
                  </ResponsiveContainer>
                  <div style={{ marginTop: 14, padding: "11px 15px", background: C.teal + "15", border: "1px solid " + C.teal + "33", borderRadius: 10, fontSize: 13, color: C.teal }}>
                    Melhor horario: <strong>sexta as 18h</strong> com 8,1% de engajamento. Priorize conteudos de alto impacto nessa janela.
                  </div>
                </div>
              </div>
            )}

            {/* CONTEUDO */}
            {tab === "content" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 20 }}>
                  <div style={card}>
                    <SectionTitle>Engajamento por tipo de conteudo</SectionTitle>
                    <ResponsiveContainer width="100%" height={240}>
                      <BarChart data={MOCK_CONTENT_TYPES} layout="vertical" barSize={20}>
                        <CartesianGrid stroke="rgba(255,255,255,0.05)" horizontal={false} />
                        <XAxis type="number" tick={{ fill: "#7C8FA8", fontSize: 12 }} axisLine={false} />
                        <YAxis type="category" dataKey="type" tick={{ fill: "#CBD5E1", fontSize: 13 }} axisLine={false} tickLine={false} width={72} />
                        <Tooltip content={<ChartTip />} />
                        <Bar dataKey="engagement" name="Engajamento %" radius={[0,6,6,0]}>
                          {MOCK_CONTENT_TYPES.map((e, i) => <Cell key={i} fill={engColor(e.engagement)} />)}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div style={card}>
                    <SectionTitle>Posts por formato</SectionTitle>
                    <ResponsiveContainer width="100%" height={240}>
                      <PieChart>
                        <Pie data={MOCK_CONTENT_TYPES} dataKey="posts" nameKey="type" cx="50%" cy="50%" outerRadius={86} label={({ type, posts }) => type + ": " + posts} labelLine={{ stroke: "#475569" }}>
                          {MOCK_CONTENT_TYPES.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div style={card}>
                  <SectionTitle>Recomendacoes de conteudo</SectionTitle>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 12 }}>
                    {[
                      { icon: "🎬", title: "Invista em Reels",     desc: "8,2% de engajamento - seu melhor formato. Aumente de 7 para 15 posts/mes.", color: C.teal  },
                      { icon: "🎠", title: "Mais Carrosseis",      desc: "5,4% de engajamento. Dobrar a frequencia pode ampliar o alcance organico.", color: C.blue  },
                      { icon: "🔗", title: "Reduza posts de link", desc: "Links tem apenas 2,1% de engajamento. Use com cautela e sempre com imagem.", color: C.rose  },
                      { icon: "⏰", title: "Sextas as 18h",        desc: "Concentre seus melhores conteudos nesse horario de pico para mais alcance.", color: C.amber },
                    ].map(({ icon, title, desc, color }) => (
                      <div key={title} style={{ background: color + "10", border: "1px solid " + color + "30", borderRadius: 12, padding: "15px 17px" }}>
                        <div style={{ fontSize: 22, marginBottom: 8 }}>{icon}</div>
                        <div style={{ fontWeight: 700, fontSize: 13, color: "#E2E8F0", marginBottom: 5 }}>{title}</div>
                        <div style={{ fontSize: 12, color: "#94A3B8", lineHeight: 1.5 }}>{desc}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* AUDIENCIA */}
            {tab === "audience" && (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 20 }}>
                <div style={card}>
                  <SectionTitle>Distribuicao por faixa etaria</SectionTitle>
                  <ResponsiveContainer width="100%" height={260}>
                    <PieChart>
                      <Pie data={MOCK_AUDIENCE} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={55} outerRadius={95} label={({ name, value }) => name + ": " + value + "%"} labelLine={{ stroke: "#475569" }}>
                        {MOCK_AUDIENCE.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
                      </Pie>
                      <Tooltip formatter={(v) => v + "%"} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div style={card}>
                  <SectionTitle>Insights de audiencia</SectionTitle>
                  <div style={{ marginTop: 8 }}>
                    {[
                      { label: "Faixa etaria principal", value: "25-34 anos (34%)",     color: C.blue   },
                      { label: "Genero predominante",    value: "Feminino (58%)",        color: C.rose   },
                      { label: "Principais cidades",     value: "SP, RJ, BH, Curitiba", color: C.teal   },
                      { label: "Idioma",                 value: "Portugues (97%)",        color: C.amber  },
                      { label: "Dispositivo mais usado", value: "Mobile (84%)",           color: C.violet },
                    ].map(({ label, value, color }) => (
                      <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                        <span style={{ fontSize: 13, color: "#94A3B8" }}>{label}</span>
                        <span style={{ fontSize: 12, fontWeight: 700, color, background: color + "18", padding: "3px 10px", borderRadius: 99 }}>{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TOP POSTS */}
            {tab === "top" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <SectionTitle>Posts com maior engajamento</SectionTitle>
                {MOCK_TOP_POSTS.map((post, i) => (
                  <div key={i} style={{ ...card, display: "flex", alignItems: "center", gap: 16 }}>
                    <div style={{ width: 38, height: 38, borderRadius: 9, flexShrink: 0, background: "linear-gradient(135deg," + C.blue + "," + C.violet + ")", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 14, color: "#fff" }}>
                      {"#" + (i + 1)}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, color: "#E2E8F0", marginBottom: 7 }}>{post.title}</div>
                      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                        <Badge label={post.type}                      color={C.blue}  />
                        <Badge label={post.date}                      color={C.slate} />
                        <Badge label={"Alcance: " + fmt(post.reach)}  color={C.teal}  />
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 24, fontWeight: 800, color: engColor(post.engagement) }}>{post.engagement + "%"}</div>
                      <div style={{ fontSize: 11, color: "#7C8FA8" }}>engajamento</div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* API CONFIG */}
            {tab === "api" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                <div style={{ background: "rgba(255,183,0,0.08)", border: "1px solid rgba(255,183,0,0.3)", borderRadius: 12, padding: "13px 17px", color: C.amber, fontSize: 13, lineHeight: 1.6 }}>
                  Modo demo ativo. Os dados sao simulados. Para conectar a sua pagina real, siga os passos abaixo.
                </div>
                {[
                  { step: "1", title: "Crie um App no Facebook Developers", desc: "Acesse developers.facebook.com > Meus Apps > Criar App. Escolha o tipo Business.", code: "https://developers.facebook.com/apps/", color: C.blue   },
                  { step: "2", title: "Ative as permissoes necessarias",    desc: "Em Permissoes e Recursos adicione: pages_read_engagement, pages_show_list, read_insights.", code: '// Permissoes necessarias:\n"pages_read_engagement"\n"pages_show_list"\n"read_insights"', color: C.teal   },
                  { step: "3", title: "Gere o Page Access Token",           desc: "Use o Graph API Explorer para gerar um token de longa duracao para a sua pagina.", code: "GET /me/accounts\n  // copie o access_token da sua pagina", color: C.amber  },
                  { step: "4", title: "Chame a API Graph",                  desc: "Substitua os dados simulados por chamadas reais usando o endpoint abaixo:", code: "const res = await fetch(\n  `https://graph.facebook.com/v19.0/${PAGE_ID}/insights\n  ?metric=page_post_engagements,page_impressions\n  &period=day&access_token=${TOKEN}`\n);\nconst data = await res.json();", color: C.violet },
                ].map(({ step, title, desc, code, color }) => (
                  <div key={step} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid " + color + "30", borderRadius: 13, overflow: "hidden" }}>
                    <div style={{ padding: "13px 20px", borderBottom: "1px solid " + color + "20", display: "flex", alignItems: "center", gap: 13 }}>
                      <span style={{ width: 30, height: 30, borderRadius: "50%", background: color + "25", color, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 13, flexShrink: 0 }}>{step}</span>
                      <div>
                        <div style={{ fontWeight: 700, color: "#E2E8F0", marginBottom: 2 }}>{title}</div>
                        <div style={{ fontSize: 12, color: "#94A3B8" }}>{desc}</div>
                      </div>
                    </div>
                    <pre style={{ background: "#060C1A", padding: "12px 20px", fontSize: 12, fontFamily: "monospace", color: "#7DD3FC", overflowX: "auto", margin: 0, lineHeight: 1.7 }}>{code}</pre>
                  </div>
                ))}
                <button onClick={() => setConnected(true)} style={{ padding: "12px 24px", background: "linear-gradient(135deg,#1877F2,#0A4FB4)", border: "none", borderRadius: 11, color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer", fontFamily: "inherit", alignSelf: "flex-start", boxShadow: "0 4px 16px rgba(24,119,242,0.4)" }}>
                  Simular conexao com a API
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
