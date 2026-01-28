// 1. ENDEREÇO DA BASE DE COMANDO (API no Render)
const API_URL = "https://miniprojeto-m2.onrender.com/tarefas";

// Configuração do Toast (Notificação rápida de herói)
const toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 2000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener("mouseenter", Swal.stopTimer);
    toast.addEventListener("mouseleave", Swal.resumeTimer);
  },
});

// 2. FUNÇÃO: LISTAR MISSÕES (GET) + MANIPULAÇÃO DO DOM
async function listarTarefas() {
  const container = document.getElementById("lista-tarefas");
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error("Falha ao carregar");
    const tarefas = await res.json();

    container.innerHTML = "";

    if (tarefas.length === 0) {
      container.innerHTML =
        "<p style='text-align:center; font-weight:bold;'>O QG está sem missões no momento. Descanse, herói!</p>";
      return;
    }

    tarefas.forEach((t) => {
      // Ajuste para aceitar tanto "concluída" quanto "concluido"
      const estaConcluida = t.status.toLowerCase().includes("conclui");
      const statusClass = estaConcluida ? "concluida" : "";

      const article = document.createElement("article");
      article.className = `task-card ${statusClass}`;

      article.innerHTML = `
                <div class="task-content">
                    <h3>⚡ ${t.titulo}</h3>
                    <p>${t.descricao || "Sem detalhes adicionais."}</p>
                    <small>STATUS DA MISSÃO: <strong>${t.status.toUpperCase()}</strong></small>
                </div>
                <div class="task-actions">
                    <button class="btn-status" onclick="toggleStatus(${t.id}, '${t.status}')">
                        ${estaConcluida ? "REABRIR" : "CONCLUIR"}
                    </button>
                    <button class="btn-delete" onclick="excluir(${t.id})">ABORTAR</button>
                </div>
            `;
      container.appendChild(article);
    });
  } catch (err) {
    console.error(err);
    container.innerHTML =
      "<div style='color:red; font-weight:bold;'>⚠️ ALERTA: Base de dados fora de alcance!</div>";
  }
}

// 3. FUNÇÃO: CRIAR MISSÃO (POST)
document.getElementById("form-tarefa").addEventListener("submit", async (e) => {
  e.preventDefault();

  const dados = {
    titulo: document.getElementById("titulo").value,
    descricao: document.getElementById("descricao").value,
    status: "pendente",
  };

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dados),
    });

    if (res.ok) {
      Swal.fire({
        title: "MISSÃO LANÇADA!",
        text: "Os heróis já foram notificados.",
        icon: "success",
        confirmButtonColor: "#2ecc71",
      });
      e.target.reset();
      listarTarefas();
    }
  } catch (err) {
    Swal.fire("ERRO NO QG", "Não foi possível registrar a missão.", "error");
  }
});

// 4. FUNÇÃO: DELETAR MISSÃO (DELETE)
async function excluir(id) {
  const confirmacao = await Swal.fire({
    title: "ABORTAR MISSÃO?",
    text: "Isso apagará o registro permanentemente!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#e74c3c",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "SIM, APAGAR!",
    cancelButtonText: "CANCELAR",
  });

  if (confirmacao.isConfirmed) {
    try {
      await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      toast.fire({ icon: "success", title: "Registro de missão destruído!" });
      listarTarefas();
    } catch (err) {
      Swal.fire("ERRO", "A missão não pôde ser abortada.", "error");
    }
  }
}

// 5. FUNÇÃO: ATUALIZAR STATUS (PATCH)
async function toggleStatus(id, atual) {
  const estaConcluida = atual.toLowerCase().includes("conclui");
  const novo = estaConcluida ? "pendente" : "concluída";

  try {
    await fetch(`${API_URL}/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: novo }),
    });

    toast.fire({
      icon: "info",
      title:
        novo === "concluída" ? "Missão cumprida! 🏆" : "Missão reaberta! ⚔️",
    });

    listarTarefas();
  } catch (err) {
    console.error("Erro ao atualizar:", err);
  }
}

// Inicializa o Painel de Controle
window.addEventListener("DOMContentLoaded", listarTarefas);
