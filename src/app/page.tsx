import LogoBlock from "@/app/components/logo-block/LogoBlock";
import Presentation from "@/app/components/presentation/Presentation";
import UseBlock from "@/app/components/use-block/UseBlock";
import Footer from "@/app/components/footer/Footer";
export default function Home() {
  return (
      <div>
          <LogoBlock/>
          <Presentation/>
          <UseBlock/>
          <Footer/>
      </div>

  );
}
