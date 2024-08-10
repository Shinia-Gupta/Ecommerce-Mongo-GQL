import { gql, useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import queryString from "query-string";
import { useEffect, useState } from "react";
import {
  Dialog,
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  DialogBackdrop,
  DialogPanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import {
  ChevronDownIcon,
  FunnelIcon,
  MinusIcon,
  PlusIcon,
} from "@heroicons/react/20/solid";
import { initializeApollo } from "../../lib/client";
import ProductCard from "@/components/ProductCard";
import PaginationList from "@/components/PaginationList";
import SkeletonCard from "@/components/SkeletonCard";
import NotFound from "../NotFound";

const SEARCH_PRODUCTS = gql`
  query SearchProducts(
    $term: String!
    $skip: Int
    $limit: Int
    $filters: FilterInput
    $sort: SortInput
  ) {
    searchProducts(
      term: $term
      skip: $skip
      limit: $limit
      filters: $filters
      sort: $sort
    ) {
      products {
        _id
        name
        salePrice
        url
        image
        customerReviewCount
      }
      uniqueCategories
      uniqueManufacturers
      priceRanges
      type
      resultCount
    }
  }
`;

export async function getServerSideProps(context) {
  const {
    term,
    skip = 0,
    limit = 20,
    categories = [],
    manufacturers = [],
    types = [],
    priceRanges = [],
    sort,
  } = context.query;
  const apolloClient = initializeApollo();

  const filters = {
    categories: Array.isArray(categories) ? categories : [categories],
    manufacturers: Array.isArray(manufacturers)
      ? manufacturers
      : [manufacturers],
    types: Array.isArray(types) ? types : [types],
    priceRanges: Array.isArray(priceRanges) ? priceRanges : [priceRanges],
  };

  const sortOption = sort ? JSON.parse(sort) : { field: "", order: "ASC" };

  const { data } = await apolloClient.query({
    query: SEARCH_PRODUCTS,
    variables: {
      term,
      skip: parseInt(skip, 10),
      limit: parseInt(limit, 10),
      filters,
      sort: sortOption,
    },
  });

  return {
    props: {
      initialApolloState: apolloClient.cache.extract(),
      data,
      term,
      limit: parseInt(limit, 10),
    },
  };
}

export default function SearchPage({ term, limit }) {
  const router = useRouter();

  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [skip, setSkip] = useState(0);
  const [filtersChanged, setFiltersChanged] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    categories: [],
    manufacturers: [],
    types: [],
    priceRanges: [],
  });
  const [appliedFilters, setAppliedFilters] = useState(selectedFilters);
  const [sortOption, setSortOption] = useState({ field: "", order: "ASC" });

  useEffect(() => {
    setFiltersChanged(
      JSON.stringify(selectedFilters) !== JSON.stringify(appliedFilters)
    );
  }, [selectedFilters, appliedFilters]);

  const { loading, error, data } = useQuery(SEARCH_PRODUCTS, {
    variables: {
      term,
      skip,
      limit,
      filters: appliedFilters,
      sort: sortOption,
    },
    notifyOnNetworkStatusChange: true,
  });

  const handleFilterChange = (section, value) => {
    setSelectedFilters((prev) => {
      const newFilters = { ...prev };
      newFilters[section] = newFilters[section].includes(value)
        ? newFilters[section].filter((item) => item !== value)
        : [...newFilters[section], value]; 
      return newFilters;
    });
  };

  const handleSortChange = (field, sortDir) => {
    setSortOption((prev) => {
      const newSortOption = { field, order: sortDir };
      const query = {
        term,
        skip,
        limit,
        ...appliedFilters,
        sort: JSON.stringify(newSortOption),
      };
      router.push(`?${queryString.stringify(query)}`, undefined, {
        shallow: true,
      });
      return newSortOption;
    });
  };

  const applyFilters = () => {
    setAppliedFilters(selectedFilters);
    const query = {
      term,
      skip,
      limit,
      ...selectedFilters,
      sort: JSON.stringify(sortOption),
    };
    setMobileFiltersOpen(false);
    router.push(`?${queryString.stringify(query)}`, undefined, {
      shallow: true,
    });
  };

  const handleClearFilters = () => {
    setSelectedFilters((prevFilters) => ({
      ...prevFilters,
      categories: [],
      manufacturers: [],
      types: [],
      priceRanges: [],
    }));

    setMobileFiltersOpen(false);
    applyFilters();
  };

  function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
  }
  if (loading)
    return (
      <div style={{ padding: "1rem" }}>
        <div className="flex flex-wrap gap-4 p-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <SkeletonCard key={index} />
          ))}
        </div>
      </div>
    );

  if (error) return <p>Error fetching products: {error.message}</p>;

  const {
    products,
    uniqueCategories,
    uniqueManufacturers,
    priceRanges,
    type,
    resultCount,
  } = data.searchProducts;
  const filters = [
    {
      id: "categories",
      name: "Category",
      options: uniqueCategories.map((category) => ({
        value: category,
        label: category,
        checked: selectedFilters.categories.includes(category),
      })),
    },
    {
      id: "manufacturers",
      name: "Manufacturer",
      options: uniqueManufacturers.map((manufacturer) => ({
        value: manufacturer,
        label: manufacturer,
        checked: selectedFilters.manufacturers.includes(manufacturer),
      })),
    },
    {
      id: "types",
      name: "Type",
      options: type.map((t) => ({
        value: t,
        label: t,
        checked: selectedFilters.types.includes(t),
      })),
    },
    {
      id: "priceRanges",
      name: "Price Range",
      options: priceRanges.map((priceRange) => ({
        value: priceRange,
        label: priceRange,
        checked: selectedFilters.priceRanges.includes(priceRange),
      })),
    },
  ];

  return (
    <div className="bg-white">
      {products.length !== 0 ? (
        <div>
          <Dialog
            open={mobileFiltersOpen}
            onClose={setMobileFiltersOpen}
            className="relative z-40 lg:hidden"
          >
            <DialogBackdrop
              transition
              className="fixed inset-0 bg-black bg-opacity-25 transition-opacity duration-300 ease-linear data-[closed]:opacity-0"
            />
            <div className="fixed inset-0 z-40 flex">
              <DialogPanel
                transition
                className="relative ml-auto flex h-full w-full max-w-xs transform flex-col overflow-y-auto bg-white py-4 pb-12 shadow-xl transition duration-300 ease-in-out data-[closed]:translate-x-full"
              >
                <div className="flex items-center justify-between px-4">
                  <h2 className="text-lg font-medium text-gray-900">Filters</h2>
                  <button
                    type="button"
                    className="-mr-2 flex h-10 w-10 items-center justify-center p-2 text-gray-400 hover:text-gray-500"
                    onClick={() => setMobileFiltersOpen(false)}
                  >
                    <span className="sr-only">Close menu</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>

                <form className="mt-4">
                  {filters.map((section) => (
                    <Disclosure
                      as="div"
                      key={section.id}
                      className="border-t border-gray-200 pt-4 pb-4"
                    >
                      {({ open }) => (
                        <>
                          <DisclosureButton className="w-full flex items-center justify-between px-4 text-gray-400 hover:text-gray-500">
                            <span className="font-medium text-gray-900">
                              {section.name}
                            </span>
                            <span className="ml-6 flex items-center">
                              {open ? (
                                <MinusIcon
                                  className="h-5 w-5"
                                  aria-hidden="true"
                                />
                              ) : (
                                <PlusIcon
                                  className="h-5 w-5"
                                  aria-hidden="true"
                                />
                              )}
                            </span>
                          </DisclosureButton>
                          <DisclosurePanel className="px-4 pt-4 pb-2">
                            <div className="space-y-6">
                              {section.options.map((option, optionIdx) => (
                                <div
                                  key={option.value}
                                  className="flex items-center"
                                >
                                  <input
                                    id={`filter-mobile-${section.id}-${optionIdx}`}
                                    name={`${section.id}[]`}
                                    type="checkbox"
                                    checked={option.checked}
                                    onChange={() =>
                                      handleFilterChange(
                                        section.id,
                                        option.value
                                      )
                                    }
                                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                  />
                                  <label
                                    htmlFor={`filter-mobile-${section.id}-${optionIdx}`}
                                    className="ml-3 min-w-0 flex-1 text-gray-500"
                                  >
                                    {option.label}
                                  </label>
                                </div>
                              ))}
                            </div>
                          </DisclosurePanel>
                        </>
                      )}
                    </Disclosure>
                  ))}
                  <button
                    type="button"
                    className="mt-4 w-full bg-indigo-600 text-white py-2 px-4 rounded"
                    onClick={applyFilters}
                    disabled={!filtersChanged}
                  >
                    Apply Filters
                  </button>
                  <button
                    type="button"
                    className="mt-4 w-full bg-indigo-600 text-white py-2 px-4 rounded"
                    onClick={handleClearFilters}
                  >
                    Clear Filters
                  </button>
                </form>
              </DialogPanel>
            </div>
          </Dialog>

          <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-baseline justify-between border-b border-gray-200 pb-6 pt-24">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900">
                Search results for "{term}"
              </h1>

              <div className="flex items-center">
                <Menu as="div" className="relative inline-block text-left">
                  <MenuButton className="group inline-flex justify-center text-sm font-medium text-gray-700 hover:text-gray-900">
                    Sort
                    <ChevronDownIcon
                      className="-mr-1 ml-1 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
                      aria-hidden="true"
                    />
                  </MenuButton>

                  <MenuItems className="absolute right-0 z-10 mt-2 w-40 origin-top-right bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="py-1">
                      <MenuItem>
                        {({ active }) => (
                          <button
                            onClick={() => handleSortChange("salePrice", "ASC")}
                            className={classNames(
                              active ? "bg-gray-100" : "",
                              "block px-4 py-2 text-sm text-gray-700"
                            )}
                          >
                            Price: Low to High
                          </button>
                        )}
                      </MenuItem>
                      <MenuItem>
                        {({ active }) => (
                          <button
                            onClick={() =>
                              handleSortChange("salePrice", "DESC")
                            }
                            className={classNames(
                              active ? "bg-gray-100" : "",
                              "block px-4 py-2 text-sm text-gray-700"
                            )}
                          >
                            Price: High to Low
                          </button>
                        )}
                      </MenuItem>
                      <MenuItem>
                        {({ active }) => (
                          <button
                            onClick={() =>
                              handleSortChange("bestSellingRank", "ASC")
                            }
                            className={classNames(
                              active ? "bg-gray-100" : "",
                              "block px-4 py-2 text-sm text-gray-700"
                            )}
                          >
                            Best Seller
                          </button>
                        )}
                      </MenuItem>
                      <MenuItem>
                        {({ active }) => (
                          <button
                            onClick={() =>
                              handleSortChange("customerReviewCount", "DESC")
                            }
                            className={classNames(
                              active ? "bg-gray-100" : "",
                              "block px-4 py-2 text-sm text-gray-700"
                            )}
                          >
                            Most Popular
                          </button>
                        )}
                      </MenuItem>
                    </div>
                  </MenuItems>
                </Menu>

                <button
                  type="button"
                  className="ml-4 p-2 text-gray-400 hover:text-gray-500 sm:ml-6 lg:hidden"
                  onClick={() => setMobileFiltersOpen(true)}
                >
                  <span className="sr-only">Filters</span>
                  <FunnelIcon className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>
            </div>

            <section aria-labelledby="products-heading" className="pb-24 pt-6">
              <h2 id="products-heading" className="sr-only">
                Products
              </h2>

              <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-4">
                <form className="hidden lg:block">
                  <h3 className="sr-only">Categories</h3>
                  {filters.map((section) => (
                    <Disclosure
                      as="div"
                      key={section.id}
                      className="border-b border-gray-200 py-6"
                    >
                      {({ open }) => (
                        <>
                          <DisclosureButton className="w-full flex items-center justify-between text-gray-400 hover:text-gray-500">
                            <span className="font-medium text-gray-900">
                              {section.name}
                            </span>
                            <span className="ml-6 flex items-center">
                              {open ? (
                                <MinusIcon
                                  className="h-5 w-5"
                                  aria-hidden="true"
                                />
                              ) : (
                                <PlusIcon
                                  className="h-5 w-5"
                                  aria-hidden="true"
                                />
                              )}
                            </span>
                          </DisclosureButton>
                          <DisclosurePanel className="pt-6">
                            <div className="space-y-4">
                              {section.options.map((option, optionIdx) => (
                                <div
                                  key={option.value}
                                  className="flex items-center"
                                >
                                  <input
                                    id={`filter-${section.id}-${optionIdx}`}
                                    name={`${section.id}[]`}
                                    type="checkbox"
                                    checked={option.checked}
                                    onChange={() =>
                                      handleFilterChange(
                                        section.id,
                                        option.value
                                      )
                                    }
                                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                  />
                                  <label
                                    htmlFor={`filter-${section.id}-${optionIdx}`}
                                    className="ml-3 text-sm text-gray-600"
                                  >
                                    {option.label}
                                  </label>
                                </div>
                              ))}
                            </div>
                          </DisclosurePanel>
                        </>
                      )}
                    </Disclosure>
                  ))}
                  <button
                    type="button"
                    className="mt-4 w-full bg-indigo-600 text-white py-2 px-4 rounded"
                    onClick={applyFilters}
                    disabled={!filtersChanged}
                  >
                    Apply Filters
                  </button>
                  <button
                    type="button"
                    className="mt-4 w-full bg-indigo-600 text-white py-2 px-4 rounded"
                    onClick={handleClearFilters}
                  >
                    Clear Filters
                  </button>
                </form>

                <div className="lg:col-span-3">
                  <div className="bg-white">
                    <div className="mx-auto max-w-2xl px-4 py-4 sm:px-6 sm:py-6 lg:max-w-7xl lg:px-8">
                      <h2 className="sr-only">Products</h2>

                      <div className="mt-6 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
                        {products.map((product) => (
                          <ProductCard
                            key={product._id}
                            title={product.name}
                            id={product._id}
                            image={product.image}
                            url={product.url}
                            price={product.salePrice}
                            reviewCount={product.customerReviewCount}
                          />
                        ))}
                      </div>
                      <PaginationList
                        totalItems={parseInt(resultCount) || 0}
                        itemsPerPage={limit}
                        onPageChange={(newPage) =>
                          setSkip(
                            (newPage - 1) * limit < 0
                              ? 0
                              : (newPage - 1) * limit
                          )
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </main>
        </div>
      ) : (
        <>
          <NotFound />
        </>
      )}
    </div>
  );
}
