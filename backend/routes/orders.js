const express = require("express");
const { body, validationResult } = require("express-validator");
const db = require("../utils/db");
const { authenticateToken, requireAdmin } = require("../middleware/auth");
const { generateOrderId } = require("../utils/id");

const router = express.Router();

/** ========= Validação das seleções (iFood-like) =========
 * perguntasSelecionadas por item:
 * - single/multiple/flavor: perguntasSelecionadas[perguntaId] => string[] (ids) OU mapa { [optionId]: number }
 * - quantity: perguntasSelecionadas[perguntaId] => { [optionId]: number }
 * - text: perguntasSelecionadas[perguntaId] => string (ou string[])
 */
function validateSelections(product, selections) {
  const errors = [];
  const perguntas = product.perguntas || [];

  for (const g of perguntas) {
    const tipo = g.tipo;
    const sel = selections ? selections[g.id] : undefined;

    if (tipo === "text") {
      const value = Array.isArray(sel) ? sel[0] : sel;
      if (g.obrigatoria && (!value || String(value).trim() === "")) {
        errors.push(`"${g.titulo}" é obrigatória.`);
      }
      continue;
    }

    if (tipo === "single" || tipo === "multiple" || tipo === "flavor") {
      // Aceita array de ids OU mapa id->quantidade (ex.: stepper no front)
      const asArray = Array.isArray(sel)
        ? sel
        : sel && typeof sel === "object"
        ? Object.entries(sel).flatMap(([id, q]) =>
            Array(Math.max(0, Number(q) || 0)).fill(id)
          )
        : [];

      const min = g.obrigatoria ? Math.max(1, g.min || 1) : g.min || 0;
      const max = g.max || (tipo === "single" ? 1 : 0); // 0 = sem limite

      if (asArray.length < min)
        errors.push(`"${g.titulo}": selecione pelo menos ${min}.`);
      if (max > 0 && asArray.length > max)
        errors.push(`"${g.titulo}": selecione no máximo ${max}.`);

      // opções válidas
      for (const optionId of asArray) {
        const found = g.opcoes?.find((o) => o.id === optionId);
        if (!found) errors.push(`"${g.titulo}": opção inválida (${optionId}).`);
      }

      // flavor: respeita fracionamento
      if (
        tipo === "flavor" &&
        g.fracionamento &&
        asArray.length > g.fracionamento
      ) {
        errors.push(`"${g.titulo}": no máximo ${g.fracionamento} sabor(es).`);
      }

      continue;
    }

    if (tipo === "quantity") {
      const map =
        sel && typeof sel === "object" && !Array.isArray(sel) ? sel : {};
      const sum = Object.values(map).reduce((a, b) => a + (Number(b) || 0), 0);
      const min = g.min || 0;
      const max = g.max || 0;

      if (sum < min)
        errors.push(`"${g.titulo}": quantidade mínima total é ${min}.`);
      if (max > 0 && sum > max)
        errors.push(`"${g.titulo}": quantidade máxima total é ${max}.`);

      // por opção
      (g.opcoes || []).forEach((op) => {
        const q = Number(map[op.id] || 0);
        if (op.qtyMin != null && q < op.qtyMin)
          errors.push(`"${op.label}": mínimo ${op.qtyMin}.`);
        if (op.qtyMax != null && op.qtyMax > 0 && q > op.qtyMax)
          errors.push(`"${op.label}": máximo ${op.qtyMax}.`);
      });
      continue;
    }
  }

  return { ok: errors.length === 0, errors };
}

/** ========= Motor de preço =========
 * - single/multiple:
 *    -> se vier array: soma 1x o delta de cada id
 *    -> se vier mapa: soma delta * quantidade
 * - quantity: delta * quantidade por opção
 * - flavor: regra 'maior' | 'media' | 'soma' (frações iguais por padrão; aceita weights)
 */
function computePrice(product, selections, fractionWeightsByQuestion = {}) {
  let total = Number(product.precoBase || 0);
  const perguntas = product.perguntas || [];

  for (const g of perguntas) {
    const tipo = g.tipo;
    const sel = selections ? selections[g.id] : undefined;
    if (!sel) continue;

    if (tipo === "single" || tipo === "multiple") {
      if (Array.isArray(sel)) {
        for (const id of sel) {
          const op = g.opcoes?.find((o) => o.id === id);
          if (op) total += Number(op.deltaPreco || 0);
        }
      } else if (sel && typeof sel === "object") {
        for (const [id, qtyRaw] of Object.entries(sel)) {
          const qty = Math.max(0, Number(qtyRaw) || 0);
          if (!qty) continue;
          const op = g.opcoes?.find((o) => o.id === id);
          if (op) total += qty * Number(op.deltaPreco || 0);
        }
      }
      continue;
    }

    if (tipo === "quantity") {
      const map =
        sel && typeof sel === "object" && !Array.isArray(sel) ? sel : {};
      for (const op of g.opcoes || []) {
        const q = Number(map[op.id] || 0);
        total += q * Number(op.deltaPreco || 0);
      }
      continue;
    }

    if (tipo === "flavor") {
      const ids = Array.isArray(sel)
        ? sel
        : sel && typeof sel === "object"
        ? Object.entries(sel).flatMap(([id, q]) =>
            Array(Math.max(0, Number(q) || 0)).fill(id)
          )
        : [];

      if (ids.length === 0) continue;

      const deltas = ids.map((id) => {
        const op = g.opcoes?.find((o) => o.id === id);
        return op ? Number(op.deltaPreco || 0) : 0;
      });

      const rule = g.pricingRule || "maior";
      const fracs =
        fractionWeightsByQuestion[g.id] &&
        Array.isArray(fractionWeightsByQuestion[g.id]) &&
        fractionWeightsByQuestion[g.id].length === deltas.length
          ? fractionWeightsByQuestion[g.id]
          : Array(deltas.length).fill(1 / deltas.length);

      let add = 0;
      if (rule === "maior") add = Math.max(...deltas);
      else if (rule === "media")
        add = deltas.reduce((a, b) => a + b, 0) / deltas.length;
      else if (rule === "soma")
        add = deltas.reduce((sum, d, i) => sum + d * (fracs[i] || 0), 0);
      else add = Math.max(...deltas);

      total += add;
      continue;
    }
    // text: não soma
  }

  return Math.max(0, Number(total.toFixed(2)));
}

/** ===================== ROTAS ===================== */

// GET /orders/by-phone?phone=...
router.get("/by-phone", (req, res) => {
  try {
    const { phone } = req.query;
    if (!phone)
      return res.status(400).json({ error: 'Parâmetro "phone" é obrigatório' });

    const onlyDigits = (v) => String(v || "").replace(/\D/g, "");
    let orders = db
      .findAll("orders")
      .filter((o) => onlyDigits(o.cliente?.telefone) === onlyDigits(phone))
      .sort((a, b) => new Date(b.criadoEm) - new Date(a.criadoEm));

    res.json({ orders, total: orders.length });
  } catch (error) {
    console.error("Get orders by phone error:", error);
    res.status(500).json({ error: "Erro ao buscar pedidos por telefone" });
  }
});

// GET /orders/active?phone=...
router.get("/active", (req, res) => {
  try {
    const { phone } = req.query;
    if (!phone)
      return res.status(400).json({ error: 'Parâmetro "phone" é obrigatório' });

    const onlyDigits = (v) => String(v || "").replace(/\D/g, "");
    const isActive = (s) => !["concluido", "cancelado"].includes(s);

    const orders = db
      .findAll("orders")
      .filter((o) => onlyDigits(o.cliente?.telefone) === onlyDigits(phone))
      .sort((a, b) => new Date(b.criadoEm) - new Date(a.criadoEm));

    const active = orders.find((o) => isActive(o.status)) || null;
    res.json({ active });
  } catch (error) {
    console.error("Get active order error:", error);
    res.status(500).json({ error: "Erro ao buscar pedido ativo" });
  }
});

// Get all orders (admin / listagem geral)
router.get("/", (req, res) => {
  try {
    const { status, limit, offset } = req.query;
    let orders = db.findAll("orders");

    if (status) orders = orders.filter((order) => order.status === status);
    orders = orders.sort((a, b) => new Date(b.criadoEm) - new Date(a.criadoEm));

    const limitNum = parseInt(limit) || 50;
    const offsetNum = parseInt(offset) || 0;
    const paginatedOrders = orders.slice(offsetNum, offsetNum + limitNum);

    res.json({ orders: paginatedOrders, total: orders.length });
  } catch (error) {
    console.error("Get orders error:", error);
    res.status(500).json({ error: "Erro ao buscar pedidos" });
  }
});

// Get order by ID
router.get("/:id", (req, res) => {
  try {
    const order = db.findById("orders", req.params.id);
    if (!order) return res.status(404).json({ error: "Pedido não encontrado" });
    res.json(order);
  } catch (error) {
    console.error("Get order error:", error);
    res.status(500).json({ error: "Erro ao buscar pedido" });
  }
});

// Create new order
router.post(
  "/",
  [
    body("itens").isArray({ min: 1 }).withMessage("Deve ter pelo menos 1 item"),
    body("cliente.nome")
      .notEmpty()
      .withMessage("Nome do cliente é obrigatório"),
    body("cliente.telefone").notEmpty().withMessage("Telefone é obrigatório"),
    body("endereco.rua").notEmpty().withMessage("Endereço é obrigatório"),
    body("pagamento.metodo")
      .isIn(["dinheiro", "cartao_maquina", "pix"])
      .withMessage("Método de pagamento inválido"),
  ],
  (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(400).json({ errors: errors.array() });

      const { itens, cliente, endereco, pagamento, observacoes } = req.body;

      let subtotal = 0;
      const validatedItems = [];

      for (const item of itens) {
        const product = db.findById("products", item.produtoId);
        if (!product || !product.ativo) {
          return res.status(400).json({
            error: `Produto ${item.produtoId} não encontrado ou inativo`,
          });
        }

        // 1) Validar perguntas
        const { ok, errors: selErrors } = validateSelections(
          product,
          item.perguntasSelecionadas || {}
        );
        if (!ok) {
          return res
            .status(400)
            .json({ error: "Seleção inválida", detalhes: selErrors });
        }

        // 2) Calcular preço (aceita fractionWeights opcionais)
        const price = computePrice(
          product,
          item.perguntasSelecionadas || {},
          item.fractionWeights || {}
        );
        const quantity = item.quantidade || 1;
        const itemSubtotal = price * quantity;

        validatedItems.push({
          produtoId: product.id,
          nome: product.nome,
          quantidade: quantity,
          precoBase: product.precoBase,
          perguntasSelecionadas: item.perguntasSelecionadas || {},
          precoFinal: price,
          subtotal: itemSubtotal,
        });

        subtotal += itemSubtotal;
      }

      const settings = db.getSettings();
      // const taxaEntrega = settings.taxaEntregaPadrao || 0;
      // usa a taxa calculada no front quando vier numérica; senão fallback (settings ou 0)
      const taxaEntrega = Number.isFinite(Number(req.body?.taxaEntrega))
        ? Number(req.body.taxaEntrega)
        : settings.taxaEntregaPadrao || 0;
      const total = subtotal + taxaEntrega;

      const newOrder = {
        id: generateOrderId(),
        status: "novo",
        itens: validatedItems,
        subtotal,
        taxaEntrega,
        descontos: 0,
        total,
        pagamento: {
          metodo: pagamento.metodo,
          status: "pendente",
          troco: pagamento.troco || 0,
        },
        cliente,
        endereco,
        observacoes: observacoes || "",
        criadoEm: new Date().toISOString(),
        historico: [
          { status: "novo", em: new Date().toISOString(), por: "sistema" },
        ],
      };

      db.create("orders", newOrder);
      req.io.emit("order:new", newOrder);
      res.status(201).json(newOrder);
    } catch (error) {
      console.error("Create order error:", error);
      res.status(500).json({ error: "Erro ao criar pedido" });
    }
  }
);

// Update order status (admin only)
router.patch(
  "/:id/status",
  authenticateToken,
  requireAdmin,
  [
    body("status")
      .isIn([
        "novo",
        "aceito",
        "preparo",
        "pronto",
        "a_caminho",
        "concluido",
        "cancelado",
      ])
      .withMessage("Status inválido"),
  ],
  (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(400).json({ errors: errors.array() });

      const { status } = req.body;
      const motivo = req.body.motivo || "";

      const order = db.findById("orders", req.params.id);
      if (!order)
        return res.status(404).json({ error: "Pedido não encontrado" });

      const historyEntry = {
        status,
        em: new Date().toISOString(),
        por: req.user.nome || req.user.email,
        motivo,
      };
      const updatedOrder = db.update("orders", req.params.id, {
        status,
        historico: [...order.historico, historyEntry],
      });

      req.io.emit("order:update", updatedOrder);
      res.json(updatedOrder);
    } catch (error) {
      console.error("Update order status error:", error);
      res.status(500).json({ error: "Erro ao atualizar status do pedido" });
    }
  }
);

// Get stats (admin)
router.get("/stats/summary", authenticateToken, requireAdmin, (req, res) => {
  try {
    const orders = db.findAll("orders");
    const today = new Date().toISOString().split("T")[0];

    const todayOrders = orders.filter((order) =>
      order.criadoEm.startsWith(today)
    );
    const stats = {
      hoje: {
        total: todayOrders.length,
        faturamento: todayOrders.reduce(
          (sum, order) => sum + (order.total || 0),
          0
        ),
        ticketMedio:
          todayOrders.length > 0
            ? todayOrders.reduce((sum, order) => sum + (order.total || 0), 0) /
              todayOrders.length
            : 0,
      },
      statusCount: {
        novo: orders.filter((o) => o.status === "novo").length,
        aceito: orders.filter((o) => o.status === "aceito").length,
        preparo: orders.filter((o) => o.status === "preparo").length,
        pronto: orders.filter((o) => o.status === "pronto").length,
        a_caminho: orders.filter((o) => o.status === "a_caminho").length,
        concluido: orders.filter((o) => o.status === "concluido").length,
        cancelado: orders.filter((o) => o.status === "cancelado").length,
      },
    };

    res.json(stats);
  } catch (error) {
    console.error("Get order stats error:", error);
    res.status(500).json({ error: "Erro ao buscar estatísticas" });
  }
});

module.exports = router;
