const fs = require("fs").promises;
const path = require("path");

class Database {
  constructor() {
    this.dataDir = path.join(__dirname, "../data");
    this.data = {
      categories: [],
      products: [],
      orders: [],
      users: [],
      settings: {},
    };
    this.pendingWrites = new Map();
    this.init();
  }

  async init() {
    try {
      // Ensure data directory exists
      await fs.mkdir(this.dataDir, { recursive: true });

      // Load all data files
      await this.loadData();

      console.log("📚 Banco de dados em memória inicializado");
    } catch (error) {
      console.error("❌ Erro ao inicializar banco:", error);
    }
  }

  async loadData() {
    const files = ["categories", "products", "orders", "users", "settings"];

    for (const file of files) {
      try {
        const filePath = path.join(this.dataDir, `${file}.json`);
        const data = await fs.readFile(filePath, "utf8");
        this.data[file] = JSON.parse(data);
      } catch (error) {
        // File doesn't exist or is invalid, use default data
        this.data[file] = this.getDefaultData(file);
        await this.saveData(file);
      }
    }
  }

  getDefaultData(type) {
    const defaults = {
      categories: [
        { id: "cat_pizzas", nome: "Pizzas", ordem: 1, ativa: true },
        { id: "cat_lanches", nome: "Lanches", ordem: 2, ativa: true },
        { id: "cat_bebidas", nome: "Bebidas", ordem: 3, ativa: true },
      ],
      products: [
        {
          id: "prod_1",
          nome: "Pizza Marguerita",
          descricao: "Molho de tomate, mussarela, tomate fresco e manjericão",
          categoriaId: "cat_pizzas",
          precoBase: 35.9,
          imagem: "/imgs/pizza-marguerita.jpg",
          ativo: true,
          perguntas: [
            {
              id: "q_tamanho",
              titulo: "Escolha o tamanho",
              tipo: "single",
              obrigatoria: true,
              min: 1,
              max: 1,
              opcoes: [
                {
                  id: "op_peq",
                  label: "Pequena (25cm)",
                  deltaPreco: -5.0,
                  selecionadaPorPadrao: false,
                },
                {
                  id: "op_med",
                  label: "Média (30cm)",
                  deltaPreco: 0.0,
                  selecionadaPorPadrao: true,
                },
                {
                  id: "op_grd",
                  label: "Grande (35cm)",
                  deltaPreco: 10.0,
                  selecionadaPorPadrao: false,
                },
              ],
            },
            {
              id: "q_adicionais",
              titulo: "Adicionais",
              tipo: "multiple",
              obrigatoria: false,
              min: 0,
              max: 5,
              opcoes: [
                { id: "op_bacon", label: "Bacon", deltaPreco: 5.0 },
                { id: "op_queijo", label: "Queijo extra", deltaPreco: 4.0 },
                { id: "op_azeitona", label: "Azeitona", deltaPreco: 3.0 },
              ],
            },
            {
              id: "q_obs",
              titulo: "Observações",
              tipo: "text",
              obrigatoria: false,
              placeholder: "Ex: sem cebola, massa fina",
            },
          ],
        },
        {
          id: "prod_2",
          nome: "X-Burger Clássico",
          descricao:
            "Hambúrguer artesanal, queijo, alface, tomate e molho especial",
          categoriaId: "cat_lanches",
          precoBase: 18.9,
          imagem: "/imgs/xburger.jpg",
          ativo: true,
          perguntas: [
            {
              id: "q_ponto",
              titulo: "Ponto da carne",
              tipo: "single",
              obrigatoria: true,
              min: 1,
              max: 1,
              opcoes: [
                { id: "op_mal", label: "Mal passado", deltaPreco: 0.0 },
                {
                  id: "op_ao_ponto",
                  label: "Ao ponto",
                  deltaPreco: 0.0,
                  selecionadaPorPadrao: true,
                },
                { id: "op_bem", label: "Bem passado", deltaPreco: 0.0 },
              ],
            },
            {
              id: "q_extras",
              titulo: "Extras",
              tipo: "multiple",
              obrigatoria: false,
              min: 0,
              max: 3,
              opcoes: [
                { id: "op_batata", label: "Batata frita", deltaPreco: 6.0 },
                { id: "op_refri", label: "Refrigerante lata", deltaPreco: 4.5 },
              ],
            },
          ],
        },
        {
          id: "prod_3",
          nome: "Coca-Cola",
          descricao: "Refrigerante gelado",
          categoriaId: "cat_bebidas",
          precoBase: 5.5,
          imagem: "/imgs/coca.jpg",
          ativo: true,
          perguntas: [
            {
              id: "q_tamanho_bebida",
              titulo: "Tamanho",
              tipo: "single",
              obrigatoria: true,
              min: 1,
              max: 1,
              opcoes: [
                {
                  id: "op_lata",
                  label: "Lata 350ml",
                  deltaPreco: 0.0,
                  selecionadaPorPadrao: true,
                },
                { id: "op_600", label: "Garrafa 600ml", deltaPreco: 2.0 },
                { id: "op_2l", label: "Garrafa 2L", deltaPreco: 4.5 },
              ],
            },
          ],
        },
      ],
      orders: [],
      users: [
        {
          id: "user_1",
          email: "admin@delivery.com",
          senha: "$2b$10$rOzJaHsNTr5V2yGz5Fq1oeJ4j4j4j4j4j4j4j4j4j4j4j4j4j4j4j", // senha: admin123
          nome: "Administrador",
          papel: "admin",
        },
      ],
      settings: {
        nomeLoja: "Sabor Express",
        horarios: { seg_dom: "18:00-23:59" },
        tempoMedioPreparoMin: 25,
        taxaEntregaPadrao: 8.0,
        raioEntregaKm: 6,
        metodosPagamento: ["dinheiro", "cartao_maquina", "pix"],
        endereco: "Rua das Flores, 123 - Centro",
      },
    };

    return defaults[type] || (Array.isArray(this.data[type]) ? [] : {});
  }

  async saveData(type) {
    // Debounce writes to prevent excessive I/O
    if (this.pendingWrites.has(type)) {
      clearTimeout(this.pendingWrites.get(type));
    }

    this.pendingWrites.set(
      type,
      setTimeout(async () => {
        try {
          const filePath = path.join(this.dataDir, `${type}.json`);
          await fs.writeFile(
            filePath,
            JSON.stringify(this.data[type], null, 2)
          );
          this.pendingWrites.delete(type);
        } catch (error) {
          console.error(`❌ Erro ao salvar ${type}:`, error);
        }
      }, 500)
    );
  }

  // Generic CRUD operations
  findAll(type) {
    return this.data[type] || [];
  }

  findById(type, id) {
    if (Array.isArray(this.data[type])) {
      return this.data[type].find((item) => item.id === id);
    }
    return null;
  }

  create(type, item) {
    if (!Array.isArray(this.data[type])) {
      this.data[type] = [];
    }
    this.data[type].push(item);
    this.saveData(type);
    return item;
  }

  update(type, id, updates) {
    if (!Array.isArray(this.data[type])) return null;

    const index = this.data[type].findIndex((item) => item.id === id);
    if (index === -1) return null;

    this.data[type][index] = { ...this.data[type][index], ...updates };
    this.saveData(type);
    return this.data[type][index];
  }

  delete(type, id) {
    if (!Array.isArray(this.data[type])) return false;

    const index = this.data[type].findIndex((item) => item.id === id);
    if (index === -1) return false;

    this.data[type].splice(index, 1);
    this.saveData(type);
    return true;
  }

  // Settings operations
  getSettings() {
    return this.data.settings || {};
  }

  updateSettings(updates) {
    this.data.settings = { ...this.data.settings, ...updates };
    this.saveData("settings");
    return this.data.settings;
  }
}

// Export singleton instance
module.exports = new Database();
