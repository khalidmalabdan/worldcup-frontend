export default function HomePage() {
  return (
    <div className="flex flex-col items-center text-center py-16">
      <h1 className="text-4xl font-bold mb-4 text-gray-900">
        World Cup Fantasy
      </h1>

      <p className="text-lg text-gray-600 max-w-xl mb-10">
        Track matches, make predictions, compete in leagues, and climb the
        leaderboards. Your football journey starts here.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
        <a
          href="/matches"
          className="px-8 py-4 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
        >
          View Matches
        </a>

        <a
          href="/predictions"
          className="px-8 py-4 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition"
        >
          Make Predictions
        </a>

        <a
          href="/leagues"
          className="px-8 py-4 bg-purple-600 text-white rounded-lg shadow hover:bg-purple-700 transition"
        >
          Join a League
        </a>

        <a
          href="/leaderboard"
          className="px-8 py-4 bg-yellow-500 text-white rounded-lg shadow hover:bg-yellow-600 transition"
        >
          Leaderboards
        </a>
      </div>
    </div>
  );
}
