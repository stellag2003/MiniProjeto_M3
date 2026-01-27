const API_URL = "https://miniprojeto-m2.onrender.com/tarefas";

// Configuração do Toast (notificação pequena que some sozinha)
const toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 2500,
  timerProgressBar: true,
});

// 1. Carregar Tarefas (GET)
async function carregarTarefas() {
  try {
    const response = await fetch(API_URL);
    const tarefas = await response.json();
    renderizarTarefas(tarefas);
  } catch (error) {
    console.error("Erro ao buscar tarefas:", error);
  }
}

// 2. Renderizar no DOM (Manipulação do DOM)
function renderizarTarefas(tarefas) {
  const lista = document.getElementById("task-list");
  lista.innerHTML = ""; // Limpa a lista antes de reconstruir

  tarefas.forEach((tarefa) => {
    const li = document.createElement("li");
    li.className = `task-item ${tarefa.status === "concluido" ? "done" : ""}`;

    li.innerHTML = `
            <span>${tarefa.descricao}</span>
            <div class="actions">
                <button onclick="alternarStatus(${tarefa.id}, '${tarefa.status}')">
                    ${tarefa.status === "concluido" ? "↩️" : "✅"}
                </button>
                <button onclick="excluirTarefa(${tarefa.id})">🗑️</button>
            </div>
        `;
    lista.appendChild(li);
  });
}

// 3. Criar Nova Tarefa (POST)
document.getElementById("task-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const input = document.getElementById("task-input");
  const descricao = input.value;

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ descricao, status: "pendente" }),
    });

    if (response.ok) {
      input.value = "";
      toast.fire({ icon: "success", title: "Tarefa adicionada!" });
      carregarTarefas();
    }
  } catch (error) {
    Swal.fire("Erro", "Não foi possível salvar a tarefa.", "error");
  }
});

// 4. Excluir Tarefa (DELETE + SweetAlert de Confirmação)
async function excluirTarefa(id) {
  const result = await Swal.fire({
    title: "Tem certeza?",
    text: "Você não poderá reverter isso!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Sim, deletar!",
    cancelButtonText: "Cancelar",
  });

  if (result.isConfirmed) {
    try {
      await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      toast.fire({ icon: "success", title: "Tarefa removida." });
      carregarTarefas();
    } catch (error) {
      Swal.fire("Erro", "Falha ao deletar.", "error");
    }
  }
}

// 5. Mudar Status (PATCH)
async function alternarStatus(id, statusAtual) {
  const novoStatus = statusAtual === "pendente" ? "concluido" : "pendente";

  try {
    await fetch(`${API_URL}/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: novoStatus }),
    });
    carregarTarefas();
  } catch (error) {
    console.error("Erro ao atualizar status");
  }
}

// Inicialização
carregarTarefas();
