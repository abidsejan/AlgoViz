import { Outlet } from "react-router";
import SeoManager from "./SeoManager";

export default function RootLayout() {
  return (
    <>
      <SeoManager />
      <Outlet />
    </>
  );
}
