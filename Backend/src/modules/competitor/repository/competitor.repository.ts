import prisma from "../../../config/db";
import { CompetitorStatus, Prisma } from "@prisma/client";

export class CompetitorRepository {
  public static async create(workspaceId: string, userId: string, data: any) {
    const {
      name,
      domain,
      industry,
      companySize,
      headquarters,
      description,
      website,
      linkedin,
      twitter,
      logo,
      status,
      categoryName,
      tags, // array of { name, color }
      contacts, // array of { name, designation, email, linkedin }
      technologies, // array of { technology, category }
      pricingPlans, // array of { planName, price, currency, billingType, description }
      social, // { linkedin, twitter, github, youtube, instagram }
    } = data;

    return prisma.$transaction(async (tx) => {
      // 1. Resolve Category if provided
      let categoryId: string | undefined;
      if (categoryName) {
        const category = await tx.competitorCategory.upsert({
          where: { name: categoryName },
          update: {},
          create: { name: categoryName },
        });
        categoryId = category.id;
      }

      // 2. Prepare tags connectOrCreate
      const tagConnect = tags?.map((t: any) => ({
        where: { name: t.name },
        create: { name: t.name, color: t.color || "#3B82F6" },
      })) || [];

      // 3. Create Competitor
      const competitor = await tx.competitor.create({
        data: {
          workspaceId,
          name,
          domain,
          industry,
          companySize,
          headquarters,
          description,
          website,
          linkedin,
          twitter,
          logo,
          status: status || CompetitorStatus.ACTIVE,
          categoryId,
          createdBy: userId,
          updatedBy: userId,
          tags: {
            connectOrCreate: tagConnect,
          },
          contacts: contacts ? {
            createMany: {
              data: contacts,
            },
          } : undefined,
          technologies: technologies ? {
            createMany: {
              data: technologies,
            },
          } : undefined,
          pricingPlans: pricingPlans ? {
            createMany: {
              data: pricingPlans.map((p: any) => ({
                planName: p.planName,
                price: parseFloat(p.price),
                currency: p.currency || "USD",
                billingType: p.billingType,
                description: p.description,
              })),
            },
          } : undefined,
          social: social ? {
            create: social,
          } : undefined,
        },
        include: {
          category: true,
          tags: true,
          contacts: true,
          technologies: true,
          pricingPlans: true,
          social: true,
        },
      });

      return competitor;
    }, { timeout: 30000 });
  }

  public static async list(workspaceId: string, params: any) {
    const {
      search,
      industry,
      status,
      categoryName,
      companySize,
      createdDateStart,
      createdDateEnd,
      sortBy = "recentlyAdded",
      pageSize = 10,
      cursor,
    } = params;

    const limit = parseInt(pageSize as string) || 10;

    // Base conditions (must belong to this workspace and not be soft-deleted)
    const where: Prisma.CompetitorWhereInput = {
      workspaceId,
      deletedAt: null,
    };

    // Apply Filter conditions
    if (status) {
      where.status = status as CompetitorStatus;
    }
    if (industry) {
      where.industry = { equals: industry, mode: "insensitive" };
    }
    if (companySize) {
      where.companySize = companySize;
    }
    if (categoryName) {
      where.category = { name: { equals: categoryName, mode: "insensitive" } };
    }
    if (createdDateStart || createdDateEnd) {
      where.createdAt = {};
      if (createdDateStart) {
        where.createdAt.gte = new Date(createdDateStart);
      }
      if (createdDateEnd) {
        where.createdAt.lte = new Date(createdDateEnd);
      }
    }

    // Apply Search conditions (Name, Domain, Industry, Technology, Tags, Category)
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { domain: { contains: search, mode: "insensitive" } },
        { industry: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        {
          technologies: {
            some: {
              technology: { contains: search, mode: "insensitive" },
            },
          },
        },
        {
          tags: {
            some: {
              name: { contains: search, mode: "insensitive" },
            },
          },
        },
        {
          category: {
            name: { contains: search, mode: "insensitive" },
          },
        },
      ];
    }

    // Sort order definition
    let orderBy: Prisma.CompetitorOrderByWithRelationInput = { createdAt: "desc" };
    if (sortBy === "name" || sortBy === "alphabetical") {
      orderBy = { name: "asc" };
    } else if (sortBy === "recentlyUpdated") {
      orderBy = { updatedAt: "desc" };
    }

    // Query Total count
    const totalCount = await prisma.competitor.count({ where });

    // Query list
    const competitors = await prisma.competitor.findMany({
      where,
      take: limit + 1, // Get one extra to determine next cursor
      cursor: cursor ? { id: cursor } : undefined,
      skip: cursor ? 1 : 0,
      orderBy,
      include: {
        category: true,
        tags: true,
        contacts: true,
        technologies: true,
        pricingPlans: true,
        social: true,
      },
    });

    let nextCursor: string | null = null;
    let paginatedCompetitors = competitors;

    if (competitors.length > limit) {
      nextCursor = competitors[limit].id;
      paginatedCompetitors = competitors.slice(0, limit);
    }

    return {
      competitors: paginatedCompetitors,
      nextCursor,
      totalCount,
    };
  }

  public static async findById(id: string, workspaceId: string) {
    return prisma.competitor.findFirst({
      where: {
        id,
        workspaceId,
        deletedAt: null,
      },
      include: {
        category: true,
        tags: true,
        contacts: true,
        technologies: true,
        pricingPlans: true,
        social: true,
      },
    });
  }

  public static async findByName(name: string, workspaceId: string) {
    return prisma.competitor.findFirst({
      where: {
        name: { equals: name, mode: "insensitive" },
        workspaceId,
        deletedAt: null,
      },
    });
  }

  public static async findByDomain(domain: string, workspaceId: string) {
    return prisma.competitor.findFirst({
      where: {
        domain: { equals: domain, mode: "insensitive" },
        workspaceId,
        deletedAt: null,
      },
    });
  }

  public static async update(id: string, workspaceId: string, userId: string, data: any) {
    const {
      name,
      domain,
      industry,
      companySize,
      headquarters,
      description,
      website,
      linkedin,
      twitter,
      logo,
      status,
      categoryName,
      tags,
      contacts,
      technologies,
      pricingPlans,
      social,
    } = data;

    return prisma.$transaction(async (tx) => {
      // 1. Resolve Category if provided
      let categoryId: string | undefined | null = undefined;
      if (categoryName !== undefined) {
        if (categoryName) {
          const category = await tx.competitorCategory.upsert({
            where: { name: categoryName },
            update: {},
            create: { name: categoryName },
          });
          categoryId = category.id;
        } else {
          categoryId = null; // Unlink category
        }
      }

      // 2. Prepare tag connections
      let tagsUpdate: any = undefined;
      if (tags) {
        // Disconnect all existing tags first
        tagsUpdate = {
          set: [],
          connectOrCreate: tags.map((t: any) => ({
            where: { name: t.name },
            create: { name: t.name, color: t.color || "#3B82F6" },
          })),
        };
      }

      // 3. Update Sub-entities (Clean and recreate pattern)
      if (contacts) {
        await tx.competitorContact.deleteMany({ where: { competitorId: id } });
      }
      if (technologies) {
        await tx.competitorTechnology.deleteMany({ where: { competitorId: id } });
      }
      if (pricingPlans) {
        await tx.competitorPricing.deleteMany({ where: { competitorId: id } });
      }

      // 4. Update Competitor
      return tx.competitor.update({
        where: { id },
        data: {
          name,
          domain,
          industry,
          companySize,
          headquarters,
          description,
          website,
          linkedin,
          twitter,
          logo,
          status,
          categoryId: categoryId !== undefined ? categoryId : undefined,
          updatedBy: userId,
          tags: tagsUpdate,
          contacts: contacts ? {
            createMany: {
              data: contacts,
            },
          } : undefined,
          technologies: technologies ? {
            createMany: {
              data: technologies,
            },
          } : undefined,
          pricingPlans: pricingPlans ? {
            createMany: {
              data: pricingPlans.map((p: any) => ({
                planName: p.planName,
                price: parseFloat(p.price),
                currency: p.currency || "USD",
                billingType: p.billingType,
                description: p.description,
              })),
            },
          } : undefined,
          social: social ? {
            upsert: {
              create: social,
              update: social,
            },
          } : undefined,
        },
        include: {
          category: true,
          tags: true,
          contacts: true,
          technologies: true,
          pricingPlans: true,
          social: true,
        },
      });
    }, { timeout: 30000 });
  }

  public static async softDelete(id: string, workspaceId: string, userId: string) {
    return prisma.competitor.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        updatedBy: userId,
      },
    });
  }

  public static async archive(id: string, workspaceId: string, userId: string) {
    return prisma.competitor.update({
      where: { id },
      data: {
        status: CompetitorStatus.ARCHIVED,
        updatedBy: userId,
      },
    });
  }

  public static async restore(id: string, workspaceId: string, userId: string) {
    return prisma.competitor.update({
      where: { id },
      data: {
        deletedAt: null,
        status: CompetitorStatus.ACTIVE,
        updatedBy: userId,
      },
    });
  }
}
