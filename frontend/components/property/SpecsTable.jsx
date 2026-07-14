export default function SpecsTable({ home }) {
  const specs = [
    { label: 'Bedrooms', value: home.bedrooms },
    { label: 'Bathrooms', value: home.bathrooms },
    { label: 'Square Feet', value: home.sqft?.toLocaleString() },
    { label: 'Year Built', value: home.year_built },
    { label: 'Make / Model', value: home.make_model },
    { label: 'Dimensions', value: home.dimensions },
    { label: 'HVAC', value: home.hvac_type },
    { label: 'Insulation', value: home.insulation },
    { label: 'Foundation', value: home.foundation_type },
    { label: 'Category', value: home.category?.replace('-', ' ') },
  ].filter((s) => s.value != null && s.value !== '');

  if (!specs.length) return null;

  return (
    <section aria-labelledby="specs-heading">
      <h2 id="specs-heading" className="text-xl font-semibold text-navy">
        Specifications
      </h2>
      <dl className="mt-4 divide-y divide-slate-200 rounded-lg border border-slate-200">
        {specs.map((spec) => (
          <div key={spec.label} className="flex justify-between gap-4 px-4 py-3 sm:px-6">
            <dt className="text-sm font-medium capitalize text-slate">{spec.label}</dt>
            <dd className="text-sm font-semibold capitalize text-navy">{spec.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
