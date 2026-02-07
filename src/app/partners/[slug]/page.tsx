export default function PartnerProfilePage({
  params,
}: {
  params: { slug: string };
}) {
  return <div>partners / {params.slug}</div>;
}
