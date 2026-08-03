package pka.edu.service.impl;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class FileUploadService {

    private final Cloudinary cloudinary;

    public String uploadFile(MultipartFile file) throws IOException {
        Map uploadResult = cloudinary.uploader().upload(file.getBytes(),
                ObjectUtils.asMap(
                        "resource_type", "image",
                        "folder", "avatars",
                        "format", "jpg",
                        "width", 500,
                        "height", 500,
                        "crop", "fill"
                ));

        return uploadResult.get("secure_url").toString();
    }

    public String uploadDocument(MultipartFile file) throws IOException, pka.edu.exception.ResourceBadRequestException {
        String contentType = file.getContentType();
        if (contentType == null || !(contentType.equals("application/pdf") ||
                contentType.equals("application/vnd.openxmlformats-officedocument.wordprocessingml.document") ||
                contentType.equals("application/msword") ||
                contentType.startsWith("image/") ||
                contentType.contains("zip") ||
                contentType.contains("octet-stream"))) {
            throw new pka.edu.exception.ResourceBadRequestException("Only PDF, Word, Archive and Image files are allowed", null);
        }

        java.io.File tempFile = java.io.File.createTempFile("temp-", file.getOriginalFilename());
        file.transferTo(tempFile);
        
        try {
            Map uploadResult = cloudinary.uploader().upload(tempFile,
                    ObjectUtils.asMap(
                            "resource_type", "auto",
                            "folder", "reports",
                            "use_filename", true,
                            "unique_filename", true
                    ));
            return uploadResult.get("secure_url").toString();
        } finally {
            tempFile.delete();
        }
    }

    public String uploadGeneralFile(MultipartFile file, String folderName) throws IOException, pka.edu.exception.ResourceBadRequestException {
        String contentType = file.getContentType();
        if (contentType == null || !(contentType.equals("application/pdf") ||
                contentType.equals("application/vnd.openxmlformats-officedocument.wordprocessingml.document") ||
                contentType.equals("application/msword") ||
                contentType.startsWith("image/") ||
                contentType.contains("zip") ||
                contentType.contains("rar") ||
                contentType.contains("octet-stream"))) {
            throw new pka.edu.exception.ResourceBadRequestException("Only PDF, Word, Archive and Image files are allowed", null);
        }

        java.io.File tempFile = java.io.File.createTempFile("temp-", file.getOriginalFilename());
        file.transferTo(tempFile);
        
        try {
            Map uploadResult = cloudinary.uploader().upload(tempFile,
                    ObjectUtils.asMap(
                            "resource_type", "auto",
                            "folder", folderName != null ? folderName : "documents",
                            "use_filename", true,
                            "unique_filename", true
                    ));
            return uploadResult.get("secure_url").toString();
        } finally {
            tempFile.delete();
        }
    }
}