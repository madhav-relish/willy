const express = require('express');
const { PrismaClient } = require('@prisma/client');
const router = express.Router();
const prisma = new PrismaClient();

router.post('/', async (req, res) => {
  const { roomId, data } = req.body;
  try {
    // Check if the room exists
    const roomExists = await prisma.room.findUnique({
      where: { roomId },
    });

    if (!roomExists) {
      return res.status(404).json({ error: 'Room not found' });
    }

    const drawing = await prisma.drawing.create({
      data: { roomId: roomId, data: data },
    });
    console.log('Drawing saved:', drawing);
    res.status(201).json(drawing);
  } catch (error) {
    console.error('Error saving drawing:', error);
    res.status(500).send('Error saving drawing');
  }
});

router.get('/:roomId', async (req, res) => {
  const { roomId } = req.params;
  try {
    const drawings = await prisma.drawing.findMany({
      where: { roomId },
      orderBy: { createdAt: 'asc' },
    });
    res.status(200).json(drawings);
  } catch (error) {
    console.error('Error fetching drawings:', error);
    res.status(500).send('Error fetching drawings');
  }
});

module.exports = router;