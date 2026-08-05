import { diskStorage } from 'multer';
import { extname } from 'path';
import { BadRequestException } from '@nestjs/common';

export function multerImageConfig(destinationFolder: string) {
    return {
        storage: diskStorage({
            destination: `./uploads/${destinationFolder}`,
            filename: (req, file, cb) => {
                const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${extname(file.originalname)}`;
                cb(null, uniqueName);
            },
        }),
        fileFilter: (req: any, file: Express.Multer.File, cb: any) => {
            if (!file.mimetype.match(/\/(jpg|jpeg|png|webp)$/)) {
                return cb(new BadRequestException('Only image files are allowed'), false);
            }
            cb(null, true);
        },
        limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    };
}