import ListingForm from "@/components/ListingForm";

export default function NewListingPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-1">Sell Your Gear</h1>
        <p className="text-gray-500">
          Fill out the form below to list your item.
        </p>
      </div>
      <ListingForm />
    </div>
  );
}
