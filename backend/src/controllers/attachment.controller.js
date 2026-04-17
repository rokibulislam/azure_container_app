import { saveTaskAttachment, getAttachmentAccessUrl } from '../services/attachment.service.js';

export async function uploadTaskAttachment(req, res) {
  const file = req.file;
  if (!file) {
    return res.status(400).json({ message: 'File is required' });
  }

  const attachment = await saveTaskAttachment({
    taskId: Number(req.params.id),
    userId: req.user.id,
    file
  });

  res.status(201).json({ attachment });
}

export async function getAttachmentUrl(req, res) {
  const result = await getAttachmentAccessUrl({
    attachmentId: Number(req.params.id),
    userId: req.user.id
  });

  res.json(result);
}