import payload from 'payload'

export const handleBookingCreate = async ({ data, req, operation }: any) => {
  if (operation !== 'create') return
  const eventId = data.event as string

  const event = await req.payload.findByID({ collection: 'events', id: eventId })
  const capacity = event?.capacity || 0

  // Count confirmed bookings
  const confirmedBookings = await req.payload.find({
    collection: 'bookings',
    where: { event: { equals: eventId }, status: { equals: 'confirmed' } },
    limit: 0,
  })

  data.status = confirmedBookings.totalDocs < capacity ? 'confirmed' : 'waitlisted'

  return data
}

export const handleBookingUpdate = async ({ doc, req, operation, previousDoc }: any) => {
  console.log(doc)
  // Handle cancellation
  if (operation === 'update' && previousDoc.status !== doc.status && doc.status === 'canceled') {
    await req.payload.create({
      collection: 'bookinglogs',
      req,
      data: {
        booking: doc.id,
        event: doc.event,
        user: doc.user,
        action: 'cancel_confirmed',
        note: 'Booking canceled',
        tenant: doc.user.tenant,
      },
    })

    await req.payload.create({
      collection: 'notifications',
      req,
      data: {
        user: doc.user,
        booking: doc.id,
        type: 'booking_canceled',
        title: 'Booking Canceled',
        message: 'Your booking has been canceled.',
        tenant: doc.user.tenant,
      },
    })

    // Promote oldest waitlisted
    const waitlisted = await req.payload.find({
      collection: 'bookings',
      where: { event: { equals: doc.event.id }, status: { equals: 'waitlisted' } },
      sort: 'createdAt',
      limit: 1,
    })

    if (waitlisted.docs.length > 0) {
      const promoteBooking = waitlisted.docs[0]

      await req.payload.update({
        collection: 'bookings',
        id: promoteBooking.id,
        data: { status: 'confirmed' },
      })

      await req.payload.create({
        collection: 'bookinglogs',
        req,
        data: {
          booking: promoteBooking.id,
          event: doc.event,
          user: promoteBooking.user,
          action: 'promote_from_waitlist',
          note: 'Promoted from waitlist due to cancellation',
          tenant: doc.user.tenant,
        },
      })

      await req.payload.create({
        collection: 'notifications',
        req,
        data: {
          user: promoteBooking.user,
          booking: promoteBooking.id,
          type: 'waitlist_promoted',
          title: 'Booking Confirmed',
          message: 'You have been promoted from the waitlist to confirmed.',
          tenant: doc.user.tenant,
        },
      })
    }
  }
}
