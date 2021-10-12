const path = require('path');
const fs = require("fs");
const sharp = require('sharp');

/**
 * @module Image_Handler
 */
module.exports = {
    /**
     * Uploads a new image to the public folder and scales it
     * @param {Object} file - the image file to be uploaded
     */
    uploadImage: (file) => {
        return new Promise((resolve, reject) => {
            const tempPath = file.path.replace(/\s+/g, '');
            const targetPath = path.join(__dirname, "../../public/img/" + file.originalname.replace(/\s+/g, ''));
            if (path.extname(file.originalname).toLowerCase() === ".png" || path.extname(file.originalname).toLowerCase() === ".jpg"|| path.extname(file.originalname).toLowerCase() === ".jpeg") {
                sharp(tempPath)
                .resize(400, 250)
                .toFile(targetPath, (err, info) => {
                    if (err) reject(err);
                    fs.unlink(tempPath, err => {
                        if (err) reject(err);
                        resolve(file.originalname.replace(/\s+/g, ''));
                    })
                })

            } else {
                fs.unlink(tempPath.replace(/\s+/g, ''), err => {
                    if (err) reject(err);
                    resolve("File type not allowed!");
                });
            }
        })
    },
    /**
     * Deletes an image fron the public folder by filename
     * @param {string} fileName - the image name for the file to be deleted
     */
    deleteImage: (fileName) => {
        return new Promise((resolve, reject) => {
            if(fileName != "no-image.png" && fileName != undefined && fileName != null) { // this is the default image which must not be deleted, since it's not user-specific
                const targetPath = path.join(__dirname, "../../public/img/" + fileName);
                fs.unlink(targetPath, err => {
                    if(err) reject(err);
                    else {
                        resolve('image has been deleted successfully!');
                    }
                })
            }
            else {
                resolve();
            }
        })
    }
} 