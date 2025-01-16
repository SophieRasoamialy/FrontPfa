import path from 'path';
import { IncomingForm } from 'formidable';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end(); // Method Not Allowed
  }

  const form = new IncomingForm();
  form.uploadDir = path.join(process.cwd(), 'images');
  form.keepExtensions = true;

  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(500).json({ error: 'Error uploading image.' });
    }

    const imagePath = files.image.path;
    const imageFileName = path.basename(imagePath);

    // You can process the image further if needed

    const publicImagePath = `images/${imageFileName}`;
    res.status(200).json({ imagePath: publicImagePath });
  });
}
