import ReviewForm from "./ReviewForm";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 pt-12">
      <h1 className="mb-12 text-3xl font-bold">Stamped Create Review api</h1>
      <ReviewForm />
    </main>
  );
}
