import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const questionId = params.id;
    const body = await request.json();
    const userId = body.userId;

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    // Check if like already exists
    const existingLike = await prisma.questionLike.findUnique({
      where: {
        userId_questionId: {
          userId,
          questionId,
        },
      },
    });

    if (existingLike) {
      // Unlike
      await prisma.questionLike.delete({
        where: { id: existingLike.id },
      });
      return NextResponse.json({ liked: false });
    } else {
      // Like
      await prisma.questionLike.create({
        data: {
          userId,
          questionId,
        },
      });
      return NextResponse.json({ liked: true });
    }
  } catch (error) {
    console.error('Error toggling like:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
