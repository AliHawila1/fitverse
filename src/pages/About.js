const About = () => {
  return (
    <div className="min-h-screen bg-gray-100 pt-28 px-6 md:px-12 py-20">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-extrabold text-black mb-6 text-center">
          About <span className="text-orange-500">FitVerse</span>
        </h1>

        <p className="text-lg text-gray-700 mb-12 text-center leading-relaxed">
          At FitVerse, we believe fitness is more than just working out. Our mission
          is to empower everyone to achieve their health goals with science-based
          programs and personalized guidance.
        </p>

        <div className="bg-black text-white p-8 rounded-2xl shadow-xl mb-10">
          <h2 className="text-3xl font-bold mb-4">Our Story</h2>
          <p className="text-gray-300 leading-relaxed">
            Founded by a team of fitness enthusiasts, FitVerse was created to make
            professional workout plans accessible to everyone, no matter your
            experience level.
          </p>
        </div>

        <div className="bg-white border border-gray-200 p-8 rounded-2xl shadow-lg">
          <h2 className="text-3xl font-bold text-black mb-4">
            Our Values
          </h2>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
              Science-backed programs
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
              Step-by-step guidance
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
              Affordable and flexible plans
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default About;
