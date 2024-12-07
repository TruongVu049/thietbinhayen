"use client";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
export default function SearchBar({ placeholder }: { placeholder: string }) {
  const router = useRouter();

  const [searchValue, setSearchValue] = useState<string>("");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    router.push(`/search?q=${searchValue}`);
    setSearchValue("");
  }
  return (
    <form onSubmit={handleSubmit} className="ml-auto flex-1 sm:flex-initial">
      <div className="relative">
        <button
          type="submit"
          className="absolute group left-2.5 top-2.5  text-muted-foreground "
        >
          <Search className="h-4 w-4 group-hover:text-rose-500" />
        </button>
        <Input
          type="text"
          name="q"
          value={searchValue ?? ""}
          onChange={(e) => setSearchValue(e.target.value)}
          required
          placeholder={placeholder}
          className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
        />
      </div>
    </form>
  );
}
