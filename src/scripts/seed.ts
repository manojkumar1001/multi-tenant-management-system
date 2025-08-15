import type { Payload } from 'payload'
import payload from 'payload'
import config from '../payload.config.js'

// Seed data for multi-tenant event management system
const seedData = {
  tenants: [
    { name: 'TechCorp Solutions' },
    { name: 'Creative Agency Hub' },
    { name: 'Healthcare Innovation Center' },
    { name: 'Educational Institute' },
  ],

  users: [
    // TechCorp Solutions users (tenant 1)
    { name: 'John Smith', email: 'john.admin@techcorp.com', role: 'admin', tenantIndex: 0 },
    {
      name: 'Sarah Johnson',
      email: 'sarah.organizer@techcorp.com',
      role: 'organizer',
      tenantIndex: 0,
    },
    { name: 'Mike Chen', email: 'mike.attendee@techcorp.com', role: 'attendee', tenantIndex: 0 },
    { name: 'Emily Davis', email: 'emily.attendee@techcorp.com', role: 'attendee', tenantIndex: 0 },
    {
      name: 'Alex Rodriguez',
      email: 'alex.attendee@techcorp.com',
      role: 'attendee',
      tenantIndex: 0,
    },

    // Creative Agency Hub users (tenant 2)
    { name: 'Lisa Thompson', email: 'lisa.admin@creative-hub.com', role: 'admin', tenantIndex: 1 },
    {
      name: 'David Wilson',
      email: 'david.organizer@creative-hub.com',
      role: 'organizer',
      tenantIndex: 1,
    },
    {
      name: 'Jessica Brown',
      email: 'jessica.attendee@creative-hub.com',
      role: 'attendee',
      tenantIndex: 1,
    },
    {
      name: 'Robert Taylor',
      email: 'robert.attendee@creative-hub.com',
      role: 'attendee',
      tenantIndex: 1,
    },

    // Healthcare Innovation Center users (tenant 3)
    {
      name: 'Dr. Maria Garcia',
      email: 'maria.admin@healthinnovation.org',
      role: 'admin',
      tenantIndex: 2,
    },
    {
      name: 'Dr. James Lee',
      email: 'james.organizer@healthinnovation.org',
      role: 'organizer',
      tenantIndex: 2,
    },
    {
      name: 'Nurse Anna Clark',
      email: 'anna.attendee@healthinnovation.org',
      role: 'attendee',
      tenantIndex: 2,
    },
    {
      name: 'Dr. Thomas White',
      email: 'thomas.attendee@healthinnovation.org',
      role: 'attendee',
      tenantIndex: 2,
    },

    // Educational Institute users (tenant 4)
    {
      name: 'Prof. Jennifer Miller',
      email: 'jennifer.admin@edu-institute.edu',
      role: 'admin',
      tenantIndex: 3,
    },
    {
      name: 'Dr. Kevin Anderson',
      email: 'kevin.organizer@edu-institute.edu',
      role: 'organizer',
      tenantIndex: 3,
    },
    {
      name: 'Student Mark Jackson',
      email: 'mark.attendee@edu-institute.edu',
      role: 'attendee',
      tenantIndex: 3,
    },
    {
      name: 'Student Sophie Martin',
      email: 'sophie.attendee@edu-institute.edu',
      role: 'attendee',
      tenantIndex: 3,
    },
  ],

  events: [
    // TechCorp Solutions events
    {
      title: 'Annual Tech Conference 2024',
      description: 'Join us for our annual technology conference featuring the latest innovations.',
      date: new Date('2024-03-15T09:00:00Z'),
      capacity: 100,
      organizerIndex: 1, // Sarah Johnson
      tenantIndex: 0,
    },
    {
      title: 'AI Workshop: Machine Learning Fundamentals',
      description: 'Hands-on workshop covering machine learning basics and practical applications.',
      date: new Date('2024-02-20T14:00:00Z'),
      capacity: 25,
      organizerIndex: 1, // Sarah Johnson
      tenantIndex: 0,
    },
    {
      title: 'Team Building Retreat',
      description: 'Quarterly team building activities and strategy planning session.',
      date: new Date('2024-01-25T10:00:00Z'),
      capacity: 50,
      organizerIndex: 1, // Sarah Johnson
      tenantIndex: 0,
    },

    // Creative Agency Hub events
    {
      title: 'Design Thinking Workshop',
      description: 'Interactive workshop on design thinking methodologies and creative processes.',
      date: new Date('2024-02-28T10:00:00Z'),
      capacity: 30,
      organizerIndex: 6, // David Wilson
      tenantIndex: 1,
    },
    {
      title: 'Client Showcase 2024',
      description: 'Annual presentation of our best creative work and client success stories.',
      date: new Date('2024-04-10T18:00:00Z'),
      capacity: 75,
      organizerIndex: 6, // David Wilson
      tenantIndex: 1,
    },

    // Healthcare Innovation Center events
    {
      title: 'Medical Innovation Summit',
      description: 'Exploring cutting-edge medical technologies and breakthrough treatments.',
      date: new Date('2024-03-05T08:00:00Z'),
      capacity: 150,
      organizerIndex: 10, // Dr. James Lee
      tenantIndex: 2,
    },
    {
      title: 'Patient Care Best Practices',
      description: 'Training session on latest patient care protocols and safety measures.',
      date: new Date('2024-02-15T13:00:00Z'),
      capacity: 40,
      organizerIndex: 10, // Dr. James Lee
      tenantIndex: 2,
    },

    // Educational Institute events
    {
      title: 'Student Research Symposium',
      description: 'Platform for students to present their research projects and findings.',
      date: new Date('2024-04-20T09:00:00Z'),
      capacity: 200,
      organizerIndex: 15, // Dr. Kevin Anderson
      tenantIndex: 3,
    },
    {
      title: 'Academic Excellence Awards Ceremony',
      description: 'Annual ceremony recognizing outstanding academic achievements.',
      date: new Date('2024-05-15T19:00:00Z'),
      capacity: 300,
      organizerIndex: 15, // Dr. Kevin Anderson
      tenantIndex: 3,
    },
  ],
}

async function createNotificationAndLog(
  payload: Payload,
  booking: any,
  event: any,
  user: any,
  type: 'booking_confirmed' | 'waitlisted' | 'booking_canceled',
  action: 'auto_confirm' | 'auto_waitlist' | 'cancel_confirmed',
  note: string,
) {
  // Create notification
  await payload.create({
    collection: 'notifications',
    data: {
      user: user.id,
      booking: booking.id,
      type,
      title: 'Booking Update',
      message: `Your booking for "${event.title}" is ${booking.status}`,
      read: Math.random() > 0.7, // 30% chance of being read
      tenant: user.tenant,
      createdAt: new Date().toDateString(),
    },
  })

  // Create booking log
  await payload.create({
    collection: 'bookinglogs',
    data: {
      booking: booking.id,
      event: event.id,
      user: user.id,
      action,
      note,
      tenant: user.tenant,
      createdAt: new Date().toDateString(),
    },
  })
}

export async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...')

    // Check if data already exists
    const existingTenants = await payload.find({
      collection: 'tenants',
      limit: 1,
    })

    if (existingTenants.totalDocs > 1) {
      console.log('📊 Database already seeded. Skipping...')
      return
    }

    // 1. Create tenants
    console.log('🏢 Creating tenants...')
    const tenants = []
    for (const tenantData of seedData.tenants) {
      const tenant = await payload.create({
        collection: 'tenants',
        data: tenantData,
      })
      tenants.push(tenant)
      console.log(`✅ Created tenant: ${tenant.name}`)
    }

    // 2. Create users
    console.log('👥 Creating users...')
    const users = []
    for (const userData of seedData.users) {
      const user = await payload.create({
        collection: 'users',
        data: {
          name: userData.name,
          email: userData.email,
          password: 'password123', // Default password for all users
          role: userData.role as 'organizer' | 'admin' | 'attendee',
          tenant: tenants[userData.tenantIndex].id,
        },
      })
      users.push(user)
      console.log(
        `✅ Created user: ${user.name} (${user.role}) - ${tenants[userData.tenantIndex].name}`,
      )
    }

    // 3. Create events
    console.log('📅 Creating events...')
    const events = []
    for (const eventData of seedData.events) {
      const event = await payload.create({
        collection: 'events',
        data: {
          title: eventData.title,
          description: eventData.description,
          date: eventData.date.toDateString(),
          capacity: eventData.capacity,
          organizer: users[eventData.organizerIndex].id,
          tenant: tenants[eventData.tenantIndex].id,
        },
      })
      events.push(event)
      console.log(`✅ Created event: ${event.title} - ${tenants[eventData.tenantIndex].name}`)
    }

    // 4. Create bookings with realistic scenarios
    console.log('🎫 Creating bookings...')
    const bookings = []

    // Booking scenarios for each event
    const bookingScenarios = [
      // TechCorp events
      { eventIndex: 0, userIndices: [2, 3, 4], statuses: ['confirmed', 'confirmed', 'waitlisted'] },
      { eventIndex: 1, userIndices: [2, 3], statuses: ['confirmed', 'confirmed'] },
      { eventIndex: 2, userIndices: [2, 3, 4], statuses: ['confirmed', 'confirmed', 'canceled'] },

      // Creative Agency events
      { eventIndex: 3, userIndices: [7, 8], statuses: ['confirmed', 'waitlisted'] },
      { eventIndex: 4, userIndices: [7, 8], statuses: ['confirmed', 'confirmed'] },

      // Healthcare events
      { eventIndex: 5, userIndices: [11, 12], statuses: ['confirmed', 'confirmed'] },
      { eventIndex: 6, userIndices: [11, 12], statuses: ['confirmed', 'waitlisted'] },

      // Educational events
      { eventIndex: 7, userIndices: [15, 16], statuses: ['confirmed', 'confirmed'] },
      { eventIndex: 8, userIndices: [15, 16], statuses: ['confirmed', 'waitlisted'] },
    ]

    for (const scenario of bookingScenarios) {
      const event = events[scenario.eventIndex]

      for (let i = 0; i < scenario.userIndices.length; i++) {
        const user = users[scenario.userIndices[i]]
        const status = scenario.statuses[i] as 'confirmed' | 'waitlisted' | 'canceled'

        const booking = await payload.create({
          collection: 'bookings',
          data: {
            event: event.id,
            user: user.id,
            status,
            tenant: user.tenant,
            createdAt: new Date(
              Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000,
            ).toDateString(), // Random date within last 30 days
          },
        })
        bookings.push(booking)

        // Create corresponding notification and log
        const notificationType =
          status === 'confirmed'
            ? 'booking_confirmed'
            : status === 'waitlisted'
              ? 'waitlisted'
              : 'booking_canceled'
        const action =
          status === 'confirmed'
            ? 'auto_confirm'
            : status === 'waitlisted'
              ? 'auto_waitlist'
              : 'cancel_confirmed'
        const note = status === 'canceled' ? 'User canceled booking' : 'Automatic booking'

        await createNotificationAndLog(
          payload,
          booking,
          event,
          user,
          notificationType,
          action,
          note,
        )

        console.log(`✅ Created booking: ${user.name} -> ${event.title} (${status})`)
      }
    }

    // 5. Create some additional standalone notifications
    console.log('🔔 Creating additional notifications...')
    const additionalNotifications = [
      {
        userIndex: 2,
        bookingIndex: 0,
        type: 'waitlist_promoted',
        title: 'Promoted from Waitlist',
        message: 'Great news! You have been promoted from the waitlist.',
      },
      {
        userIndex: 7,
        bookingIndex: 3,
        type: 'booking_canceled',
        title: 'Booking Canceled',
        message: 'Your booking has been canceled as requested.',
      },
    ]

    for (const notifData of additionalNotifications) {
      await payload.create({
        collection: 'notifications',
        data: {
          user: users[notifData.userIndex].id,
          booking: bookings[notifData.bookingIndex].id,
          type: notifData.type as
            | 'waitlisted'
            | 'booking_confirmed'
            | 'booking_canceled'
            | 'waitlist_promoted',
          title: notifData.title,
          message: notifData.message,
          read: false,
          tenant: users[notifData.userIndex].tenant,
          createdAt: new Date().toDateString(),
        },
      })
    }

    console.log('🎉 Database seeding completed successfully!')
    console.log('\n📋 Summary:')
    console.log(`   🏢 Tenants: ${tenants.length}`)
    console.log(`   👥 Users: ${users.length}`)
    console.log(`   📅 Events: ${events.length}`)
    console.log(`   🎫 Bookings: ${bookings.length}`)
    console.log('\n🔐 Default login credentials:')
    console.log('   Email: john.admin@techcorp.com')
    console.log('   Password: password123')
    console.log('   Role: Admin')
  } catch (error) {
    console.error('❌ Error seeding database:', error)
    throw error
  }
}

// Main execution
const startSeeding = async () => {
  try {
    await payload.init({
      config,
    })

    await seedDatabase()
    process.exit(0)
  } catch (error) {
    console.error('Failed to seed database:', error)
    process.exit(1)
  }
}

startSeeding()
