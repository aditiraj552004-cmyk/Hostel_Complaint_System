function FeatureCard({ title, description }) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition">

      <h2 className="text-2xl font-bold text-blue-600">
        {title}
      </h2>

      <p className="mt-3 text-gray-600">
        {description}
      </p>

    </div>
  );
}

export default FeatureCard;