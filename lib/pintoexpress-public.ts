export type PublicPackage = {
  id: string;
  name: string;
  slug: string;
  bird_type: "ross" | "cobb" | "quail";
  bird_count: number;
  description: string | null;
  price: number | null;
  active: boolean;
};

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

export async function getPublicPackages(): Promise<PublicPackage[]> {
  if (!url || !key) return [];
  const response = await fetch(
    `${url}/rest/v1/packages?select=id,name,slug,bird_type,bird_count,description,price,active&active=eq.true&order=bird_count.asc`,
    {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
      cache: "no-store",
    }
  );
  if (!response.ok) throw new Error("Não foi possível carregar os pacotes.");
  return response.json();
}
