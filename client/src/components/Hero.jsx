function Hero() {
  return (
    <section className="bg-blue-600 text-white py-24">
      <div className="max-w-6xl mx-auto text-center px-6">

        <h1 className="text-5xl font-bold">
          Welcome to HostelCare
        </h1>

        <p className="mt-6 text-xl">
          Report hostel issues, track complaint status,
          and enjoy a smarter hostel experience.
        </p>

        <div className="mt-8 space-x-4">

          <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200">
            Register Complaint
          </button>

          <button className="border border-white px-6 py-3 rounded-lg hover:bg-white hover:text-blue-600">
            Learn More
          </button>

        </div>

      </div>
    </section>
  );
}

export default Hero;