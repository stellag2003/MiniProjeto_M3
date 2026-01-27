const API_URL = "https://stellag2003.github.io/MiniProjeto---M2/";

// FUNÇÃO: LISTAR (GET) + MANIPULAÇÃO DO DOM
async function listarTarefas() {
  const container = document.getElementById("lista-tarefas");
  try {
    const res = await fetch(API_URL);
    const tarefas = await res.json();

    container.innerHTML = "";
    tarefas.forEach((t) => {
      const statusClass = t.status === "concluída" ? "concluida" : "";
      const article = document.createElement("article");
      article.className = `task-card ${statusClass}`;

      article.innerHTML = `
    <div class="task-content">
        <h3>${t.titulo}</h3>
        <p>${t.descricao || ""}</p>
        <div class="status-area">
            <label>Status:</label>
            <select onchange="atualizarStatusManual(${t.id}, this.value)">
                <option value="pendente" ${t.status === "pendente" ? "selected" : ""}>Pendente</option>
                <option value="em andamento" ${t.status === "em andamento" ? "selected" : ""}>Em Andamento</option>
                <option value="concluido" ${t.status === "concluido" ? "selected" : ""}>Concluído</option>
            </select>
        </div>
    </div>
    <div class="task-actions">
        <button class="btn-delete" onclick="excluir(${t.id})">Excluir</button>
    </div>
`;
      container.appendChild(article);
    });
  } catch (err) {
    container.innerHTML = "<p>Erro ao conectar com a API.</p>";
  }
}

// FUNÇÃO: CRIAR (POST)
document.getElementById("form-tarefa").addEventListener("submit", async (e) => {
  e.preventDefault();
  const dados = {
    titulo: document.getElementById("titulo").value,
    descricao: document.getElementById("descricao").value,
    status: "pendente",
  };

  await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dados),
  });

  e.target.reset();
  listarTarefas(); // Atualiza o DOM dinamicamente
});

// FUNÇÃO: DELETAR (DELETE)
async function excluir(id) {
  if (confirm("Deseja apagar?")) {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    listarTarefas(); // Atualiza o DOM dinamicamente
  }
}

// FUNÇÃO: ATUALIZAR STATUS (PATCH/PUT)
async function toggleStatus(id, statusAtual) {
  // O seu backend exige 'concluido' (sem acento) segundo o erro do console
  const novoStatus = statusAtual === "concluido" ? "pendente" : "concluido";

  console.log(`Enviando para o banco: ${novoStatus}`);

  try {
    const response = await fetch(`${API_URL}/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: novoStatus }),
    });

    if (response.ok) {
      // MANIPULAÇÃO DO DOM: Atualiza a lista dinamicamente
      listarTarefas();
    } else {
      console.error("Erro na validação do Sequelize.");
    }
  } catch (error) {
    console.error("Erro na requisição:", error);
  }
}

async function atualizarStatusManual(id, novoStatus) {
  try {
    const res = await fetch(`${API_URL}/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: novoStatus }),
    });

    if (res.ok) {
      console.log("Status atualizado para:", novoStatus);
      listarTarefas(); // Atualiza o DOM dinamicamente
    } else {
      alert("Erro ao atualizar no banco de dados.");
    }
  } catch (error) {
    console.error("Erro na requisição:", error);
  }
}

window.addEventListener("DOMContentLoaded", listarTarefas);
