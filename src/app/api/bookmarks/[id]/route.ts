import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = Number(params.id);
    await prisma.bookmark.delete({
      where: { id },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erreur DELETE /api/bookmarks/[id]:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression du favori' },
      { status: 500 }
    );
  }
}
