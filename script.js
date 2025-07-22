const input = document.querySelector("#inputText");
const button = document.querySelector("#btn");
const list = document.querySelector("#list");
const alertBox = document.querySelector("footer");
const closeAlert = alertBox.querySelector("img[alt='fechar']");
const goBack = document.querySelector("#goBack");

const historyStack = []; // Guarda o histórico de ações para desfazer

let alertTimeout; // Para controlar o tempo de exibição do alerta

// Função para deixar a primeira letra maiúscula e o resto minúsculo
const capitalize = (text) => text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();

// Função que mostra o alerta por 3 segundos ou até o usuário fechar
const showAlert = () => {
  alertBox.classList.remove("hide");

  clearTimeout(alertTimeout); // Limpa tempo anterior se existir
  alertTimeout = setTimeout(() => {
    alertBox.classList.add("hide");
  }, 3000);
};

// Fecha o alerta ao clicar no X
closeAlert.addEventListener("click", () => {
  alertBox.classList.add("hide");
});

// Função para remover um item da lista, registrar no histórico e mostrar alerta
function removeItem(div) {
  historyStack.push({
    action: "remove",
    element: div,
    index: Array.from(list.children).indexOf(div)
  });
  div.remove();
  showAlert();
}

// Função para criar o elemento da lista (item)
function createItemElement(value) {
  const div = document.createElement("div");
  div.classList.add("listContainer");

  const itemListName = document.createElement("div");
  itemListName.classList.add("itemListName");

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";

  const span = document.createElement("span");
  span.textContent = value;

  const trash = document.createElement("img");
  trash.src = "./assets/trash.svg";
  trash.alt = "lixeira";
  trash.classList.add("trash");

  // Ao clicar na lixeira, remove o item
  trash.addEventListener("click", () => removeItem(div));

  itemListName.appendChild(checkbox);
  itemListName.appendChild(span);
  div.appendChild(itemListName);
  div.appendChild(trash);

  return div;
}

// Função para adicionar um novo item
function saveValue() {
  const text = input.value.trim();
  if (text === "") return; // Não adiciona se estiver vazio

  const value = capitalize(text);

  // Evita itens duplicados
  const items = list.querySelectorAll(".itemListName span");
  for (let item of items) {
    if (item.textContent.toLowerCase() === value.toLowerCase()) {
      alert("Este item já está na lista!");
      input.value = "";
      input.focus();
      return;
    }
  }

  const item = createItemElement(value);
  list.appendChild(item);

  historyStack.push({ action: "add", element: item });

  input.value = "";
  input.focus(); // Deixa o cursor pronto para o próximo item
}

// Evento no botão "Adicionar"
button.addEventListener("click", (e) => {
  e.preventDefault(); // Evita recarregar a página
  saveValue();
});

// Evento para adicionar item ao pressionar Enter
input.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    saveValue();
  }
});

// Delegação de evento para itens estáticos existentes e futuros
list.addEventListener("click", (e) => {
  if (e.target.classList.contains("trash")) {
    const div = e.target.parentElement;
    removeItem(div);
  }
});

// Função para desfazer a última ação
function undoLastAction() {
  if (historyStack.length === 0) return;

  const lastAction = historyStack.pop();

  if (lastAction.action === "add") {
    // Remove o item que foi adicionado
    lastAction.element.remove();
  } else if (lastAction.action === "remove") {
    // Reinsere o item removido na posição original
    const children = Array.from(list.children);
    if (lastAction.index >= children.length) {
      list.appendChild(lastAction.element);
    } else {
      list.insertBefore(lastAction.element, children[lastAction.index]);
    }

    // Opcional: registra a ação de re-adicionar para permitir "refazer"
    // historyStack.push({ action: "add", element: lastAction.element });
  }
}

// Evento no botão "Voltar"
goBack.addEventListener("click", () => {
  undoLastAction();
});
