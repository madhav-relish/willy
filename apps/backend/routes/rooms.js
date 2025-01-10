const express = require('express');
const { PrismaClient } = require('@prisma/client');
const router = express.Router();
const prisma = new PrismaClient();

router.post('/', async (req, res) => {
  const { roomId } = req.body;
  console.log("Room creation Triggered::", roomId)
  try {
    const room = await prisma.room.create({ data: { roomId } });
    console.log('Room created:', room);
    res.status(201).json(room);
  } catch (error) {
    console.error('Error creating room:', error);
    res.status(500).send('Error creating room');
  }
});

router.get('/:roomId', async (req, res) => {
  const { roomId } = req.params;
  try {
    const room = await prisma.room.findUnique({ where: { roomId } });
    if (room) {
      res.status(200).json(room);
    } else {
      res.status(404).send('Room not found');
    }
  } catch (error) {
    console.error('Error fetching room:', error);
    res.status(500).send('Error fetching room');
  }
});

module.exports = router;
