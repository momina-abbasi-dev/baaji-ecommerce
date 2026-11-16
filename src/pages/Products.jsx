import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { API_URL, getProducts } from "../api";

function Products() {
  const [searchParams] = useSearchParams();
  const category = searchParams.get("category");
  const search = searchParams.get("search");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch products based on category or search
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        let url = `${API_URL}/api/products`;

        if (category) {
          const fixedCategory = category.replace(/-/g, " ");
          url = `${API_URL}/api/products?category=${encodeURIComponent(fixedCategory)}`;
        } else if (search) {
          url = `${API_URL}/api/products/search?q=${encodeURIComponent(search)}`;
        }

        const res = await fetch(url);
        if (!res.ok) throw new Error(`Failed to fetch products: ${res.status}`);
        const data = await res.json();

        setProducts(data || []);
        console.log("✅ Products fetched:", data);
      } catch (err) {
        console.error("❌ Error fetching products:", err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category, search]);

  return (
    <div className="allProducts">
      {/* ===== Filter Section ===== */}
      <div className="filter">
        <div className="filterName">
          <h1>{category ? category.replace(/-/g, " ").toUpperCase() : "ALL PRODUCTS"}</h1>
        </div>

        <div className="filterOption">
          <div>
            <p>{products.length} items</p>
          </div>
        </div>
      </div>

      <hr color="#f5f1f1" />

      {/* ===== Products Grid ===== */}
      <div className="products-grid">
        {loading ? (
          <p>Loading...</p>
        ) : products.length > 0 ? (
          products.map((prod) => <ProductCard key={prod._id} product={prod} />)
        ) : (
          <p>
            No products found.
          </p>
        )}
      </div>
    </div>
  );
}

export default Products;