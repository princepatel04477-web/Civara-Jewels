"use client";

import React from "react";
import { useParams } from "next/navigation";
import { CategoryView } from "../../components/CategoryView";

export default function DynamicCategoryPage() {
  const params = useParams();
  const categorySlug = (params?.category as string) || "rings";

  return <CategoryView categorySlug={categorySlug} />;
}
