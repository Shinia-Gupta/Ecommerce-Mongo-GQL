import Image from "next/image";
import Navbar from '@/components/Navbar'
import ProductList from '@/components/ProductList'

export default function Home() {
  return (
   <>
   <Navbar/>
   <ProductList/>
   </>
  );
}
