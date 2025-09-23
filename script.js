document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '/';
    }
});



const mobileMenuBtn = document.getElementById("mobileMenuBtn")
const navMenu = document.getElementById("navMenu")

mobileMenuBtn.addEventListener("click", () => {
  navMenu.classList.toggle("active")
  const icon = mobileMenuBtn.querySelector("i")
  icon.classList.toggle("fa-bars")
  icon.classList.toggle("fa-times")
})

// Smooth Scrolling para links de navegação
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault()
    const target = document.querySelector(this.getAttribute("href"))
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    }
  })
})

// Header scroll effect
window.addEventListener("scroll", () => {
  const header = document.querySelector(".header")
  if (window.scrollY > 100) {
    header.style.backgroundColor = "rgba(255, 255, 255, 0.95)"
    header.style.backdropFilter = "blur(10px)"
  } else {
    header.style.backgroundColor = "white"
    header.style.backdropFilter = "none"
  }
})

// Animação de contadores na seção de estatísticas
const animateCounters = () => {
  const counters = document.querySelectorAll(".stat-number")
  const speed = 200

  counters.forEach((counter) => {
    const updateCount = () => {
      const target = counter.innerText
      const count = +counter.getAttribute("data-count") || 0

      // Extrair apenas números do texto
      const targetNumber = Number.parseInt(target.replace(/[^\d]/g, ""))

      if (!targetNumber) return

      const inc = targetNumber / speed

      if (count < targetNumber) {
        counter.setAttribute("data-count", Math.ceil(count + inc))

        // Manter formatação original
        if (target.includes("R$")) {
          counter.innerText = `R$ ${Math.ceil(count + inc).toLocaleString("pt-BR")}`
        } else if (target.includes("MW")) {
          counter.innerText = `${Math.ceil(count + inc)}MW`
        } else if (target.includes("milhões")) {
          counter.innerText = `${Math.ceil(count + inc)} milhões`
        } else if (target.includes("+")) {
          counter.innerText = `${Math.ceil(count + inc).toLocaleString("pt-BR")}+`
        } else {
          counter.innerText = Math.ceil(count + inc).toLocaleString("pt-BR")
        }

        setTimeout(updateCount, 1)
      } else {
        counter.innerText = target
      }
    }

    updateCount()
  })
}

// Intersection Observer para animações
const observerOptions = {
  threshold: 0.5,
  rootMargin: "0px 0px -100px 0px",
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      if (entry.target.classList.contains("stats")) {
        animateCounters()
      }

      // Adicionar classe de animação para cards
      const cards = entry.target.querySelectorAll(".feature-card, .solution-card")
      cards.forEach((card, index) => {
        setTimeout(() => {
          card.style.opacity = "1"
          card.style.transform = "translateY(0)"
        }, index * 100)
      })
    }
  })
}, observerOptions)

// Observar seções para animações
document.querySelectorAll(".features, .stats, .solutions").forEach((section) => {
  observer.observe(section)
})

// Inicializar cards com estado inicial para animação
document.querySelectorAll(".feature-card, .solution-card").forEach((card) => {
  card.style.opacity = "0"
  card.style.transform = "translateY(20px)"
  card.style.transition = "all 0.6s ease"
})

// Simulador de economia (placeholder)
document.querySelectorAll("button").forEach((button) => {
  if (button.textContent.includes("Calcular") || button.textContent.includes("Simular")) {
    button.addEventListener("click", () => {
      // Abre modal de consumo
      const modal = document.getElementById("consumoModal")
      if (modal) modal.style.display = "flex"
    })
  }

  if (button.textContent.includes("Orçamento")) {
    button.addEventListener("click", () => {
      alert("Formulário de orçamento em desenvolvimento! Entre em contato pelo telefone (11) 3000-0000.")
    })
  }

  if (button.textContent.includes("Especialista")) {
    button.addEventListener("click", () => {
      alert("Chat com especialista em desenvolvimento! Entre em contato pelo email contato@ecoenergia.com.br.")
    })
  }
})

// Adicionar CSS para menu mobile
const style = document.createElement("style")
style.textContent = `
    @media (max-width: 768px) {
        .nav-menu {
            position: absolute;
            top: 100%;
            left: 0;
            width: 100%;
            background-color: white;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            flex-direction: column;
            padding: 1rem;
            transform: translateY(-100%);
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
        }
        
        .nav-menu.active {
            display: flex;
            transform: translateY(0);
            opacity: 1;
            visibility: visible;
        }
        
        .nav-menu a {
            padding: 0.75rem 0;
            border-bottom: 1px solid var(--border);
        }
        
        .nav-menu a:last-child {
            border-bottom: none;
        }
    }
`
document.head.appendChild(style)

// Lógica do modal de consumo (catálogo por categoria, seleção e upsell)
document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("consumoModal")
  const closeBtn = document.getElementById("closeConsumoModal")
  const calcularBtn = document.getElementById("btnCalcularConsumo")
  const resultado = document.getElementById("resultadoConsumo")
  const tarifaInput = document.getElementById("tarifaKwh")
  const listaCategorias = document.getElementById("listaCategorias")
  const listaSelecionados = document.getElementById("listaSelecionados")
  const catalogoGrid = document.getElementById("catalogoGrid")
  const catalogoTitulo = document.getElementById("catalogoTitulo")
  const btnBuscarTarifa = document.getElementById("btnBuscarTarifa")
  const upsellContaAtual = document.getElementById("upsellContaAtual")
  const upsellPlanoA = document.getElementById("upsellPlanoA")
  const upsellPlanoB = document.getElementById("upsellPlanoB")
  const upsellPlanoC = document.getElementById("upsellPlanoC")

  if (closeBtn && modal) {
    closeBtn.addEventListener("click", () => (modal.style.display = "none"))
    modal.addEventListener("click", (e) => {
      if (e.target === modal) modal.style.display = "none"
    })
  }

  // Catálogo por categoria (10 principais + atalho para pesquisar mais no futuro)
  const catalogo = {
    "Cozinha (maiores)": [
      { id: "geladeira", nome: "Geladeira", watts: 150, horas: 24 },
      { id: "refrigerador", nome: "Refrigerador duplex", watts: 200, horas: 24 },
      { id: "freezer", nome: "Freezer", watts: 180, horas: 24 },
      { id: "fogao", nome: "Fogão elétrico/cooktop", watts: 2000, horas: 1 },
      { id: "forno", nome: "Forno elétrico", watts: 1500, horas: 0.7 },
      { id: "microondas", nome: "Micro-ondas", watts: 1200, horas: 0.5 },
      { id: "lava_loucas", nome: "Lava-louças", watts: 1200, horas: 1 }
    ],
    "Cozinha (portáteis)": [
      { id: "liquidificador", nome: "Liquidificador", watts: 400, horas: 0.2 },
      { id: "batedeira", nome: "Batedeira", watts: 300, horas: 0.3 },
      { id: "processador", nome: "Multiprocessador", watts: 500, horas: 0.2 },
      { id: "sanduicheira", nome: "Sanduicheira/Grill", watts: 750, horas: 0.2 },
      { id: "torradeira", nome: "Torradeira", watts: 800, horas: 0.1 },
      { id: "cafeteira", nome: "Cafeteira", watts: 800, horas: 0.3 },
      { id: "espremedor", nome: "Espremedor de frutas", watts: 200, horas: 0.1 },
      { id: "chaleira", nome: "Chaleira elétrica", watts: 1500, horas: 0.15 },
      { id: "airfryer", nome: "Air fryer", watts: 1400, horas: 0.5 },
      { id: "panela_eletrica", nome: "Panela elétrica", watts: 600, horas: 0.8 },
      { id: "mixer", nome: "Mixer de mão", watts: 250, horas: 0.1 }
    ],
    "Lavanderia": [
      { id: "lavar", nome: "Máquina de lavar roupas", watts: 500, horas: 1 },
      { id: "secadora", nome: "Secadora de roupas", watts: 1500, horas: 1 },
      { id: "tanquinho", nome: "Tanquinho", watts: 250, horas: 1 },
      { id: "ferro", nome: "Ferro de passar roupa", watts: 1000, horas: 0.5 },
      { id: "vaporizador", nome: "Vaporizador de roupas", watts: 1200, horas: 0.3 }
    ],
    "Clima e ar": [
      { id: "ar", nome: "Ar-condicionado", watts: 1000, horas: 8 },
      { id: "ventilador", nome: "Ventilador", watts: 60, horas: 8 },
      { id: "aquecedor", nome: "Aquecedor", watts: 1500, horas: 4 },
      { id: "umidificador", nome: "Umidificador", watts: 40, horas: 8 },
      { id: "desumidificador", nome: "Desumidificador", watts: 250, horas: 6 }
    ],
    "Entretenimento/Escritório": [
      { id: "tv", nome: "Televisão", watts: 80, horas: 6 },
      { id: "home", nome: "Home theater/Soundbar", watts: 60, horas: 3 },
      { id: "caixa_bt", nome: "Caixa de som bluetooth", watts: 20, horas: 3 },
      { id: "pc", nome: "PC", watts: 250, horas: 8 },
      { id: "tvbox", nome: "TV Box/Streaming", watts: 10, horas: 4 }
    ],
    "Banheiro": [
      { id: "chuveiro", nome: "Chuveiro elétrico", watts: 5500, horas: 0.5 },
      { id: "secador", nome: "Secador de cabelo", watts: 1200, horas: 0.2 },
      { id: "chapinha", nome: "Chapinha/Babyliss", watts: 500, horas: 0.2 },
      { id: "barbeador", nome: "Barbeador elétrico", watts: 15, horas: 0.1 }
    ],
    "Segurança e outros": [
      { id: "camera", nome: "Câmeras de segurança", watts: 8, horas: 24 },
      { id: "porteiro", nome: "Vídeo porteiro", watts: 15, horas: 24 },
      { id: "robo", nome: "Robô aspirador", watts: 40, horas: 1 },
      { id: "purificador", nome: "Purificador/Bebedouro", watts: 100, horas: 24 },
      { id: "nobreak", nome: "Nobreak/Estabilizador", watts: 20, horas: 24 },
      { id: "aspirador", nome: "Aspirador de pó", watts: 1200, horas: 0.3 }
    ]
  }

  const selecionados = new Map() // id -> {nome, watts, horas, qtd}

  const renderCategorias = () => {
    if (!listaCategorias) return
    listaCategorias.innerHTML = ""
    Object.entries(catalogo).forEach(([categoria]) => {
      const btn = document.createElement("button")
      btn.className = "categoria-btn"
      btn.textContent = categoria
      btn.addEventListener("click", () => {
        document.querySelectorAll('.categoria-btn').forEach(b=>b.classList.remove('active'))
        btn.classList.add('active')
        renderCatalogo(categoria)
      })
      listaCategorias.appendChild(btn)
    })
    // não renderiza nada até clicar
  }

  const iconEl = (iconName) => `<span class=\"material-icons mi\">${iconName}</span>`
  const iconMap = {
    geladeira: 'kitchen', refrigerador: 'kitchen', freezer: 'kitchen',
    microondas: 'microwave', forno: 'oven_gen', fogao: 'stove',
    cafeteira: 'coffee', liquidificador: 'blender', batedeira: 'blender', processador: 'blender', mixer: 'blender',
    sanduicheira: 'lunch_dining', torradeira: 'toaster', espremedor: 'blender', chaleira: 'electric_bolt',
    airfryer: 'air', panela_eletrica: 'soup_kitchen', lava_loucas: 'countertops',
    lavar: 'local_laundry_service', secadora: 'dry_cleaning', tanquinho: 'local_laundry_service', ferro: 'iron', vaporizador: 'heat_pump',
    ar: 'ac_unit', ventilador: 'toys_fan', aquecedor: 'device_thermostat', umidificador: 'water_drop', desumidificador: 'air',
    tv: 'tv', pc: 'computer', home: 'speaker', caixa_bt: 'speaker', tvbox: 'smart_display',
    chuveiro: 'shower', secador: 'air', chapinha: 'straighten', barbeador: 'electric_rickshaw',
    camera: 'videocam', porteiro: 'doorbell', robo: 'robot_vacuum', purificador: 'water_dispenser', nobreak: 'power', aspirador: 'robot_vacuum'
  }
  const iconUrl = (id) => iconEl(iconMap[id] || 'devices_other')

  const renderCatalogo = (categoria) => {
    if (!catalogoGrid) return
    if (catalogoTitulo) catalogoTitulo.textContent = `Catálogo • ${categoria}`
    catalogoGrid.innerHTML = ""
    const itens = catalogo[categoria] || []
    itens.forEach((it) => {
      const card = document.createElement("div")
      card.className = "catalogo-card"
      card.innerHTML = `
        ${iconUrl(it.id)}
        <h5>${it.nome}</h5>
        <p>${it.watts} W • ${it.horas}h/dia</p>
        <button class="btn-secondary add-btn">Adicionar</button>
      `
      card.querySelector('.add-btn').addEventListener('click', () => {
        const atual = selecionados.get(it.id) || { ...it, qtd: 0 }
        atual.qtd += 1
        selecionados.set(it.id, atual)
        renderSelecionados()
      })
      catalogoGrid.appendChild(card)
    })
  }

  const renderSelecionados = () => {
    if (!listaSelecionados) return
    listaSelecionados.innerHTML = ""
    const arr = Array.from(selecionados.values())
    if (arr.length === 0) {
      const vazio = document.createElement("div")
      vazio.textContent = "Nenhum item selecionado ainda."
      vazio.style.color = "var(--muted)"
      listaSelecionados.appendChild(vazio)
      return
    }
    arr.forEach((it) => {
      const card = document.createElement("div")
      card.className = "selecionado-card"
      card.innerHTML = `
        <div class="selecionado-header">
          <span>${it.nome}</span>
          <button class="btn-remove" title="Remover">×</button>
        </div>
        <div class="selecionado-qtde">
          <label>Quantidade
            <input type="number" min="0" value="${it.qtd}" />
          </label>
          <label>Uso diário (h)
            <input type="number" min="0" step="0.1" value="${it.horas}" />
          </label>
        </div>
      `
      const btnRemove = card.querySelector(".btn-remove")
      const inputs = card.querySelectorAll("input")
      btnRemove.addEventListener("click", () => {
        selecionados.delete(it.id)
        renderSelecionados()
      })
      inputs[0].addEventListener("input", (e) => {
        const v = parseFloat(e.target.value) || 0
        const obj = selecionados.get(it.id)
        obj.qtd = v
      })
      inputs[1].addEventListener("input", (e) => {
        const v = parseFloat(e.target.value) || 0
        const obj = selecionados.get(it.id)
        obj.horas = v
      })
      listaSelecionados.appendChild(card)
    })
  }

  renderCategorias()
  renderSelecionados()

  if (btnBuscarTarifa && tarifaInput) {
    btnBuscarTarifa.addEventListener("click", () => {
      const cidade = prompt("Digite sua cidade/UF para pesquisar a tarifa média (ex.: São Paulo/SP):")
      if (!cidade) return
      alert("Pesquisa de tarifa automática em desenvolvimento. Por favor informe manualmente por enquanto.")
      tarifaInput.focus()
    })
  }

  if (calcularBtn && resultado) {
    calcularBtn.addEventListener("click", () => {
      let kwhDia = 0
      selecionados.forEach((it) => {
        kwhDia += (it.watts * it.horas * (it.qtd || 0)) / 1000
      })
      const kwhMes = kwhDia * 30
      const tarifa = parseFloat(tarifaInput && tarifaInput.value) || 0.95
      const custoMes = kwhMes * tarifa
      resultado.style.display = "block"
      resultado.innerHTML = `
        <strong>Resultado:</strong><br/>
        Consumo diário estimado: ${kwhDia.toFixed(2)} kWh/dia<br/>
        Consumo mensal estimado: ${kwhMes.toFixed(2)} kWh/mês<br/>
        Custo mensal estimado: R$ ${custoMes.toFixed(2)}
      `

      // Upsell
      const planoA = custoMes * 0.85
      const planoB = custoMes * 0.75
      const planoC = custoMes * 0.60
      if (upsellContaAtual) upsellContaAtual.textContent = `R$ ${custoMes.toFixed(2)}`
      if (upsellPlanoA) upsellPlanoA.textContent = `R$ ${planoA.toFixed(2)} (economia R$ ${(custoMes-planoA).toFixed(2)})`
      if (upsellPlanoB) upsellPlanoB.textContent = `R$ ${planoB.toFixed(2)} (economia R$ ${(custoMes-planoB).toFixed(2)})`
      if (upsellPlanoC) upsellPlanoC.textContent = `R$ ${planoC.toFixed(2)} (economia R$ ${(custoMes-planoC).toFixed(2)})`
    })
  }
})

// Controle do header: exibir ícone de usuário quando logado e permitir logout
document.addEventListener("DOMContentLoaded", () => {
  const loginLink = document.getElementById("loginLink")
  const userMenu = document.getElementById("userMenu")
  const userButton = document.getElementById("userButton")
  const userDropdown = document.getElementById("userDropdown")
  const logoutBtn = document.getElementById("logoutBtn")

  const hasToken = !!localStorage.getItem("token")

  if (loginLink && userMenu) {
    if (hasToken) {
      loginLink.style.display = "none"
      userMenu.style.display = "inline-block"
    } else {
      loginLink.style.display = "inline-block"
      userMenu.style.display = "none"
    }
  }

  if (userButton && userDropdown && userMenu) {
    userButton.addEventListener("click", (e) => {
      e.stopPropagation()
      const isOpen = userDropdown.style.display === "block"
      userDropdown.style.display = isOpen ? "none" : "block"
    })

    document.addEventListener("click", (e) => {
      if (!userMenu.contains(e.target)) {
        userDropdown.style.display = "none"
      }
    })
  }

  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("token")
      localStorage.removeItem("userId")
      window.location.href = "login.html"
    })
  }
})

document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const body = document.body;

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });

    // Close menu when clicking on links
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            body.style.overflow = '';
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navMenu.contains(e.target) && !hamburger.contains(e.target)) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            body.style.overflow = '';
        }
    });
});

// User menu functionality
const userButton = document.querySelector('.user-button');
const userDropdown = document.querySelector('.user-dropdown');
const logoutButton = document.getElementById('logoutButton');

userButton.addEventListener('click', () => {
    userDropdown.classList.toggle('active');
});

// Close dropdown when clicking outside
document.addEventListener('click', (e) => {
    if (!userButton.contains(e.target) && !userDropdown.contains(e.target)) {
        userDropdown.classList.remove('active');
    }
});

// Logout functionality
logoutButton.addEventListener('click', () => {
    localStorage.removeItem('token');
    window.location.href = '/';
});