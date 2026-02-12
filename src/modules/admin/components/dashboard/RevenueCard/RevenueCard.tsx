"use client";

import React from "react";
import { RevenueCardProps } from "./interfaces/RevenueCard.interface";
import { RevenueCardSkeleton } from "./components/RevenueCardSkeleton";
import { RevenueCardContent } from "./components/RevenueCardContent";
import { useRevenueCard } from "./hooks/useRevenueCard";

export default function RevenueCard({ revenue, loading }: RevenueCardProps) {
    const { periodText } = useRevenueCard(revenue);

    if (loading) {
        return <RevenueCardSkeleton />;
    }

    return <RevenueCardContent revenue={revenue} periodText={periodText} />;
}
