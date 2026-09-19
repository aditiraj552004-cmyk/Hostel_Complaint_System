import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import FeatureCard from "../components/FeatureCard";
import Footer from "../components/Footer";

function Home() {
  return (
    <>
      <Navbar />

      <Hero />

      <section className="max-w-6xl mx-auto py-16 px-6">

        <h2 className="text-4xl font-bold text-center mb-10">
          Our Features
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">

          <FeatureCard
            title="Complaint Registration"
            description="Submit hostel complaints quickly."
          />

          <FeatureCard
            title="Track Status"
            description="Know the current complaint status."
          />

          <FeatureCard
            title="Image Upload"
            description="Attach images with complaints."
          />

          <FeatureCard
            title="Quick Resolution"
            description="Admins resolve complaints efficiently."
          />

        </div>

      </section>

      <Footer />
    </>
  );
}

export default Home;