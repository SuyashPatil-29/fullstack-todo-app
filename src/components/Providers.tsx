"use client"
import React from "react";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
const queryClient = new QueryClient();

const Providers = ({ children }: { children: React.ReactNode }) => {
  return <div>
    <QueryClientProvider client={queryClient}>
        {children}
    </QueryClientProvider>
  </div>;
};

export default Providers;
