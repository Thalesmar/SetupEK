import SecHero from '../Components/Hero/secHero.tsx';
import Services from '../Components/services/services.tsx';
import HotDeals from '../Components/HotDeals/HotDeals.tsx';
import BestDiscount from '../Components/BestDiscount/BestDiscount.tsx';
import NewArrivals from '../Components/NewArrivals/NewArrivals.tsx';
import TopCategories from '../Components/TopCategories/TopCategories.tsx';
import AboutArea from '../Components/About/About.tsx';
import OurBrands from '../Components/Brands/Brands.tsx';
import ReviewSection from '../Components/Reviews/Reviews.tsx';
import SetupEkBlog from '../Components/Blog/Blog.tsx';
import BestSetups from '../Components/Setups/Setups.tsx';
// import InfiniteSlider from '../Components/infiniteSlider/InfiniteSlider.tsx';

const Home = () => {
  return (
    <main>
      <SecHero />
      <Services />
      <HotDeals />
      <BestDiscount />
      <NewArrivals />
      <TopCategories />
      <AboutArea />
      <OurBrands />
      <ReviewSection />
      <SetupEkBlog />
      <BestSetups />
      {/* <InfiniteSlider /> */}
    </main>
  );
};

export default Home;
