import { useEffect, useState, useMemo } from "react";
import ProductCard from "../components/ProductCard";
import Chip from "../components/Chip";

function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chosenCategory, setChosenCategory] = useState("All");
  const [sort, setSort] = useState(""); // default sort by price
  const [order, setOrder] = useState(""); // default order is ascending

  useEffect(() => {
    console.log("Category Changes");
    const url =
      chosenCategory == "All"
        ? `https://dummyjson.com/products?sort=${sort}&order=${order}`
        : `https://dummyjson.com/products/category/${chosenCategory}?sort=${sort}&order=${order}`;
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.products);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [chosenCategory, sort, order]);

  useEffect(() => {
    fetch("https://dummyjson.com/products/categories")
      .then((res) => res.json())
      .then((data) => {
        setCategories(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);
  const sortedProducts = useMemo(() => {
    if (!products) return [];
    return [...products].sort((a, b) => {
      if (sort === "price") {
        return order === "asc" ? a.price - b.price : b.price - a.price;
      } else if (sort === "rating") {
        return order === "asc" ? a.rating - b.rating : b.rating - a.rating;
      }
      return 0;
    });
  }, [products, sort, order]);
  return (
    <div className="container mx-auto">
      {loading ? (
        <h1 className="text-center text-3xl">Loading...</h1>
      ) : (
        <div>
          <div className=" overflow-x-scroll mb-4">
            <Chip isChosen={chosenCategory === "All"} title={"All"} />
            {categories.map((category) => (
              <Chip
                isChosen={chosenCategory === category.slug}
                onClick={() => setChosenCategory(category.slug)}
                key={category.slug}
                title={category.name}
              />
            ))}
          </div>
          <div className="flex justify-between mb-4">
            <h2 className="text-2xl">Sort by:</h2>
            <div className="flex">
              <button
                className="cursor-pointer hover:bg-purple-100 inline-block m-2 p-2 w-fit px-4 border border-purple-200 rounded-md"
                onClick={() => {
                  setSort("price");
                  setOrder("asc");
                }}
              >
                Price (Low to High)
              </button>
              <button
                className="cursor-pointer hover:bg-purple-100 inline-block m-2 p-2 w-fit px-4 border border-purple-200 rounded-md"
                onClick={() => {
                  setSort("price");
                  setOrder("desc");
                }}
              >
                Price (High to Low)
              </button>
              <button
                className="cursor-pointer hover:bg-purple-100 inline-block m-2 p-2 w-fit px-4 border border-purple-200 rounded-md"
                onClick={() => {
                  setSort("rating");
                  setOrder("asc");
                }}
              >
                Rating (Low to High)
              </button>
              <button
                className="cursor-pointer hover:bg-purple-100 inline-block m-2 p-2 w-fit px-4 border border-purple-200 rounded-md"
                onClick={() => {
                  setSort("rating");
                  setOrder("desc");
                }}
              >
                Rating (High to Low)
              </button>
            </div>
          </div>
          <div className="flex flex-wrap">
            {sortedProducts.map((data) => (
              <ProductCard info={data} key={data.id} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Products;
