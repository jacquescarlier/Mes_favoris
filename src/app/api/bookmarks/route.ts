import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      include: {
        bookmarks: {
          orderBy: { createdAt: 'desc' },
        },
      },
      orderBy: { id: 'asc' },
    });
    return NextResponse.json(categories);
  } catch (error) {
    console.error('Erreur GET /api/bookmarks:', error);
    return NextResponse.json(
      { error: 'Impossible de charger les favoris' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, url, description, categoryId } = body;

    if (!title || !url || !categoryId) {
      return NextResponse.json(
        { error: 'Le titre, l\'URL et la catégorie sont obligatoires.' },
        { status: 400 }
      );
    }

    const newBookmark = await prisma.bookmark.create({
      data: {
        title: title.trim(),
        url: url.trim(),
        description: description ? description.trim() : null,
        categoryId: Number(categoryId),
      },
    });

    return NextResponse.json(newBookmark, { status: 201 });
  } catch (error) {
    console.error('Erreur POST /api/bookmarks:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création du favori' },
      { status: 500 }
    );
  }
}
