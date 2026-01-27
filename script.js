const API_URL = "http://localhost:3000/tarefas";

// Garante que o SweetAlert só seja chamado após o carregamento
const alertar = (config) => {
  if (typeof Swal !== "undefined") {
    Swal.fire(config);
  } else {
    alert(config.text); // Fallback caso a internet falhe
  }
};

document.getElementById("form-tarefa").addEventListener("submit", async (e) => {
  e.preventDefault();
  const titulo = document.getElementById("titulo").value;
  const descricao = document.getElementById("descricao").value;

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        descricao: `${titulo}: ${descricao}`,
        status: "pendente",
      }),
    });

    if (response.ok) {
      alertar({
        title: "MISSÃO LANÇADA!",
        text: "A missão foi registrada no painel.",
        icon: "success",
        confirmButtonColor: "#2ecc71",
      });
      document.getElementById("form-tarefa").reset();
      // Chame sua função de listar aqui
    }
  } catch (error) {
    alertar({
      title: "ERRO NO QG!",
      text: "Falha na comunicação com a base.",
      icon: "error",
    });
  }
});
