import Link from "next/link";
function NotFound() {
  return (
    <main className="text-center space-y-6 mt-4">
      <h1 className="text-3xl font-semibold">
        cabin could not be found 
      </h1>
      <Link
        href="/cabins"
        className="inline-block bg-blue-500 text-gray-800 cursor-pointer px-6 py-3 text-lg"
      >
        Go back cabins
      </Link>
    </main>
  );
} 

export default NotFound;
