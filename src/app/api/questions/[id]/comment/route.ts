import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const questionId = params.id;
    
    const comments = await prisma.questionComment.findMany({
      where: { questionId },
      include: {
        user: {
          select: { nomeCompleto: true, name: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    
    return NextResponse.json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const questionId = params.id;
    const body = await request.json();
    const { userId, text } = body;

    if (!userId || !text) {
      return NextResponse.json({ error: 'userId and text are required' }, { status: 400 });
    }

    const comment = await prisma.questionComment.create({
      data: {
        userId,
        questionId,
        text
      },
      include: {
        user: { select: { nomeCompleto: true, name: true } }
      }
    });

    return NextResponse.json(comment);
  } catch (error) {
    console.error('Error posting comment:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
