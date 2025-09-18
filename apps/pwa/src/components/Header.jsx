import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Search, ShoppingCart } from "lucide-react";
import { useCartStore } from "../store/cartStore";
import { useUIStore } from "../store/uiStore";

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const cartItemsCount = useCartStore((state) =>
    state.items.reduce((sum, item) => sum + item.quantidade, 0)
  );
  const settings = useUIStore((state) => state.settings);

  const showBackButton = location.pathname !== "/";
  const isHomePage = location.pathname === "/";

  const isCheckoutFlow = React.useMemo(() => {
    // ajuste os padrões conforme suas rotas
    return (
      location.pathname.startsWith("/cart") ||
      location.pathname.startsWith("/checkout") ||
      location.pathname.startsWith("/order/")
    );
  }, [location.pathname]);

  const handleBack = () => {
    if (isCheckoutFlow) {
      // Vai pra Home e substitui a entrada atual do histórico
      navigate("/", { replace: true });
    } else {
      navigate(-1);
    }
  };

  const getPageTitle = () => {
    if (location.pathname === "/") return settings.nomeLoja || "Sabor Express";
    if (location.pathname === "/cart") return "Carrinho";
    if (location.pathname === "/checkout") return "Finalizar Pedido";
    if (location.pathname === "/profile") return "Perfil";
    if (location.pathname.includes("/product/")) return "Produto";
    if (location.pathname.includes("/order/")) return "Rastreamento";
    return "Sabor Express";
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50 safe-area-top">
      <div className="px-4 py-3 flex items-center justify-between">
        {showBackButton ? (
          <button
            onClick={handleBack}
            className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </button>
        ) : (
          <div className="w-10" />
        )}

        <h1 className="font-bold text-lg text-gray-900 truncate mx-2">
          {getPageTitle()}
        </h1>

        <div className="flex items-center space-x-2">
          {isHomePage && (
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <Search className="w-6 h-6 text-gray-700" />
            </button>
          )}

          <button
            onClick={() => navigate("/cart")}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors relative"
          >
            <ShoppingCart className="w-6 h-6 text-gray-700" />
            {cartItemsCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                {cartItemsCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
