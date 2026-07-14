import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // 1. Create Agency
  const agency = await prisma.agency.create({
    data: {
      name: 'TrendHive Social Demo Agency',
      planTier: 'enterprise',
    }
  });

  // 2. Create Admin User
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.create({
    data: {
      email: 'admin@trendhive.social',
      password: adminPassword,
      name: 'Brian McKenzie',
      role: 'ADMIN',
      agencyId: agency.id,
      avatar: 'B'
    }
  });

  // 3. Create Clients with Workspaces
  const client1 = await prisma.client.create({
    data: {
      name: 'WaveCo',
      industry: 'Lifestyle',
      retainerValue: 8500,
      industryTags: JSON.stringify(['Retail', 'Lifestyle']),
      agencyId: agency.id,
      workspace: { create: {} }
    },
    include: { workspace: true }
  });

  const client2 = await prisma.client.create({
    data: {
      name: 'LuxeBrand',
      industry: 'Fashion',
      retainerValue: 12000,
      industryTags: JSON.stringify(['Fashion', 'Premium']),
      agencyId: agency.id,
      workspace: { create: {} }
    },
    include: { workspace: true }
  });

  const client3 = await prisma.client.create({
    data: {
      name: 'HealthPlus',
      industry: 'Healthcare',
      retainerValue: 15000,
      industryTags: JSON.stringify(['Healthcare', 'Regulated']),
      agencyId: agency.id,
      workspace: { create: {} }
    },
    include: { workspace: true }
  });

  // 4. Create Client Stakeholder User
  await prisma.user.create({
    data: {
      email: 'client@waveco.test',
      password: adminPassword,
      name: 'WaveCo Client',
      role: 'CLIENT_STAKEHOLDER',
      agencyId: agency.id,
      avatar: 'W',
      workspaceAssignments: {
        create: {
          workspaceId: client1.workspace!.id
        }
      }
    }
  });

  // 5. Create Team Member (Creator)
  await prisma.user.create({
    data: {
      email: 'creator@trendhive.social',
      password: adminPassword,
      name: 'Sarah Chen',
      role: 'CREATOR',
      agencyId: agency.id,
      avatar: 'S',
      workspaceAssignments: {
        create: [
          { workspaceId: client1.workspace!.id },
          { workspaceId: client2.workspace!.id },
        ]
      }
    }
  });

  // 5. Create Campaigns for clients
  const campaign1 = await prisma.campaign.create({
    data: {
      name: 'Summer 2025 Collection',
      clientId: client1.id,
      workspaceId: client1.workspace!.id,
    }
  });

  const campaign2 = await prisma.campaign.create({
    data: {
      name: 'Fashion Week Launch',
      clientId: client2.id,
      workspaceId: client2.workspace!.id,
    }
  });

  // 6. Create Posts
  const now = new Date();
  await prisma.post.create({
    data: {
      title: 'Summer Surf Challenge',
      content: 'Catch the wave this summer with our new collection! 🏄‍♀️🌊 #SummerVibes',
      platform: 'TikTok',
      status: 'draft',
      authorId: admin.id,
      campaignId: campaign1.id,
      scheduledTime: new Date(now.getTime() + 86400000 * 2), // 2 days from now
    }
  });

  await prisma.post.create({
    data: {
      title: 'New Arrivals Announcement',
      content: 'Fresh styles just dropped! Check out our latest arrivals 👗✨ Link in bio.',
      platform: 'Instagram',
      status: 'draft',
      authorId: admin.id,
      campaignId: campaign2.id,
      scheduledTime: new Date(now.getTime() + 86400000 * 3), // 3 days from now
    }
  });

  await prisma.post.create({
    data: {
      title: 'Behind the Scenes Reel',
      content: 'Go behind the scenes of our latest photoshoot! 📸',
      platform: 'Instagram',
      status: 'approved',
      authorId: admin.id,
      campaignId: campaign1.id,
      scheduledTime: new Date(now.getTime() + 86400000), // tomorrow
    }
  });

  await prisma.post.create({
    data: {
      title: 'Weekly Tips Thread',
      content: 'Thread: 10 tips for building your brand on social media 🧵',
      platform: 'Twitter',
      status: 'in_review_client',
      authorId: admin.id,
      campaignId: campaign1.id,
    }
  });

  await prisma.post.create({
    data: {
      title: 'Product Showcase Video',
      content: 'See our top picks for the season in this 60-second showcase!',
      platform: 'YouTube',
      status: 'published',
      authorId: admin.id,
      campaignId: campaign2.id,
      publishedAt: new Date(now.getTime() - 86400000),
    }
  });

  console.log('Seed completed successfully.');
  console.log(`  Agency: ${agency.name} (${agency.id})`);
  console.log(`  Admin: admin@trendhive.social / admin123`);
  console.log(`  Team Member: creator@trendhive.social / admin123`);
  console.log(`  Client: client@waveco.test / admin123`);
  console.log(`  Clients: WaveCo, LuxeBrand, HealthPlus`);
  console.log(`  Posts: 5 demo posts across various statuses`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
