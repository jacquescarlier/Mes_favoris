import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const isAdmin = cookies().get('admin_session')?.value === 'authenticated';
  if (!isAdmin) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

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
