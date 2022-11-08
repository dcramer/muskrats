export default async function Head({ params }) {
  const userId = await params.username.split("#")[1];

  return (
    <>
      <title>Elon Musk (@elonmusk#{userId}) / Muskrat.club</title>
    </>
  );
}
