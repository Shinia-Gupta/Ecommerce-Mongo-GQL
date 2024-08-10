import Product from "./models/product.model.js";
const resolvers = {
  Query: {
    getProducts: async (parent, { skip = 0, limit = 20 }, context, info) => {
      try {
        const products = await Product.find().skip(skip).limit(limit).exec();
        const resultCount = await Product.countDocuments();
        return { products, resultCount };
      } catch (error) {
        console.error("Error fetching products:", error);
        throw new Error("Unable to fetch products");
      }
    },

    searchProducts: async (
      parent,
      { term, skip = 0, limit = 10, filters, sort },
      context,
      info
    ) => {
      try {
        const filterConditions = { $text: { $search: term } };

        if (filters) {
          if (filters.categories?.length) {
            filterConditions.categories = { $in: filters.categories };
          }
          if (filters.manufacturers?.length) {
            filterConditions.manufacturer = { $in: filters.manufacturers };
          }
          if (filters.types?.length) {
            filterConditions.type = { $in: filters.types };
          }
          if (filters.priceRanges?.length) {
            filterConditions.salePrice_range = { $in: filters.priceRanges };
          }
        }
        // console.log("sort is ", sort);

        const sortOptions = {};
        if (sort) {
          switch (sort.field) {
            case "salePrice":
              sortOptions.salePrice = sort.order === "ASC" ? 1 : -1;
              break;
            case "bestSellingRank":
              sortOptions.bestSellingRank = sort.order === "ASC" ? 1 : -1;
              break;
            case "customerReviewCount":
              sortOptions.customerReviewCount = sort.order === "ASC" ? 1 : -1;
              break;
            default:
              break;
          }
        }
        // console.log("sort options are: ", sortOptions);

        const products = await Product.find(filterConditions, {
          score: { $meta: "textScore" },
        })
          .sort(sortOptions)
          .skip(skip)
          .limit(limit)
          .exec();

        const allProducts = await Product.find(filterConditions).exec();

        const uniqueCategories = [
          ...new Set(allProducts.flatMap((product) => product.categories)),
        ];
        const uniqueManufacturers = [
          ...new Set(allProducts.map((product) => product.manufacturer)),
        ];
        const priceRanges = [
          ...new Set(allProducts.map((product) => product.salePrice_range)),
        ];
        const type = [...new Set(allProducts.map((product) => product.type))];
        const resultCount = allProducts.length;

        return {
          products,
          uniqueCategories,
          uniqueManufacturers,
          priceRanges,
          type,
          resultCount,
        };
      } catch (error) {
        console.error("Error searching products:", error);
        throw new Error("Unable to search products");
      }
    },
  },
};

export default resolvers;
