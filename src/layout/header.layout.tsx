"use client";

import { LogoComponent } from "@/components/logo.component";
import { Links } from "@/constants";

export const HeaderLayout = () => {
  return (
    <header>
      <LogoComponent links={Links.the_void}>
        <h1 id="main-logo">The Void</h1>
      </LogoComponent>
    </header>
  );
};
