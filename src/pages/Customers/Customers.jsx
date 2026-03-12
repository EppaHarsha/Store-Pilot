import React, { useEffect, useMemo, useState } from "react";
import SearchBar from "../../components/customers/SearchBar.jsx";
import CustomerCard from "../../components/customers/CustomerCard.jsx";
import { useDebounce } from "../../hooks/useDebounce.js";
import PageContainer from "../../components/ui/PageContainer.jsx";
import Skeleton from "../../components/ui/Skeleton.jsx";
import EmptyState from "../../components/ui/EmptyState.jsx";
import { customersService } from "../../services/customersService.js";
import { useToast } from "../../components/ui/ToastProvider.jsx";

const Customers = () => {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 400);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showError } = useToast();

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const data = await customersService.searchCustomers(debouncedQuery);
        if (isMounted) setCustomers(data || []);
      } catch (error) {
        console.error(error);
        if (isMounted) showError("Could not load customers.");
      } finally {
        if (isMounted) setLoading(false);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, [debouncedQuery, showError]);

  const filtered = useMemo(() => customers, [customers]);

  return (
    <PageContainer title="Customers">
      <SearchBar
        value={query}
        onChange={setQuery}
        placeholder="Search by name or phone..."
      />
      <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {loading &&
          Array.from({ length: 6 }).map((_, idx) => (
            <Skeleton key={idx} className="h-28 w-full rounded-2xl" />
          ))}

        {!loading && filtered.length === 0 && (
          <EmptyState
            title="No customers found"
            description="Try a different name or phone number, or add a new customer from the order flow."
          />
        )}

        {!loading &&
          filtered.map((customer) => (
            <CustomerCard key={customer.id} customer={customer} />
          ))}
      </div>
    </PageContainer>
  );
};

export default Customers;

