import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CreditCard, Banknote, Smartphone, LocateFixed } from "lucide-react";
import { useCartStore } from "../store/cartStore";
import { useUIStore } from "../store/uiStore";
import ApiService from "../services/api";

// utils de entrega
import {
  fetchViaCEP,
  reverseGeocodeBR,
  getUserCoordsSmart,
  quoteDelivery,
} from "../../../../backend/utils/delivery";

export default function Checkout() {
  const navigate = useNavigate();
  const { items, getTotal, clearCart } = useCartStore();
  const { showSuccess, showError } = useUIStore();

  const [loading, setLoading] = useState(false);
  const [deliveryFee, setDeliveryFee] = useState(0);
  const [detectedAddress, setDetectedAddress] = useState(null);
  const [locationInfo, setLocationInfo] = useState({
    mode: null,
    accuracy: null,
  });

  const [formData, setFormData] = useState({
    cliente: { nome: "", telefone: "" },
    endereco: { cep: "", rua: "", numero: "", bairro: "", complemento: "" },
    pagamento: { metodo: "pix", troco: 0 },
    observacoes: "",
  });

  const subtotal = getTotal();
  const total = subtotal + (deliveryFee || 0);

  const formatPrice = (price) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price || 0);

  const handleInputChange = (section, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: { ...prev[section], [field]: value },
    }));
  };

  // Buscar CEP manual
  async function handleSearchCEP() {
    try {
      setLoading(true);
      const vc = await fetchViaCEP(formData.endereco.cep);
      setFormData((prev) => ({
        ...prev,
        endereco: {
          ...prev.endereco,
          cep: vc.cep,
          rua: vc.rua || prev.endereco.rua,
          bairro: vc.bairro || prev.endereco.bairro,
        },
      }));
      setDetectedAddress(
        `${vc.rua || "Rua não identificada"}${
          vc.bairro ? " — " + vc.bairro : ""
        }${vc.cep ? " (CEP " + vc.cep + ")" : ""}`
      );
      showSuccess("Endereço preenchido pelo CEP.");
    } catch (e) {
      showError(e.message || "Não foi possível buscar o CEP.");
    } finally {
      setLoading(false);
    }
  }

  // Usar minha localização
  async function handleUseMyLocation() {
    try {
      setLoading(true);

      const { lat, lon, accuracy, mode } = await getUserCoordsSmart();
      const user = { lat, lon };
      setLocationInfo({ mode, accuracy });

      const { fee } = await quoteDelivery(user);
      setDeliveryFee(fee);

      try {
        const addr = await reverseGeocodeBR(user);
        setFormData((prev) => ({
          ...prev,
          endereco: {
            ...prev.endereco,
            cep: addr.cep || prev.endereco.cep,
            rua: addr.rua || prev.endereco.rua,
            numero: addr.numero || prev.endereco.numero,
            bairro: addr.bairro || prev.endereco.bairro,
          },
        }));
        setDetectedAddress(
          `${addr.rua || "Rua não identificada"}${
            addr.numero ? ", " + addr.numero : ""
          }${addr.bairro ? " — " + addr.bairro : ""}${
            addr.cep ? " (CEP " + addr.cep + ")" : ""
          }`
        );
      } catch (e) {
        console.warn("[REVERSE] falhou:", e);
      }
    } catch (e) {
      console.error("[LOCALIZAÇÃO] erro:", e);
      showError("Não foi possível obter sua localização (nem por IP).");
    } finally {
      setLoading(false);
    }
  }

  // Helpers de perguntas
  const isNonEmptyArray = (v) => Array.isArray(v) && v.length > 0;
  const mapHasAny = (obj) => {
    if (!obj || typeof obj !== "object" || Array.isArray(obj)) return false;
    const vals = Object.values(obj);
    if (vals.length === 0) return false;
    return vals.some((v) => (typeof v === "number" ? v > 0 : !!v));
  };
  const expandMapToArray = (obj) => {
    if (!obj || typeof obj !== "object" || Array.isArray(obj)) return [];
    const out = [];
    for (const [id, raw] of Object.entries(obj)) {
      const qty = typeof raw === "number" ? raw : raw ? 1 : 0;
      for (let i = 0; i < Math.max(0, qty); i++) out.push(id);
    }
    return out;
  };
  const buildPerguntasSelecionadas = (item) => {
    const schema = item.perguntas || item.product?.perguntas || [];
    const A = item.perguntasSelecionadas || {};
    const B =
      item.selectedOptions || item.selecoes || item.opcoesSelecionadas || {};
    const result = {};
    for (const q of schema) {
      const a = A[q.id];
      const b = B[q.id];
      if (q.tipo === "text") {
        let val = Array.isArray(a) ? a[0] : a;
        if (!val || String(val).trim() === "") {
          const alt = Array.isArray(b) ? b[0] : b;
          val = (alt && String(alt)) || "";
        }
        result[q.id] = val;
        continue;
      }
      if (q.tipo === "single" || q.tipo === "flavor") {
        let arr =
          (isNonEmptyArray(a) && a) ||
          (isNonEmptyArray(b) && b) ||
          (mapHasAny(b) ? expandMapToArray(b) : []);
        result[q.id] = arr;
        continue;
      }
      if (q.tipo === "multiple" || q.tipo === "quantity") {
        if (mapHasAny(a)) {
          result[q.id] = a;
          continue;
        }
        if (mapHasAny(b)) {
          result[q.id] = b;
          continue;
        }
        if (isNonEmptyArray(a)) {
          result[q.id] = a;
          continue;
        }
        if (isNonEmptyArray(b)) {
          result[q.id] = b;
          continue;
        }
        result[q.id] = {};
        continue;
      }
      result[q.id] = a ?? b ?? null;
    }
    return result;
  };

  const extrairProdutoId = (item) =>
    item.produtoId ||
    item.productId ||
    item.id ||
    item?.produto?.id ||
    item?.product?.id;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (items.length === 0) return showError("Seu carrinho está vazio");
    if (
      !formData.cliente.nome ||
      !formData.cliente.telefone ||
      !formData.endereco.rua ||
      !formData.endereco.numero ||
      !formData.endereco.bairro
    ) {
      return showError(
        "Por favor, preencha todos os campos obrigatórios do endereço"
      );
    }

    try {
      setLoading(true);

      const itens = items.map((item, idx) => {
        const produtoId = extrairProdutoId(item);
        const perguntasSelecionadas = buildPerguntasSelecionadas(item);
        const quantidade = item.quantidade ?? item.qty ?? item.quantity ?? 1;
        console.log(`[CHECKOUT] Item do carrinho #${idx}`, item);
        return { produtoId, quantidade, perguntasSelecionadas };
      });

      const orderData = {
        itens,
        cliente: formData.cliente,
        endereco: formData.endereco,
        pagamento: formData.pagamento,
        observacoes: formData.observacoes,
        taxaEntrega: deliveryFee,
      };

      console.log("[CHECKOUT] Payload enviado para /api/orders:", orderData);

      const order = await ApiService.createOrder(orderData);
      clearCart();
      showSuccess("Pedido realizado com sucesso!");
      navigate(`/order/${order.id}`);
    } catch (error) {
      console.error("Error creating order:", error);
      showError(error.message || "Erro ao criar pedido. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const paymentMethods = [
    { id: "pix", name: "PIX", icon: Smartphone },
    { id: "cartao_maquina", name: "Cartão na entrega", icon: CreditCard },
    { id: "dinheiro", name: "Dinheiro", icon: Banknote },
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      <form onSubmit={handleSubmit} className="px-4 py-4 pb-32">
        {/* Customer Info */}
        <div className="card p-4 mb-4">
          <h3 className="font-semibold text-gray-900 mb-4">Dados Pessoais</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome completo *
              </label>
              <input
                type="text"
                value={formData.cliente.nome}
                onChange={(e) =>
                  handleInputChange("cliente", "nome", e.target.value)
                }
                className="input"
                placeholder="Seu nome"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Telefone *
              </label>
              <input
                type="tel"
                value={formData.cliente.telefone}
                onChange={(e) =>
                  handleInputChange("cliente", "telefone", e.target.value)
                }
                className="input"
                placeholder="(00) 00000-0000"
                required
              />
            </div>
          </div>
        </div>

        {/* Address */}
        <div className="card p-4 mb-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-gray-900">Endereço de Entrega</h3>
            <button
              type="button"
              onClick={handleUseMyLocation}
              title="Usar minha localização para preencher o endereço e calcular a taxa"
              aria-label="Usar minha localização"
              className="border rounded-md p-2 hover:bg-red-50 border-red-200"
            >
              <LocateFixed className="w-5 h-5 text-red-600" />
            </button>
          </div>

          {detectedAddress && (
            <div className="text-xs mb-3 text-gray-700 bg-gray-100 border border-gray-200 rounded px-2 py-1">
              Endereço detectado: <strong>{detectedAddress}</strong>
              {locationInfo?.mode?.startsWith("ip") && (
                <span className="ml-1 text-[11px] text-red-600">
                  (aproximação por IP — pode estar impreciso)
                </span>
              )}
              {locationInfo?.mode?.startsWith("geo") &&
                locationInfo?.accuracy != null && (
                  <span className="ml-1 text-[11px] text-gray-600">
                    (~{Math.round(locationInfo.accuracy)} m)
                  </span>
                )}
            </div>
          )}

          {/* CEP + Botão (vermelho) lado a lado (no mobile empilha) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                CEP
              </label>

              {/* INPUT + BOTÃO LADO A LADO */}
              <div className="flex items-stretch gap-2">
                <input
                  type="text"
                  value={formData.endereco.cep}
                  onChange={(e) =>
                    handleInputChange("endereco", "cep", e.target.value)
                  }
                  className="input flex-1"
                  placeholder="66000-000"
                  inputMode="numeric"
                />

                <button
                  type="button"
                  onClick={handleSearchCEP}
                  className="px-4 h-10 rounded-md text-sm
                 bg-red-600 hover:bg-red-700 text-white
                 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2
                 shrink-0"
                >
                  Buscar CEP
                </button>
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rua / Logradouro *
              </label>
              <input
                type="text"
                value={formData.endereco.rua}
                onChange={(e) =>
                  handleInputChange("endereco", "rua", e.target.value)
                }
                className="input"
                placeholder="Nome da rua"
                required
              />
            </div>
          </div>

          {/* Número + Bairro */}
          {/* Número + Bairro — Bairro maior */}
          <div className="flex items-stretch gap-2 mt-3">
            {/* Número: largura fixa pequena */}
            <div className="shrink-0 w-28 sm:w-32">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Número *
              </label>
              <input
                type="text"
                value={formData.endereco.numero}
                onChange={(e) =>
                  handleInputChange("endereco", "numero", e.target.value)
                }
                className="input h-10 w-full"
                placeholder="123"
                required
              />
            </div>

            {/* Bairro: ocupa todo o restante */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bairro *
              </label>
              <input
                type="text"
                value={formData.endereco.bairro}
                onChange={(e) =>
                  handleInputChange("endereco", "bairro", e.target.value)
                }
                className="input h-10 w-full"
                placeholder="Centro"
                required
              />
            </div>
          </div>

          <div className="mt-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Complemento
            </label>
            <input
              type="text"
              value={formData.endereco.complemento}
              onChange={(e) =>
                handleInputChange("endereco", "complemento", e.target.value)
              }
              className="input"
              placeholder="Apt 101, Bloco B"
            />
          </div>
        </div>

        {/* Payment Method */}
        <div className="card p-4 mb-4">
          <h3 className="font-semibold text-gray-900 mb-4">
            Forma de Pagamento
          </h3>
          <div className="space-y-2 mb-4">
            {[
              { id: "pix", name: "PIX", icon: Smartphone },
              {
                id: "cartao_maquina",
                name: "Cartão na entrega",
                icon: CreditCard,
              },
              { id: "dinheiro", name: "Dinheiro", icon: Banknote },
            ].map((method) => {
              const Icon = method.icon;
              return (
                <label
                  key={method.id}
                  className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                    formData.pagamento.metodo === method.id
                      ? "border-primary-500 bg-primary-50"
                      : "border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value={method.id}
                    checked={formData.pagamento.metodo === method.id}
                    onChange={(e) =>
                      handleInputChange("pagamento", "metodo", e.target.value)
                    }
                    className="w-4 h-4 text-primary-500 border-gray-300 focus:ring-primary-500"
                  />
                  <Icon className="w-5 h-5 ml-3 text-gray-600" />
                  <span className="ml-2 text-gray-900">{method.name}</span>
                </label>
              );
            })}
          </div>

          {formData.pagamento.metodo === "dinheiro" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Troco para quanto?
              </label>
              <input
                type="number"
                value={formData.pagamento.troco}
                onChange={(e) =>
                  handleInputChange(
                    "pagamento",
                    "troco",
                    parseFloat(e.target.value) || 0
                  )
                }
                className="input"
                placeholder="0,00"
                step="0.01"
                min={total}
              />
            </div>
          )}
        </div>

        {/* Observations */}
        <div className="card p-4 mb-4">
          <h3 className="font-semibold text-gray-900 mb-4">Observações</h3>
          <textarea
            value={formData.observacoes}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, observacoes: e.target.value }))
            }
            className="input"
            rows={3}
            placeholder="Observações sobre o pedido (opcional)"
          />
        </div>

        {/* Order Summary */}
        <div className="card p-4 mb-6">
          <h3 className="font-semibold text-gray-900 mb-3">Resumo do Pedido</h3>
          <div className="space-y-2 text-sm mb-4">
            {items.map((item) => (
              <div
                key={item.id || item.produtoId || item.productId}
                className="flex justify-between"
              >
                <span className="text-gray-600">
                  {item.quantidade ?? item.qty ?? item.quantity ?? 1}x{" "}
                  {item.nome || item.name}
                </span>
                <span>
                  {formatPrice(
                    (item.precoCalculado || item.price || 0) *
                      (item.quantidade ?? item.qty ?? item.quantity ?? 1)
                  )}
                </span>
              </div>
            ))}
          </div>
          <div className="space-y-2 text-sm border-t pt-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Taxa de entrega</span>
              <span>{formatPrice(deliveryFee)}</span>
            </div>
            <hr className="my-2" />
            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span className="text-primary-600">{formatPrice(total)}</span>
            </div>
          </div>
        </div>
      </form>

      {/* Submit Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 safe-area-bottom">
        <button
          type="submit"
          onClick={handleSubmit}
          disabled={loading || items.length === 0}
          className="btn-primary w-full py-4 text-lg font-semibold flex items-center justify-center gap-2"
        >
          {loading && <div className="loading-spinner"></div>}
          Confirmar Pedido • {formatPrice(total)}
        </button>
      </div>
    </div>
  );
}
