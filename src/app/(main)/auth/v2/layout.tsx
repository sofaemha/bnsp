import type { ReactNode } from "react";

import { Command } from "lucide-react";

import { Separator } from "@/components/ui/separator";
import { APP_CONFIG } from "@/config/app-config";

export default function Layout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <main>
      <div className="grid h-dvh justify-center p-2 lg:grid-cols-2">
        <div className="relative order-2 hidden h-full rounded-3xl bg-primary lg:flex">
          <div className="absolute top-10 space-y-1 px-10 text-primary-foreground">
            <Command className="size-10" />
            <h1 className="font-medium text-2xl">{APP_CONFIG.name}</h1>
            <p className="text-sm">Sertifikasikan Profesimu!</p>
          </div>

          <div className="absolute bottom-10 flex w-full justify-between px-10">
            <div className="flex-1 space-y-1 text-primary-foreground">
              <h2 className="font-medium">Profil</h2>
              <p className="text-sm">
                PT Maju Jaya merupakan badan independen yang bertanggung jawab kepada Presiden yang memiliki kewenangan
                sebagai otoritas sertifikasi personil dan bertugas melaksanakan sertifikasi kompetensi profesi bagi
                tenaga kerja.
              </p>
            </div>
            <Separator orientation="vertical" className="mx-3 h-auto!" />
            <div className="flex-1 space-y-1 text-primary-foreground">
              <h2 className="font-medium">Kantor</h2>
              <p className="text-sm">
                Jl. Letjen M.T. Haryono No.Kav. 52 3, RT.3/RW.4, Cikoko, Kec. Pancoran, Kota Jakarta Selatan, Daerah
                Khusus Ibukota Jakarta 13630
              </p>
              <p className="text-sm">
                <a href="mailto:admin@majujaya.go.id">admin@majujaya.go.id</a> &nbsp; | &nbsp;
                <a href="tel:+622150202609">(021) 50202609</a>
              </p>
            </div>
          </div>
        </div>
        <div className="relative order-1 flex h-full">{children}</div>
      </div>
    </main>
  );
}
