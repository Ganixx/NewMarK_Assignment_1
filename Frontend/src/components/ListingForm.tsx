import { useForm } from 'react-hook-form'

export type ListingFormValues = {
  title: string
  price: number
  location: string
  description: string
  image_url?: string
}

type Props = {
  onSubmit: (values: ListingFormValues) => Promise<void> | void
}

export default function ListingForm({ onSubmit }: Props) {
  const { register, handleSubmit, formState } = useForm<ListingFormValues>({
    defaultValues: { title: '', price: 0, location: '', description: '', image_url: '' },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'grid', gap: 16, marginTop: 16, maxWidth: 640 }}>
      <label style={{ display: 'grid', gap: 6 }}>
        <div>Title</div>
        <input
          {...register('title', { required: true })}
          style={{ padding: 10, border: '1px solid #e5e7eb', borderRadius: 8, width: '100%' }}
        />
      </label>
      <label style={{ display: 'grid', gap: 6 }}>
        <div>Price</div>
        <input
          type="number"
          step="0.01"
          {...register('price', { valueAsNumber: true, min: 0 })}
          style={{ padding: 10, border: '1px solid #e5e7eb', borderRadius: 8, width: '100%' }}
        />
      </label>
      <label style={{ display: 'grid', gap: 6 }}>
        <div>Location</div>
        <input
          {...register('location', { required: true })}
          style={{ padding: 10, border: '1px solid #e5e7eb', borderRadius: 8, width: '100%' }}
        />
      </label>
      <label style={{ display: 'grid', gap: 6 }}>
        <div>Description</div>
        <textarea
          rows={4}
          {...register('description', { required: true })}
          style={{ padding: 10, border: '1px solid #e5e7eb', borderRadius: 8, width: '100%' }}
        />
      </label>
      <label style={{ display: 'grid', gap: 6 }}>
        <div>Image URL (optional)</div>
        <input
          {...register('image_url')}
          style={{ padding: 10, border: '1px solid #e5e7eb', borderRadius: 8, width: '100%' }}
        />
      </label>
      <button
        type="submit"
        disabled={formState.isSubmitting}
        style={{ padding: '10px 14px', background: '#2563eb', color: '#fff', borderRadius: 8 }}
      >
        {formState.isSubmitting ? 'Saving...' : 'Submit'}
      </button>
    </form>
  )
}


