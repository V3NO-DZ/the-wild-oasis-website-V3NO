import Spinner from "../components/Spinner";

export default function Loading(): React.JSX.Element {
  return (
    <div className="grid items-center justify-center">
      <Spinner />
      <p className="text-xl text-gray-600">Loading cabin data...</p>
    </div>
  );
}
